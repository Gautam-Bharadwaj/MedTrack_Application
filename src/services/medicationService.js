/**
 * Medication Inventory & Smart Refill Scheduler Service
 * Handles medication persistence, dosage schedule calculations, stock depletion prediction, and CSV exporting.
 */

const STORAGE_KEY = "medtrack_medications_v1";

const INITIAL_MEDICATIONS = [
  {
    id: "med-201",
    name: "Lisinopril",
    dosage: "10mg",
    form: "Tablet",
    quantityInStock: 28,
    dailyFrequency: 1, // times per day
    pillsPerDose: 1,
    lowStockThreshold: 10,
    prescribingDoctor: "Dr. Robert Chen",
    pharmacyName: "CVS Health Pharmacy #4821",
    instructions: "Take once daily in the morning with water.",
    category: "Cardiovascular",
    lastRefillDate: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: "med-202",
    name: "Metformin ER",
    dosage: "500mg",
    form: "Tablet",
    quantityInStock: 8,
    dailyFrequency: 2,
    pillsPerDose: 1,
    lowStockThreshold: 14,
    prescribingDoctor: "Dr. Sarah Jenkins",
    pharmacyName: "Walgreens Pharmacy #1092",
    instructions: "Take with meal in the morning and evening.",
    category: "Endocrinology",
    lastRefillDate: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: "med-203",
    name: "Atorvastatin",
    dosage: "20mg",
    form: "Tablet",
    quantityInStock: 45,
    dailyFrequency: 1,
    pillsPerDose: 1,
    lowStockThreshold: 10,
    prescribingDoctor: "Dr. Robert Chen",
    pharmacyName: "CVS Health Pharmacy #4821",
    instructions: "Take 1 tablet at bedtime.",
    category: "Cardiovascular",
    lastRefillDate: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: "med-204",
    name: "Amoxicillin",
    dosage: "500mg",
    form: "Capsule",
    quantityInStock: 4,
    dailyFrequency: 3,
    pillsPerDose: 1,
    lowStockThreshold: 9,
    prescribingDoctor: "Dr. Maria Rodriguez",
    pharmacyName: "MedTrack Hospital Pharmacy",
    instructions: "Finish full 10-day course. Take with food.",
    category: "Antibiotics",
    lastRefillDate: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "med-205",
    name: "Omeprazole",
    dosage: "20mg",
    form: "Capsule",
    quantityInStock: 60,
    dailyFrequency: 1,
    pillsPerDose: 1,
    lowStockThreshold: 14,
    prescribingDoctor: "Dr. Alan Vance",
    pharmacyName: "Rite Aid Pharmacy #2041",
    instructions: "Take 30 minutes before first meal of the day.",
    category: "Gastroenterology",
    lastRefillDate: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export const getMedications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDICATIONS));
      return INITIAL_MEDICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading medications from storage", err);
    return INITIAL_MEDICATIONS;
  }
};

export const calculateDaysRemaining = (med) => {
  const dailyConsumption = (med.dailyFrequency || 1) * (med.pillsPerDose || 1);
  if (dailyConsumption <= 0) return 999;
  return Math.floor((med.quantityInStock || 0) / dailyConsumption);
};

export const getMedicationStatus = (med) => {
  const qty = med.quantityInStock || 0;
  const threshold = med.lowStockThreshold || 10;
  const daysLeft = calculateDaysRemaining(med);

  if (qty <= 0) return { label: "Out of Stock", level: "critical", color: "red" };
  if (qty <= threshold || daysLeft <= 5) return { label: "Low Stock - Refill Due", level: "warning", color: "amber" };
  return { label: "In Stock", level: "normal", color: "emerald" };
};

export const saveMedication = (medData) => {
  const list = getMedications();
  if (medData.id) {
    const updatedList = list.map(m => m.id === medData.id ? { ...m, ...medData } : m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  }

  const newMed = {
    ...medData,
    id: `med-${Date.now()}`,
    quantityInStock: Number(medData.quantityInStock),
    dailyFrequency: Number(medData.dailyFrequency),
    pillsPerDose: Number(medData.pillsPerDose) || 1,
    lowStockThreshold: Number(medData.lowStockThreshold) || 10,
    lastRefillDate: new Date().toISOString()
  };

  const updatedList = [newMed, ...list];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return updatedList;
};

export const logDoseTaken = (id) => {
  const list = getMedications();
  const updatedList = list.map(m => {
    if (m.id === id) {
      const pillsDosed = m.pillsPerDose || 1;
      const newQty = Math.max(0, m.quantityInStock - pillsDosed);
      return { ...m, quantityInStock: newQty };
    }
    return m;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return updatedList;
};

export const deleteMedication = (id) => {
  const list = getMedications();
  const updatedList = list.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return updatedList;
};

export const exportMedicationsToCSV = (medications) => {
  if (!medications || medications.length === 0) return "";

  const headers = ["ID", "Medication Name", "Dosage", "Form", "Stock Qty", "Daily Freq", "Days Remaining", "Category", "Doctor", "Pharmacy", "Instructions"];
  const rows = medications.map(m => [
    m.id,
    `"${m.name.replace(/"/g, '""')}"`,
    `"${m.dosage.replace(/"/g, '""')}"`,
    m.form,
    m.quantityInStock,
    m.dailyFrequency,
    calculateDaysRemaining(m),
    `"${(m.category || "").replace(/"/g, '""')}"`,
    `"${(m.prescribingDoctor || "").replace(/"/g, '""')}"`,
    `"${(m.pharmacyName || "").replace(/"/g, '""')}"`,
    `"${(m.instructions || "").replace(/"/g, '""')}"`
  ]);

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
};

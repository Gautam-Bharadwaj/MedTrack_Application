/**
 * Vitals Data Service & Clinical Range Evaluation Engine
 * Handles persistence, statistics calculations, threshold evaluation, and CSV export.
 */

const STORAGE_KEY = "medtrack_vitals_records_v1";

// Initial seed data for patient vitals history
const INITIAL_VITALS = [
  {
    id: "vit-101",
    timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
    systolicBP: 118,
    diastolicBP: 78,
    heartRate: 72,
    bloodGlucose: 95,
    spo2: 98,
    temperature: 98.6,
    bmi: 22.4,
    notes: "Morning baseline check before breakfast",
    recordedBy: "Self"
  },
  {
    id: "vit-102",
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    systolicBP: 124,
    diastolicBP: 82,
    heartRate: 76,
    bloodGlucose: 108,
    spo2: 97,
    temperature: 98.4,
    bmi: 22.4,
    notes: "Post-workout check",
    recordedBy: "Self"
  },
  {
    id: "vit-103",
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    systolicBP: 130,
    diastolicBP: 85,
    heartRate: 80,
    bloodGlucose: 122,
    spo2: 98,
    temperature: 99.1,
    bmi: 22.5,
    notes: "Felt slightly fatigued after work",
    recordedBy: "Dr. Smith (Nurse)"
  },
  {
    id: "vit-104",
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    systolicBP: 121,
    diastolicBP: 80,
    heartRate: 74,
    bloodGlucose: 99,
    spo2: 99,
    temperature: 98.5,
    bmi: 22.5,
    notes: "Regular checkup reading",
    recordedBy: "Self"
  },
  {
    id: "vit-105",
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    systolicBP: 138,
    diastolicBP: 88,
    heartRate: 85,
    bloodGlucose: 142,
    spo2: 96,
    temperature: 98.8,
    bmi: 22.6,
    notes: "High stress after shift",
    recordedBy: "Self"
  },
  {
    id: "vit-106",
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    systolicBP: 122,
    diastolicBP: 79,
    heartRate: 71,
    bloodGlucose: 92,
    spo2: 98,
    temperature: 98.6,
    bmi: 22.5,
    notes: "Fasting morning test",
    recordedBy: "Self"
  },
  {
    id: "vit-107",
    timestamp: new Date().toISOString(),
    systolicBP: 119,
    diastolicBP: 77,
    heartRate: 69,
    bloodGlucose: 96,
    spo2: 99,
    temperature: 98.4,
    bmi: 22.4,
    notes: "Optimal baseline",
    recordedBy: "Self"
  }
];

export const getVitalsRecords = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VITALS));
      return INITIAL_VITALS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load vitals from localStorage", err);
    return INITIAL_VITALS;
  }
};

export const saveVitalsRecord = (record) => {
  const records = getVitalsRecords();
  const newRecord = {
    id: `vit-${Date.now()}`,
    timestamp: record.timestamp || new Date().toISOString(),
    systolicBP: Number(record.systolicBP),
    diastolicBP: Number(record.diastolicBP),
    heartRate: Number(record.heartRate),
    bloodGlucose: Number(record.bloodGlucose),
    spo2: Number(record.spo2),
    temperature: Number(record.temperature),
    bmi: Number(record.bmi) || 22.5,
    notes: record.notes || "",
    recordedBy: record.recordedBy || "Patient"
  };

  const updated = [newRecord, ...records];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteVitalsRecord = (id) => {
  const records = getVitalsRecords();
  const updated = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const evaluateClinicalStatus = (record) => {
  if (!record) return { level: "normal", alerts: [] };

  const alerts = [];

  // Blood Pressure Evaluation
  if (record.systolicBP >= 140 || record.diastolicBP >= 90) {
    alerts.push({ metric: "Blood Pressure", message: "Stage 2 Hypertension Alert (High BP)", severity: "critical" });
  } else if (record.systolicBP >= 130 || record.diastolicBP >= 80) {
    alerts.push({ metric: "Blood Pressure", message: "Stage 1 Elevated Blood Pressure", severity: "warning" });
  } else if (record.systolicBP < 90 || record.diastolicBP < 60) {
    alerts.push({ metric: "Blood Pressure", message: "Hypotension Alert (Low BP)", severity: "warning" });
  }

  // Blood Glucose Evaluation
  if (record.bloodGlucose >= 180) {
    alerts.push({ metric: "Blood Glucose", message: "Hyperglycemia Warning (>180 mg/dL)", severity: "critical" });
  } else if (record.bloodGlucose < 70) {
    alerts.push({ metric: "Blood Glucose", message: "Hypoglycemia Warning (<70 mg/dL)", severity: "critical" });
  }

  // Heart Rate Evaluation
  if (record.heartRate > 100) {
    alerts.push({ metric: "Heart Rate", message: "Tachycardia Detected (>100 bpm)", severity: "warning" });
  } else if (record.heartRate < 50) {
    alerts.push({ metric: "Heart Rate", message: "Bradycardia Detected (<50 bpm)", severity: "warning" });
  }

  // SpO2 Oxygen Saturation
  if (record.spo2 < 95) {
    alerts.push({ metric: "Oxygen Saturation", message: "Low Oxygen Saturation (<95% SpO2)", severity: "critical" });
  }

  // Temperature
  if (record.temperature >= 100.4) {
    alerts.push({ metric: "Temperature", message: "Fever Detected (≥100.4°F)", severity: "warning" });
  }

  const hasCritical = alerts.some(a => a.severity === "critical");
  const hasWarning = alerts.some(a => a.severity === "warning");

  return {
    level: hasCritical ? "critical" : hasWarning ? "warning" : "normal",
    alerts
  };
};

export const calculateVitalsSummary = (records) => {
  if (!records || records.length === 0) return null;

  const count = records.length;
  const avg = (fn) => Math.round(records.reduce((acc, r) => acc + (fn(r) || 0), 0) / count);

  const avgSys = avg(r => r.systolicBP);
  const avgDia = avg(r => r.diastolicBP);
  const avgHR = avg(r => r.heartRate);
  const avgGlucose = avg(r => r.bloodGlucose);
  const avgSpO2 = avg(r => r.spo2);
  const latest = records[0];

  return {
    count,
    avgSystolic: avgSys,
    avgDiastolic: avgDia,
    avgHeartRate: avgHR,
    avgGlucose,
    avgSpO2,
    latest,
    clinicalStatus: evaluateClinicalStatus(latest)
  };
};

export const exportVitalsToCSV = (records) => {
  if (!records || records.length === 0) return "";

  const headers = ["ID", "Timestamp", "Systolic BP (mmHg)", "Diastolic BP (mmHg)", "Heart Rate (bpm)", "Glucose (mg/dL)", "SpO2 (%)", "Temp (°F)", "BMI", "Recorded By", "Notes"];
  const rows = records.map(r => [
    r.id,
    new Date(r.timestamp).toLocaleString(),
    r.systolicBP,
    r.diastolicBP,
    r.heartRate,
    r.bloodGlucose,
    r.spo2,
    r.temperature,
    r.bmi,
    `"${r.recordedBy.replace(/"/g, '""')}"`,
    `"${(r.notes || "").replace(/"/g, '""')}"`
  ]);

  return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
};

import React, { useState, useEffect } from "react";
import "../components/medication/MedicationInventory.css";
import MedicationCard from "../components/medication/MedicationCard";
import MedicationFormModal from "../components/medication/MedicationFormModal";
import RefillScheduleWidget from "../components/medication/RefillScheduleWidget";
import {
  getMedications,
  saveMedication,
  logDoseTaken,
  deleteMedication,
  exportMedicationsToCSV,
  calculateDaysRemaining
} from "../services/medicationService";

export default function MedicationManagementPage({ onNavigate }) {
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMedForEdit, setSelectedMedForEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setMedications(getMedications());
  }, []);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveMedication = (medData) => {
    const updated = saveMedication(medData);
    setMedications(updated);
    setIsModalOpen(false);
    setSelectedMedForEdit(null);
    triggerNotification(`Medication "${medData.name}" saved successfully.`);
  };

  const handleTakeDose = (id) => {
    const updated = logDoseTaken(id);
    setMedications(updated);
    triggerNotification("Dose logged successfully (-1 unit).");
  };

  const handleDeleteMed = (id) => {
    const updated = deleteMedication(id);
    setMedications(updated);
    triggerNotification("Medication removed from inventory.");
  };

  const handleExportCSV = () => {
    const csvContent = exportMedicationsToCSV(medications);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `medtrack_medications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMeds = medications.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.prescribingDoctor.toLowerCase().includes(searchTerm.toLowerCase());

    const daysLeft = calculateDaysRemaining(m);

    if (activeFilter === "low_stock") return matchesSearch && (m.quantityInStock <= m.lowStockThreshold || daysLeft <= 5);
    if (activeFilter === "out_of_stock") return matchesSearch && m.quantityInStock <= 0;
    return matchesSearch;
  });

  const totalMeds = medications.length;
  const lowStockCount = medications.filter((m) => m.quantityInStock <= m.lowStockThreshold || calculateDaysRemaining(m) <= 5).length;
  const outOfStockCount = medications.filter((m) => m.quantityInStock <= 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="med-container">
        {/* Header Section */}
        <div className="med-header">
          <div className="med-title">
            <h1>
              <span>💊</span> Medication Inventory & Refill Manager
            </h1>
            <p className="text-slate-400 text-sm">
              Smart supply tracking, automated dosage depletion countdowns & pharmacy refill alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedMedForEdit(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>➕</span> Add Medication
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
            >
              <span>📥</span> Export CSV
            </button>
          </div>
        </div>

        {notification && (
          <div className="mb-6 p-4 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center justify-between">
            <span>🔔 {notification}</span>
            <button onClick={() => setNotification(null)}>✕</button>
          </div>
        )}

        {/* Header Metric Cards */}
        <div className="med-stats-grid">
          <div className="med-stat-card">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Medications</span>
            <div className="text-3xl font-extrabold text-white mt-1">{totalMeds}</div>
            <span className="text-[11px] text-slate-400">Total tracked items</span>
          </div>

          <div className="med-stat-card">
            <span className="text-xs font-semibold text-amber-400 uppercase">Low Stock Alerts</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-1">{lowStockCount}</div>
            <span className="text-[11px] text-slate-400">&lt; 5 days supply left</span>
          </div>

          <div className="med-stat-card">
            <span className="text-xs font-semibold text-red-400 uppercase">Out of Stock</span>
            <div className="text-3xl font-extrabold text-red-400 mt-1">{outOfStockCount}</div>
            <span className="text-[11px] text-slate-400">Requires urgent re-order</span>
          </div>

          <div className="med-stat-card">
            <span className="text-xs font-semibold text-emerald-400 uppercase">Refill Status</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">
              {totalMeds > 0 ? `${Math.round(((totalMeds - lowStockCount) / totalMeds) * 100)}%` : "100%"}
            </div>
            <span className="text-[11px] text-slate-400">Optimal supply ratio</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeFilter === "all" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All Items ({totalMeds})
            </button>
            <button
              onClick={() => setActiveFilter("low_stock")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeFilter === "low_stock" ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setActiveFilter("out_of_stock")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeFilter === "out_of_stock" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Out of Stock ({outOfStockCount})
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by name, doctor, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Medication Grid & Schedule Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="med-grid">
              {filteredMeds.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-slate-900/40 rounded-2xl border border-slate-800">
                  No matching medications found in inventory.
                </div>
              ) : (
                filteredMeds.map((med) => (
                  <MedicationCard
                    key={med.id}
                    med={med}
                    onTakeDose={handleTakeDose}
                    onEdit={(m) => {
                      setSelectedMedForEdit(m);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeleteMed}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <RefillScheduleWidget
              medications={medications}
              onReorderClick={(m) => triggerNotification(`Refill request sent to ${m.pharmacyName} for ${m.name}.`)}
            />
          </div>
        </div>

        {isModalOpen && (
          <MedicationFormModal
            medication={selectedMedForEdit}
            onSave={handleSaveMedication}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMedForEdit(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

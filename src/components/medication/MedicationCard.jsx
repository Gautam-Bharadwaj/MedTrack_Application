import React from "react";
import { calculateDaysRemaining, getMedicationStatus } from "../../services/medicationService";

export default function MedicationCard({ med, onTakeDose, onEdit, onDelete }) {
  const daysLeft = calculateDaysRemaining(med);
  const status = getMedicationStatus(med);

  const totalMax = Math.max(med.quantityInStock, med.lowStockThreshold * 3, 30);
  const stockPercentage = Math.min(100, Math.round((med.quantityInStock / totalMax) * 100));

  return (
    <div className="med-card">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {med.category || "General Medication"}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{med.name}</h3>
            <p className="text-xs text-slate-400 font-medium">
              {med.dosage} • {med.form}
            </p>
          </div>

          <span className={`pill-badge pill-${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Stock Meter */}
        <div className="bg-slate-900/60 rounded-xl p-3.5 mb-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-slate-300">Remaining Inventory</span>
            <span className="text-white font-extrabold">{med.quantityInStock} units</span>
          </div>

          <div className="progress-bar-bg">
            <div
              className={`progress-bar-fill fill-${status.color}`}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Daily Consumption: {med.dailyFrequency}x / day</span>
            <span className="font-bold text-slate-200">
              ~{daysLeft} days remaining
            </span>
          </div>
        </div>

        {/* Instructions & Pharmacy info */}
        <div className="space-y-2 text-xs text-slate-300 mb-6">
          <p className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
            <span className="text-base">📋</span>
            <span>{med.instructions || "Take as prescribed by doctor."}</span>
          </p>
          <div className="flex items-center justify-between text-slate-400 text-[11px] px-1">
            <span>👨‍⚕️ {med.prescribingDoctor}</span>
            <span>🏥 {med.pharmacyName}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
        <button
          onClick={() => onTakeDose(med.id)}
          disabled={med.quantityInStock <= 0}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition shadow-lg shadow-blue-600/20"
        >
          💊 Take Dose (-1)
        </button>

        <button
          onClick={() => onEdit(med)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition"
        >
          ✏️ Edit
        </button>

        <button
          onClick={() => onDelete(med.id)}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2.5 px-3 rounded-xl border border-red-500/20 transition"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

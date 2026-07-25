import React from "react";
import { calculateDaysRemaining, getMedicationStatus } from "../../services/medicationService";

export default function RefillScheduleWidget({ medications, onReorderClick }) {
  const upcomingRefills = medications
    .map((med) => ({
      ...med,
      daysLeft: calculateDaysRemaining(med),
      status: getMedicationStatus(med)
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <span>⏰</span> Smart Refill Schedule
          </h3>
          <p className="text-xs text-slate-400">
            Predicted depletion timeline based on prescribed daily dosage
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {upcomingRefills.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No active medications scheduled.
          </p>
        ) : (
          upcomingRefills.map((med) => (
            <div
              key={med.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                med.daysLeft <= 3
                  ? "bg-red-500/10 border-red-500/30 text-red-200"
                  : med.daysLeft <= 7
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                  : "bg-slate-800/60 border-slate-700/50 text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-lg font-bold">
                  {med.form === "Tablet" ? "💊" : med.form === "Capsule" ? "💊" : "🧪"}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{med.name}</h4>
                  <p className="text-xs opacity-80">
                    {med.dosage} • {med.quantityInStock} units left
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="text-right">
                  <span className="block text-xs font-black">
                    {med.daysLeft <= 0
                      ? "OUT OF STOCK"
                      : `~${med.daysLeft} Day${med.daysLeft > 1 ? "s" : ""} Left`}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {med.pharmacyName || "Pharmacy"}
                  </span>
                </div>

                <button
                  onClick={() => onReorderClick(med)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition"
                >
                  Order Refill
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

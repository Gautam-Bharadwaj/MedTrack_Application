import React, { useState } from "react";
import { evaluateClinicalStatus } from "../../services/vitalsService";

export default function VitalsEntryForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 72,
    bloodGlucose: 95,
    spo2: 98,
    temperature: 98.6,
    bmi: 22.5,
    notes: "",
    recordedBy: "Self"
  });

  const [previewEvaluation, setPreviewEvaluation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setPreviewEvaluation(evaluateClinicalStatus(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>❤️</span> Log New Vitals Reading
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Record current health metrics for automated clinical evaluation
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-700/50"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Systolic BP (mmHg)
            </label>
            <input
              type="number"
              name="systolicBP"
              min="60"
              max="240"
              required
              value={formData.systolicBP}
              onChange={handleChange}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Diastolic BP (mmHg)
            </label>
            <input
              type="number"
              name="diastolicBP"
              min="40"
              max="140"
              required
              value={formData.diastolicBP}
              onChange={handleChange}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Heart Rate (BPM)
            </label>
            <input
              type="number"
              name="heartRate"
              min="30"
              max="220"
              required
              value={formData.heartRate}
              onChange={handleChange}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Blood Glucose (mg/dL)
            </label>
            <input
              type="number"
              name="bloodGlucose"
              min="40"
              max="500"
              required
              value={formData.bloodGlucose}
              onChange={handleChange}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Oxygen Saturation SpO2 (%)
            </label>
            <input
              type="number"
              name="spo2"
              min="70"
              max="100"
              required
              value={formData.spo2}
              onChange={handleChange}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Body Temp (°F)
            </label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              min="94"
              max="108"
              required
              value={formData.temperature}
              onChange={handleChange}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Clinical Notes & Observations
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional context (e.g. taken after 10 min rest, post-fasting)"
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium text-sm"
          ></textarea>
        </div>

        {previewEvaluation && previewEvaluation.alerts.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-200">
              ⚠️ Live Clinical Warning Preview:
            </p>
            {previewEvaluation.alerts.map((a, idx) => (
              <p key={idx} className="pl-4">• {a.message}</p>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/30"
          >
            Save Vitals Log
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from "react";

export default function MedicationFormModal({ medication, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    form: "Tablet",
    quantityInStock: 30,
    dailyFrequency: 1,
    pillsPerDose: 1,
    lowStockThreshold: 10,
    category: "General",
    prescribingDoctor: "",
    pharmacyName: "",
    instructions: ""
  });

  useEffect(() => {
    if (medication) {
      setFormData(medication);
    }
  }, [medication]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>💊</span> {medication ? "Edit Medication Item" : "Add New Medication"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Medication Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Lisinopril"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Dosage Strength *
              </label>
              <input
                type="text"
                name="dosage"
                required
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g. 10mg or 500mg/5mL"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Form Factor
              </label>
              <select
                name="form"
                value={formData.form}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup/Liquid">Syrup/Liquid</option>
                <option value="Injection">Injection</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Ointment">Ointment</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Initial Stock Qty *
              </label>
              <input
                type="number"
                name="quantityInStock"
                min="0"
                required
                value={formData.quantityInStock}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                min="1"
                required
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Times Daily (Frequency)
              </label>
              <input
                type="number"
                name="dailyFrequency"
                min="1"
                max="8"
                required
                value={formData.dailyFrequency}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Medical Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Cardiovascular, Antibiotic"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Prescribing Doctor
              </label>
              <input
                type="text"
                name="prescribingDoctor"
                value={formData.prescribingDoctor}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Pharmacy Name
              </label>
              <input
                type="text"
                name="pharmacyName"
                value={formData.pharmacyName}
                onChange={handleChange}
                placeholder="City Health Pharmacy"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
              Special Instructions
            </label>
            <textarea
              name="instructions"
              rows="2"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g. Take after breakfast, avoid grapefruit juice"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/30"
            >
              Save Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

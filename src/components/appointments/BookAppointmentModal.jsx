import React, { useState } from "react";
import { getDoctorsList } from "../../services/appointmentService";

export default function BookAppointmentModal({ initialDoctor, onSave, onClose }) {
  const doctors = getDoctorsList();
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctor ? initialDoctor.id : doctors[0].id);

  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const [formData, setFormData] = useState({
    patientName: "John Smith",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    timeSlot: activeDoctor.availableSlots[0] || "09:00 AM",
    type: "Virtual Consultation",
    reasonForVisit: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      specialty: activeDoctor.specialty
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>📅</span> Schedule Appointment
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
              Select Doctor / Specialist *
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => {
                setSelectedDoctorId(e.target.value);
                const doc = doctors.find((d) => d.id === e.target.value);
                if (doc && doc.availableSlots.length > 0) {
                  setFormData((prev) => ({ ...prev, timeSlot: doc.availableSlots[0] }));
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty}) — {d.consultationFee}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Patient Full Name *
              </label>
              <input
                type="text"
                name="patientName"
                required
                value={formData.patientName}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Consultation Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="Virtual Consultation">💻 Virtual Consultation (HD Video)</option>
                <option value="In-Person Visit">🏥 In-Person Hospital Visit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Preferred Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
                Available Time Slot *
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
              >
                {activeDoctor.availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 uppercase">
              Reason for Visit / Chief Symptoms
            </label>
            <textarea
              name="reasonForVisit"
              rows="3"
              required
              value={formData.reasonForVisit}
              onChange={handleChange}
              placeholder="Describe symptoms, medical history context or reasons for appointment..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
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
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

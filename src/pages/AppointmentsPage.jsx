import React, { useState, useEffect } from "react";
import "../components/appointments/Appointments.css";
import BookAppointmentModal from "../components/appointments/BookAppointmentModal";
import AppointmentCalendar from "../components/appointments/AppointmentCalendar";
import {
  getDoctorsList,
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  exportAppointmentsCSV
} from "../services/appointmentService";

export default function AppointmentsPage({ onNavigate }) {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setDoctors(getDoctorsList());
    setAppointments(getAppointments());
  }, []);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBookAppointment = (aptData) => {
    const updated = createAppointment(aptData);
    setAppointments(updated);
    setIsModalOpen(false);
    setSelectedDoctorForModal(null);
    triggerNotification(`Appointment booked with ${aptData.doctorName} for ${aptData.date}!`);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = updateAppointmentStatus(id, newStatus);
    setAppointments(updated);
    triggerNotification(`Appointment status updated to ${newStatus}.`);
  };

  const handleExportCSV = () => {
    const csvContent = exportAppointmentsCSV(appointments);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `medtrack_appointments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApts = appointments.filter((a) => {
    if (filterType === "confirmed") return a.status === "Confirmed";
    if (filterType === "completed") return a.status === "Completed";
    if (filterType === "cancelled") return a.status === "Cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="apt-container">
        {/* Header */}
        <div className="apt-header">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <span>🩺</span> Telemedicine & Doctor Appointments
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Virtual HD video consultations, in-person slot bookings & physician notes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedDoctorForModal(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <span>📅</span> Book New Appointment
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

        {/* Featured Specialist Doctors */}
        <div className="mb-8">
          <h3 className="text-lg font-extrabold text-white mb-4">Featured Medical Specialists</h3>
          <div className="apt-doctor-grid">
            {doctors.map((doc) => (
              <div key={doc.id} className="apt-doctor-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{doc.avatar}</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                      ★ {doc.rating}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base text-white">{doc.name}</h4>
                  <p className="text-xs text-blue-400 font-semibold">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {doc.experienceYears} Years Exp • Fee: {doc.consultationFee}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedDoctorForModal(doc);
                    setIsModalOpen(true);
                  }}
                  className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
                >
                  Book Consult
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                filterType === "all" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              All Appointments ({appointments.length})
            </button>
            <button
              onClick={() => setFilterType("confirmed")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                filterType === "confirmed" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterType("completed")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                filterType === "completed" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              Completed
            </button>
          </div>

          <AppointmentCalendar
            appointments={filteredApts}
            onStatusChange={handleStatusChange}
          />
        </div>

        {isModalOpen && (
          <BookAppointmentModal
            initialDoctor={selectedDoctorForModal}
            onSave={handleBookAppointment}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedDoctorForModal(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

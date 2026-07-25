import React from "react";

export default function AppointmentCalendar({ appointments, onStatusChange, onSelectApt }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-white">Appointment Schedule & Consultations</h3>
          <p className="text-xs text-slate-400">Manage confirmed bookings and clinical consultation logs</p>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-medium">
            No scheduled appointments found.
          </div>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:border-slate-700"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-[10px] font-bold uppercase text-blue-400">
                    {new Date(apt.date).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="text-sm font-black text-white leading-tight">
                    {new Date(apt.date).getDate()}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white">{apt.doctorName}</h4>
                    <span className="text-[11px] text-slate-400">({apt.specialty})</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    🕒 {apt.timeSlot} • <span className="text-blue-400 font-semibold">{apt.type}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    <span className="font-semibold text-slate-300">Reason:</span> {apt.reasonForVisit}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <span
                  className={`apt-badge ${
                    apt.status === "Confirmed"
                      ? "badge-confirmed"
                      : apt.status === "Completed"
                      ? "badge-completed"
                      : "badge-cancelled"
                  }`}
                >
                  {apt.status}
                </span>

                <div className="flex items-center gap-2">
                  {apt.status === "Confirmed" && (
                    <>
                      <button
                        onClick={() => onStatusChange(apt.id, "Completed")}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 rounded-lg border border-emerald-500/30 transition"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => onStatusChange(apt.id, "Cancelled")}
                        className="px-3 py-1.5 text-xs font-semibold bg-red-600/10 text-red-400 hover:bg-red-600/20 rounded-lg border border-red-500/20 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

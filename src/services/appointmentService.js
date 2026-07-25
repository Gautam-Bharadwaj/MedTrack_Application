/**
 * Telemedicine & Appointment Scheduling Service
 * Manages doctor availability, appointment bookings, virtual consult notes, and calendar dates.
 */

const STORAGE_KEY = "medtrack_appointments_v1";

const INITIAL_DOCTORS = [
  {
    id: "doc-1",
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    rating: 4.9,
    experienceYears: 14,
    avatar: "👩‍⚕️",
    availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
    consultationFee: "$120"
  },
  {
    id: "doc-2",
    name: "Dr. Robert Chen",
    specialty: "Endocrinology",
    rating: 4.8,
    experienceYears: 11,
    avatar: "👨‍⚕️",
    availableSlots: ["08:30 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
    consultationFee: "$110"
  },
  {
    id: "doc-3",
    name: "Dr. Maria Rodriguez",
    specialty: "General Pediatrics",
    rating: 5.0,
    experienceYears: 16,
    avatar: "👩‍⚕️",
    availableSlots: ["09:30 AM", "11:30 AM", "02:30 PM", "05:00 PM"],
    consultationFee: "$95"
  },
  {
    id: "doc-4",
    name: "Dr. Alan Vance",
    specialty: "Neurology",
    rating: 4.7,
    experienceYears: 18,
    avatar: "👨‍⚕️",
    availableSlots: ["10:00 AM", "01:00 PM", "03:30 PM"],
    consultationFee: "$150"
  }
];

const INITIAL_APPOINTMENTS = [
  {
    id: "apt-301",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    patientName: "John Smith",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    timeSlot: "10:30 AM",
    type: "Virtual Consultation",
    status: "Confirmed",
    reasonForVisit: "Routine BP follow-up & EKG evaluation review.",
    notes: "Patient reports mild morning headaches. Advised 24-hr BP log."
  },
  {
    id: "apt-302",
    doctorId: "doc-2",
    doctorName: "Dr. Robert Chen",
    specialty: "Endocrinology",
    patientName: "John Smith",
    date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    timeSlot: "01:30 PM",
    type: "In-Person Visit",
    status: "Confirmed",
    reasonForVisit: "HbA1c quarterly diabetes review.",
    notes: "Bring recent lab test results."
  },
  {
    id: "apt-303",
    doctorId: "doc-3",
    doctorName: "Dr. Maria Rodriguez",
    specialty: "General Pediatrics",
    patientName: "Emily Smith",
    date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    timeSlot: "09:30 AM",
    type: "Virtual Consultation",
    status: "Completed",
    reasonForVisit: "Seasonal allergy evaluation.",
    notes: "Prescribed antihistamine nasal spray for 14 days."
  }
];

export const getDoctorsList = () => INITIAL_DOCTORS;

export const getAppointments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading appointments storage", err);
    return INITIAL_APPOINTMENTS;
  }
};

export const createAppointment = (aptData) => {
  const list = getAppointments();
  const newApt = {
    ...aptData,
    id: `apt-${Date.now()}`,
    status: "Confirmed",
    createdAt: new Date().toISOString()
  };
  const updated = [newApt, ...list];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateAppointmentStatus = (id, newStatus, newNotes = null) => {
  const list = getAppointments();
  const updated = list.map((a) => {
    if (a.id === id) {
      return {
        ...a,
        status: newStatus,
        notes: newNotes !== null ? newNotes : a.notes
      };
    }
    return a;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const cancelAppointment = (id) => {
  return updateAppointmentStatus(id, "Cancelled");
};

export const exportAppointmentsCSV = (appointments) => {
  if (!appointments || appointments.length === 0) return "";
  const headers = ["ID", "Doctor", "Specialty", "Patient", "Date", "Time Slot", "Type", "Status", "Reason"];
  const rows = appointments.map((a) => [
    a.id,
    `"${a.doctorName}"`,
    `"${a.specialty}"`,
    `"${a.patientName}"`,
    a.date,
    a.timeSlot,
    a.type,
    a.status,
    `"${(a.reasonForVisit || "").replace(/"/g, '""')}"`
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
};

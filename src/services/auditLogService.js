/**
 * Security Audit Log & RBAC Service
 * Tracks user access events, permission modifications, authentication attempts, and MFA security logs.
 */

const STORAGE_KEY = "medtrack_audit_logs_v1";

const INITIAL_AUDIT_LOGS = [
  {
    id: "log-401",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    userEmail: "admin@medtrack.org",
    role: "Hospital Admin",
    action: "USER_LOGIN_SUCCESS",
    ipAddress: "192.168.1.105",
    device: "Chrome (macOS)",
    severity: "INFO",
    details: "Authenticated via 2FA TOTP code."
  },
  {
    id: "log-402",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    userEmail: "dr.smith@medtrack.org",
    role: "Doctor",
    action: "PATIENT_RECORD_VIEW",
    ipAddress: "10.0.4.12",
    device: "Safari (iOS)",
    severity: "INFO",
    details: "Accessed vitals history for Patient ID #8921."
  },
  {
    id: "log-403",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    userEmail: "unknown@external.net",
    role: "Guest",
    action: "FAILED_LOGIN_ATTEMPT",
    ipAddress: "45.132.18.91",
    device: "Firefox (Linux)",
    severity: "WARNING",
    details: "Invalid password attempt (3 consecutive failures)."
  },
  {
    id: "log-404",
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    userEmail: "admin@medtrack.org",
    role: "Hospital Admin",
    action: "ROLE_PERMISSION_UPDATE",
    ipAddress: "192.168.1.105",
    device: "Chrome (macOS)",
    severity: "HIGH",
    details: "Granted 'Prescription Export' permissions to Nurse Specialist role."
  },
  {
    id: "log-405",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    userEmail: "tech.john@medtrack.org",
    role: "Technician",
    action: "MAINTENANCE_LOG_UPDATE",
    ipAddress: "192.168.1.200",
    device: "Edge (Windows)",
    severity: "INFO",
    details: "Updated maintenance status for MRI Scanner #102."
  }
];

export const getAuditLogs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading audit logs", err);
    return INITIAL_AUDIT_LOGS;
  }
};

export const recordAuditEntry = (action, details, severity = "INFO", userEmail = "admin@medtrack.org") => {
  const logs = getAuditLogs();
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userEmail,
    role: "Hospital Admin",
    action,
    ipAddress: "127.0.0.1 (Local Session)",
    device: "Web Browser Client",
    severity,
    details
  };
  const updated = [newLog, ...logs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearAuditLogs = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
};

export const exportAuditLogsCSV = (logs) => {
  if (!logs || logs.length === 0) return "";
  const headers = ["Log ID", "Timestamp", "User Email", "Role", "Action", "IP Address", "Device", "Severity", "Details"];
  const rows = logs.map((l) => [
    l.id,
    l.timestamp,
    `"${l.userEmail}"`,
    l.role,
    l.action,
    l.ipAddress,
    `"${l.device}"`,
    l.severity,
    `"${(l.details || "").replace(/"/g, '""')}"`
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
};

import React, { useState, useEffect } from "react";
import "../components/security/SecurityAudit.css";
import AuditLogsTable from "../components/security/AuditLogsTable";
import MfaSetupWizard from "../components/security/MfaSetupWizard";
import {
  getAuditLogs,
  recordAuditEntry,
  clearAuditLogs,
  exportAuditLogsCSV
} from "../services/auditLogService";

export default function SecurityAuditDashboardPage({ onNavigate }) {
  const [logs, setLogs] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEnableMfa = () => {
    const updated = recordAuditEntry("MFA_ENROLLED_SUCCESS", "Enrolled device in 2FA TOTP authentication.", "HIGH");
    setLogs(updated);
    triggerNotification("MFA Security has been successfully enabled on your account.");
  };

  const handleClearLogs = () => {
    setLogs(clearAuditLogs());
    triggerNotification("Audit log history cleared.");
  };

  const handleExportCSV = () => {
    const csvContent = exportAuditLogsCSV(logs);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `medtrack_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalLogs = logs.length;
  const warningCount = logs.filter((l) => l.severity === "WARNING").length;
  const highSeverityCount = logs.filter((l) => l.severity === "HIGH").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="sec-container">
        {/* Header */}
        <div className="sec-header">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <span>🛡️</span> Security Center & Audit Trail
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Role-Based Access Control (RBAC), multi-factor security, and system event logging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <span>📥</span> Export Audit Log CSV
            </button>
            <button
              onClick={handleClearLogs}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-red-400 font-semibold text-xs rounded-xl border border-slate-700 transition"
            >
              <span>🗑️</span> Clear Logs
            </button>
          </div>
        </div>

        {notification && (
          <div className="mb-6 p-4 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center justify-between">
            <span>🔔 {notification}</span>
            <button onClick={() => setNotification(null)}>✕</button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="sec-card">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Audit Events</span>
            <div className="text-3xl font-extrabold text-white mt-1">{totalLogs}</div>
            <span className="text-[11px] text-slate-400">HIPAA compliant logging</span>
          </div>

          <div className="sec-card">
            <span className="text-xs font-semibold text-amber-400 uppercase">Warning Alerts</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-1">{warningCount}</div>
            <span className="text-[11px] text-slate-400">Failed auth & suspicious IPs</span>
          </div>

          <div className="sec-card">
            <span className="text-xs font-semibold text-red-400 uppercase">High Severity Changes</span>
            <div className="text-3xl font-extrabold text-red-400 mt-1">{highSeverityCount}</div>
            <span className="text-[11px] text-slate-400">Permission & MFA updates</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AuditLogsTable logs={logs} onClear={handleClearLogs} />
          </div>

          <div className="lg:col-span-1">
            <MfaSetupWizard onEnableMfa={handleEnableMfa} />
          </div>
        </div>
      </div>
    </div>
  );
}

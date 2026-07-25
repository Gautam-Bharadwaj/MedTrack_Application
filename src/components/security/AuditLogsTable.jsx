import React, { useState } from "react";

export default function AuditLogsTable({ logs, onClear }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    if (severityFilter === "ALL") return matchesSearch;
    return matchesSearch && log.severity === severityFilter;
  });

  return (
    <div className="sec-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-white">Security & Audit Event Trail</h3>
          <p className="text-xs text-slate-400">HIPAA-compliant system activity and access logging</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search email, action, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500 w-full sm:w-48"
          />

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO Only</option>
            <option value="WARNING">WARNING Only</option>
            <option value="HIGH">HIGH Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="p-3">Timestamp</th>
              <th className="p-3">User Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action Event</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Event Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-500 font-medium">
                  No matching security log entries found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((l) => (
                <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                  <td className="p-3 font-medium text-slate-300">
                    {new Date(l.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td className="p-3 text-white font-semibold">{l.userEmail}</td>
                  <td className="p-3 text-slate-400">{l.role}</td>
                  <td className="p-3 font-mono font-bold text-blue-400">{l.action}</td>
                  <td className="p-3 font-mono text-slate-400">{l.ipAddress}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        l.severity === "HIGH"
                          ? "severity-high"
                          : l.severity === "WARNING"
                          ? "severity-warning"
                          : "severity-info"
                      }`}
                    >
                      {l.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 max-w-[240px] truncate">{l.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

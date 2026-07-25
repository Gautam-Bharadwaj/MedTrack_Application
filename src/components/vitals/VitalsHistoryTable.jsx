import React, { useState } from "react";
import { evaluateClinicalStatus } from "../../services/vitalsService";

export default function VitalsHistoryTable({ records, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  const filteredRecords = records.filter((r) => {
    const evalStatus = evaluateClinicalStatus(r);
    const matchesSearch =
      r.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterSeverity === "all") return matchesSearch;
    if (filterSeverity === "warning") return matchesSearch && evalStatus.level === "warning";
    if (filterSeverity === "critical") return matchesSearch && evalStatus.level === "critical";
    if (filterSeverity === "normal") return matchesSearch && evalStatus.level === "normal";
    return matchesSearch;
  });

  return (
    <div className="vitals-table-wrapper">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Vitals History Log</h3>
          <p className="text-sm text-slate-400">
            Chronological records with health status tags
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search notes or recorder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900/80 border border-slate-700 text-xs text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500 w-full sm:w-48"
          />

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-900/80 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="normal">Normal Only</option>
            <option value="warning">Warning Only</option>
            <option value="critical">Critical Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="vitals-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>BP (mmHg)</th>
              <th>Heart Rate</th>
              <th>Glucose</th>
              <th>SpO2</th>
              <th>Temp</th>
              <th>Status Badge</th>
              <th>Notes</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-500">
                  No matching vitals records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => {
                const evalRes = evaluateClinicalStatus(r);
                return (
                  <tr key={r.id}>
                    <td className="font-medium text-slate-200">
                      {new Date(r.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td>
                      <span className="font-bold text-white">
                        {r.systolicBP}/{r.diastolicBP}
                      </span>
                    </td>
                    <td>{r.heartRate} bpm</td>
                    <td>{r.bloodGlucose} mg/dL</td>
                    <td>{r.spo2}%</td>
                    <td>{r.temperature}°F</td>
                    <td>
                      {evalRes.level === "normal" && (
                        <span className="badge-normal">Optimal</span>
                      )}
                      {evalRes.level === "warning" && (
                        <span className="badge-warning">Warning</span>
                      )}
                      {evalRes.level === "critical" && (
                        <span className="badge-critical">Critical Alert</span>
                      )}
                    </td>
                    <td className="max-w-[200px] truncate text-slate-400 text-xs">
                      {r.notes || "—"}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => onDelete(r.id)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold p-1 hover:bg-red-500/10 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

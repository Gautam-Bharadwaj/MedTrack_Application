import React, { useState } from "react";

export default function LabResultsTable({ labRecords }) {
  const [selectedLab, setSelectedLab] = useState(labRecords[0] || null);

  return (
    <div className="space-y-6">
      <div className="ehr-card">
        <h3 className="text-lg font-extrabold text-white mb-1">🧪 Diagnostic Lab Reports</h3>
        <p className="text-xs text-slate-400 mb-4">Official lab panel results and biometric references</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {labRecords.map((lab) => (
            <div
              key={lab.id}
              onClick={() => setSelectedLab(lab)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                selectedLab && selectedLab.id === lab.id
                  ? "bg-blue-600/15 border-blue-500 text-white shadow-lg"
                  : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-blue-400">{lab.category}</span>
                <span className="text-[10px] text-slate-400">{lab.date}</span>
              </div>
              <h4 className="font-extrabold text-sm text-white mb-1">{lab.testName}</h4>
              <p className="text-xs text-slate-400">{lab.labName}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedLab && (
        <div className="ehr-card">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div>
              <h4 className="text-base font-extrabold text-white">{selectedLab.testName}</h4>
              <p className="text-xs text-slate-400">
                Ordered by {selectedLab.orderingDoctor} • {selectedLab.labName} ({selectedLab.date})
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-xs">
              {selectedLab.status}
            </span>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="p-2.5">Parameter</th>
                  <th className="p-2.5">Observed Value</th>
                  <th className="p-2.5">Reference Range</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedLab.results.map((r, idx) => (
                  <tr key={idx} className="border-b border-slate-800/40">
                    <td className="p-2.5 font-semibold text-white">{r.parameter}</td>
                    <td className="p-2.5 font-bold text-slate-200">
                      {r.value} {r.unit}
                    </td>
                    <td className="p-2.5 text-slate-400">{r.referenceRange}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === "HIGH"
                            ? "bg-red-500/15 text-red-300 border border-red-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-slate-300">Physician Notes:</span>
            <p className="text-slate-400 mt-1">{selectedLab.doctorNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

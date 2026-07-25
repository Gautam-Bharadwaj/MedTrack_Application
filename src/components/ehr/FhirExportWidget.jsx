import React from "react";
import { exportToFhirJson } from "../../services/ehrService";

export default function FhirExportWidget({ labRecords }) {
  const handleExportFhir = () => {
    const fhirContent = exportToFhirJson(labRecords);
    const blob = new Blob([fhirContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fhir_diagnostic_bundle_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="ehr-card space-y-3 text-xs">
      <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
        <span>🌐</span> FHIR R4 Standard Data Exporter
      </h3>
      <p className="text-slate-400">
        Export electronic health records in HL7 FHIR (Fast Healthcare Interoperability Resources) JSON specification.
      </p>

      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-blue-400">
        Bundle.resourceType = "DiagnosticReport" (HL7.org/fhir/R4)
      </div>

      <button
        onClick={handleExportFhir}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
      >
        <span>📥</span> Download FHIR R4 JSON Bundle
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "../components/ehr/EhrMedicalRecords.css";
import LabResultsTable from "../components/ehr/LabResultsTable";
import FhirExportWidget from "../components/ehr/FhirExportWidget";
import { getLabResults, exportEhrToCSV } from "../services/ehrService";

export default function MedicalRecordsPage({ onNavigate }) {
  const [labRecords, setLabRecords] = useState([]);

  useEffect(() => {
    setLabRecords(getLabResults());
  }, []);

  const handleExportCSV = () => {
    const csvContent = exportEhrToCSV(labRecords);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ehr_lab_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="ehr-container">
        {/* Header */}
        <div className="ehr-header">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <span>📋</span> Electronic Health Records (EHR) & Lab Results
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Diagnostic laboratory reports, blood chemistry profiles & FHIR medical data interoperability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <span>📥</span> Export CSV Summary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LabResultsTable labRecords={labRecords} />
          </div>

          <div className="lg:col-span-1">
            <FhirExportWidget labRecords={labRecords} />
          </div>
        </div>
      </div>
    </div>
  );
}

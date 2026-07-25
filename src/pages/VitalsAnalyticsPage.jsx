import React, { useState, useEffect } from "react";
import "../components/vitals/VitalsAnalytics.css";
import VitalsChartCard from "../components/vitals/VitalsChartCard";
import VitalsEntryForm from "../components/vitals/VitalsEntryForm";
import VitalsHistoryTable from "../components/vitals/VitalsHistoryTable";
import {
  getVitalsRecords,
  saveVitalsRecord,
  deleteVitalsRecord,
  calculateVitalsSummary,
  exportVitalsToCSV
} from "../services/vitalsService";

export default function VitalsAnalyticsPage({ onNavigate }) {
  const [records, setRecords] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const data = getVitalsRecords();
    setRecords(data);
    setSummary(calculateVitalsSummary(data));
  }, []);

  const handleAddVitals = (newEntry) => {
    const updated = saveVitalsRecord(newEntry);
    setRecords(updated);
    setSummary(calculateVitalsSummary(updated));
    setShowLogModal(false);
  };

  const handleDeleteVitals = (id) => {
    const updated = deleteVitalsRecord(id);
    setRecords(updated);
    setSummary(calculateVitalsSummary(updated));
  };

  const handleExport = () => {
    const csvContent = exportVitalsToCSV(records);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `medtrack_vitals_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const latest = summary?.latest;
  const status = summary?.clinicalStatus;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="vitals-container">
        {/* Header Section */}
        <div className="vitals-header">
          <div className="vitals-title-group">
            <h1>
              <span>📊</span> Patient Health Vitals & Analytics
            </h1>
            <p>
              Real-time biometric monitoring, historical trends & automated clinical decision support.
            </p>
          </div>

          <div className="vitals-actions">
            <button
              onClick={() => setShowLogModal(true)}
              className="vitals-btn vitals-btn-primary"
            >
              <span>➕</span> Log New Vitals
            </button>
            <button
              onClick={handleExport}
              className="vitals-btn vitals-btn-secondary"
            >
              <span>📥</span> Export CSV Report
            </button>
          </div>
        </div>

        {/* Clinical Alert Banner if Warning/Critical */}
        {status && status.alerts.length > 0 && (
          <div
            className={`vitals-alert-banner ${
              status.level === "critical" ? "alert-critical" : "alert-warning"
            }`}
          >
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-1">
                Clinical Attention Required ({status.alerts.length} Alert{status.alerts.length > 1 ? "s" : ""})
              </h4>
              <ul className="text-xs space-y-1 list-disc list-inside">
                {status.alerts.map((a, i) => (
                  <li key={i}>{a.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Quick Summary Cards Grid */}
        <div className="vitals-summary-grid">
          {/* Blood Pressure Card */}
          <div className="vitals-card">
            <div className="vitals-card-top">
              <span className="vitals-card-title">Blood Pressure</span>
              <div className="vitals-card-icon icon-blue">🩺</div>
            </div>
            <div className="vitals-card-value">
              {latest ? `${latest.systolicBP}/${latest.diastolicBP}` : "—"}
              <span className="vitals-card-unit">mmHg</span>
            </div>
            <div className="vitals-card-subtitle">
              7-Day Avg: {summary ? `${summary.avgSystolic}/${summary.avgDiastolic}` : "—"} mmHg
            </div>
          </div>

          {/* Blood Glucose Card */}
          <div className="vitals-card">
            <div className="vitals-card-top">
              <span className="vitals-card-title">Blood Glucose</span>
              <div className="vitals-card-icon icon-amber">🩸</div>
            </div>
            <div className="vitals-card-value">
              {latest ? latest.bloodGlucose : "—"}
              <span className="vitals-card-unit">mg/dL</span>
            </div>
            <div className="vitals-card-subtitle">
              7-Day Avg: {summary ? summary.avgGlucose : "—"} mg/dL
            </div>
          </div>

          {/* Heart Rate Card */}
          <div className="vitals-card">
            <div className="vitals-card-top">
              <span className="vitals-card-title">Heart Rate</span>
              <div className="vitals-card-icon icon-red">💓</div>
            </div>
            <div className="vitals-card-value">
              {latest ? latest.heartRate : "—"}
              <span className="vitals-card-unit">BPM</span>
            </div>
            <div className="vitals-card-subtitle">
              7-Day Avg: {summary ? summary.avgHeartRate : "—"} BPM
            </div>
          </div>

          {/* Oxygen Saturation Card */}
          <div className="vitals-card">
            <div className="vitals-card-top">
              <span className="vitals-card-title">Oxygen Saturation</span>
              <div className="vitals-card-icon icon-emerald">🫁</div>
            </div>
            <div className="vitals-card-value">
              {latest ? latest.spo2 : "—"}
              <span className="vitals-card-unit">% SpO2</span>
            </div>
            <div className="vitals-card-subtitle">
              7-Day Avg: {summary ? summary.avgSpO2 : "—"} %
            </div>
          </div>
        </div>

        {/* Modal for adding log */}
        {showLogModal && (
          <div className="mb-8">
            <VitalsEntryForm
              onSave={handleAddVitals}
              onCancel={() => setShowLogModal(false)}
            />
          </div>
        )}

        {/* Charts & Analytics section */}
        <div className="vitals-charts-grid">
          <VitalsChartCard records={records} />

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                💡 Clinical Insights & Guidelines
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Automated baseline assessment generated from American Heart Association (AHA) and ADA clinical benchmarks.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                  <span className="font-bold text-blue-400">Normal Blood Pressure:</span>
                  <p className="text-slate-300 mt-0.5">Systolic &lt; 120 mmHg AND Diastolic &lt; 80 mmHg.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                  <span className="font-bold text-amber-400">Fasting Blood Sugar:</span>
                  <p className="text-slate-300 mt-0.5">Normal: 70–99 mg/dL. Prediabetes: 100–125 mg/dL.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                  <span className="font-bold text-emerald-400">SpO2 Oxygen Target:</span>
                  <p className="text-slate-300 mt-0.5">Healthy baseline: 95%–100%. Alert doctor if &lt; 92%.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <button
                onClick={() => onNavigate("dashboard")}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                ← Back to Main Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* History Table Log */}
        <VitalsHistoryTable records={records} onDelete={handleDeleteVitals} />
      </div>
    </div>
  );
}

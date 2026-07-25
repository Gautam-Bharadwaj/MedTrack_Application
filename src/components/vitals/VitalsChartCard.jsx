import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export default function VitalsChartCard({ records }) {
  const [activeMetric, setActiveMetric] = useState("bp");
  const [timeRange, setTimeRange] = useState("7d");

  // Format historical records chronologically for Recharts
  const chartData = [...records]
    .reverse()
    .map((r) => ({
      date: new Date(r.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }),
      Systolic: r.systolicBP,
      Diastolic: r.diastolicBP,
      "Heart Rate": r.heartRate,
      "Blood Glucose": r.bloodGlucose,
      "SpO2 (%)": r.spo2,
      Temperature: r.temperature
    }));

  const getMetricConfig = () => {
    switch (activeMetric) {
      case "bp":
        return {
          title: "Blood Pressure Trends (mmHg)",
          areas: [
            { key: "Systolic", color: "#3b82f6", fill: "rgba(59, 130, 246, 0.2)" },
            { key: "Diastolic", color: "#60a5fa", fill: "rgba(96, 165, 250, 0.1)" }
          ]
        };
      case "glucose":
        return {
          title: "Blood Glucose Trends (mg/dL)",
          areas: [
            { key: "Blood Glucose", color: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)" }
          ]
        };
      case "hr":
        return {
          title: "Heart Rate Trends (BPM)",
          areas: [
            { key: "Heart Rate", color: "#ef4444", fill: "rgba(239, 68, 68, 0.2)" }
          ]
        };
      case "spo2":
        return {
          title: "Blood Oxygen Saturation (SpO2 %)",
          areas: [
            { key: "SpO2 (%)", color: "#10b981", fill: "rgba(16, 185, 129, 0.2)" }
          ]
        };
      default:
        return { title: "Vitals Trend", areas: [] };
    }
  };

  const config = getMetricConfig();

  return (
    <div className="vitals-chart-box">
      <div className="chart-header">
        <div>
          <h3 className="text-lg font-bold text-white">{config.title}</h3>
          <p className="text-sm text-slate-400">
            Real-time biometric monitoring over time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="chart-tabs">
            <button
              className={`chart-tab ${activeMetric === "bp" ? "active" : ""}`}
              onClick={() => setActiveMetric("bp")}
            >
              BP
            </button>
            <button
              className={`chart-tab ${activeMetric === "glucose" ? "active" : ""}`}
              onClick={() => setActiveMetric("glucose")}
            >
              Glucose
            </button>
            <button
              className={`chart-tab ${activeMetric === "hr" ? "active" : ""}`}
              onClick={() => setActiveMetric("hr")}
            >
              Heart Rate
            </button>
            <button
              className={`chart-tab ${activeMetric === "spo2" ? "active" : ""}`}
              onClick={() => setActiveMetric("spo2")}
            >
              SpO2
            </button>
          </div>
        </div>
      </div>

      <div className="h-[320px] w-full mt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 font-medium">
            No vitals history recorded yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                {config.areas.map((a) => (
                  <linearGradient key={a.key} id={`grad-${a.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={a.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={a.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem",
                  color: "#f8fafc",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", color: "#94a3b8" }} />
              {config.areas.map((a) => (
                <Area
                  key={a.key}
                  type="monotone"
                  dataKey={a.key}
                  stroke={a.color}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={`url(#grad-${a.key})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// src/Pages/Reports.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Reports() {
  const location = useLocation();

  const [reportType, setReportType] = useState("weekly");
  const [customDates, setCustomDates] = useState({ startDate: "", endDate: "" });
  const [latestReport, setLatestReport] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [atmData, setAtmData] = useState(null);
  const [engineerData, setEngineerData] = useState(null);
  const [faultData, setFaultData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch report and charts
  const fetchReports = async (customReportId = null) => {
    setLoading(true);
    setError(null);

    try {
      let report = null;

      // Fetch custom report by ID
      if (reportType === "custom" && customReportId) {
        const res = await api.get(`/api/reports/full/${customReportId}`);
        report = res.data;
      } else {
        const res = await api.get(`/api/reports/latest?type=${reportType}`).catch(() => null);
        report = res?.data || null;
      }

      setLatestReport(report);

      if (!report?.id) {
        setLoading(false);
        return;
      }

      // Fetch charts
      const [trendRes, atmRes, engRes, faultRes] = await Promise.all([
        reportType !== "custom"
          ? api.get(`/api/reports/charts/trend?type=${reportType}`).catch(() => null)
          : Promise.resolve({ data: { labels: [], data: [] } }),
        api.get(`/api/reports/charts/atm/${report.id}`).catch(() => null),
        api.get(`/api/reports/charts/engineer/${report.id}`).catch(() => null),
        api.get(`/api/reports/charts/fault/${report.id}`).catch(() => null),
      ]);

      setTrendData(trendRes?.data ?? null);
      setAtmData(atmRes?.data ?? null);
      setEngineerData(engRes?.data ?? null);
      setFaultData(faultRes?.data ?? null);
    } catch (err) {
      console.error("Reports error:", err);
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportType !== "custom") fetchReports();
  }, [location.pathname, reportType]);

  // Generate custom report
  const handleGenerateCustom = async () => {
    if (!customDates.startDate || !customDates.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/reports/generate-custom", customDates);
      const reportId = res.data.reportId;

      // Fetch the newly generated report and charts
      await fetchReports(reportId);
    } catch (err) {
      console.error(err);
      setError("Failed to generate custom report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports Dashboard</h1>

      {/* Dropdown to select report type */}
      <div className="flex items-center gap-3">
        <label className="font-semibold">Report Type:</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Custom date inputs */}
      {reportType === "custom" && (
        <div className="flex items-center gap-3 mt-2">
          <label>Start Date:</label>
          <input
            type="date"
            value={customDates.startDate}
            onChange={(e) => setCustomDates({ ...customDates, startDate: e.target.value })}
            className="border p-2 rounded"
          />
          <label>End Date:</label>
          <input
            type="date"
            value={customDates.endDate}
            onChange={(e) => setCustomDates({ ...customDates, endDate: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={handleGenerateCustom}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      )}

      {/* Report info */}
      {latestReport ? (
        <div className="bg-white p-4 rounded shadow space-y-2 mt-2">
          <p><strong>Report ID:</strong> {latestReport.id}</p>
          <p><strong>Type:</strong> {reportType === "custom" ? "Custom" : latestReport.report_type}</p>
          <p><strong>Period:</strong> {safeDate(latestReport.period_start)} → {safeDate(latestReport.period_end)}</p>
          <p><strong>Total Calls:</strong> {latestReport.total_calls ?? 0}</p>
          <p><strong>Resolved Calls:</strong> {latestReport.resolved_calls ?? 0}</p>
          <p><strong>SLA Compliance:</strong> {Number(latestReport.sla_compliance ?? 0).toFixed(2)}%</p>
          <p><strong>Avg Resolution (min):</strong> {Number(latestReport.avg_resolution_minutes ?? 0).toFixed(2)}</p>
          <p><strong>Total Downtime (min):</strong> {latestReport.total_downtime_minutes ?? 0}</p>
        </div>
      ) : <p>No latest report available.</p>}

      <ChartWrapper title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Trend`} type="line" data={trendData} />
      <ChartWrapper title="ATM Calls" type="bar" data={atmData} />
      <ChartWrapper title="Engineer Performance" type="bar" data={engineerData} />
      <ChartWrapper title="Fault Occurrences" type="bar" data={faultData} />
    </div>
  );
}

function ChartWrapper({ title, type, data }) {
  if (!data || !Array.isArray(data.labels) || !Array.isArray(data.data) || data.labels.length === 0) {
    return <p>No data for {title}</p>;
  }

  const chartData = {
    labels: data.labels,
    datasets: [{
      label: title,
      data: data.data,
      backgroundColor: "rgba(54,162,235,0.5)",
      borderColor: "rgba(54,162,235,1)",
      borderWidth: 2,
    }]
  };

  return (
    <div className="bg-white p-4 rounded shadow h-[320px]">
      <h2 className="font-semibold mb-2">{title}</h2>
      {type === "line" ? (
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      ) : (
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      )}
    </div>
  );
}

function safeDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}
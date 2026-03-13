// src/screens/ReportsScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function ReportsScreen({ route }) {
  const { reportId } = route.params; // Pass reportId from navigation
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({
    trend: true,
    atm: false,
    engineer: false,
    fault: false,
  });

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://your-api.com/reports/${reportId}`);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  if (!report) return <Text style={{ marginTop: 50 }}>Report not found</Text>;

  // -------------------------
  // Chart Data
  // -------------------------
  const trendData = report.trend_labels
    ? {
        labels: report.trend_labels,
        datasets: [
          { data: report.trend_total_calls || [], color: () => "#4CAF50" },
          { data: report.trend_resolved_calls || [], color: () => "#2196F3" },
        ],
      }
    : null;

  const atmData = {
    labels: report.atm_summary.map(a => a.atm_id),
    datasets: [{ data: report.atm_summary.map(a => a.total_calls) }],
  };

  const engineerData = {
    labels: report.engineer_summary.map(e => e.engineer_id),
    datasets: [{ data: report.engineer_summary.map(e => e.resolved_calls) }],
  };

  const faultData = report.fault_summary.map(f => ({
    name: f.fault_type,
    population: f.occurrence_count,
    color: "#" + ((1 << 24) * Math.random() | 0).toString(16),
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  // -------------------------
  // Render Chart Cards
  // -------------------------
  const renderCard = (title, content, key) => (
    <View style={styles.card} key={key}>
      <TouchableOpacity onPress={() => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))}>
        <Text style={styles.cardTitle}>{title} {expanded[key] ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {expanded[key] && <View style={styles.cardContent}>{content}</View>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Report Summary</Text>
        <View style={styles.cardContent}>
          <Text>Total Calls: {report.total_calls}</Text>
          <Text>Resolved Calls: {report.resolved_calls}</Text>
          <Text>SLA Compliance: {report.sla_compliance}%</Text>
          <Text>Avg Resolution: {report.avg_resolution_minutes.toFixed(2)} min</Text>
          <Text>Total Downtime: {report.total_downtime_minutes} min</Text>
        </View>
      </View>

      {/* Trend Chart */}
      {trendData &&
        renderCard(
          "Trend Chart",
          <LineChart
            data={trendData}
            width={screenWidth - 20}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              labelColor: () => "#333",
            }}
            style={{ borderRadius: 8 }}
          />,
          "trend"
        )}

      {/* ATM Chart */}
      {renderCard(
        "ATM Calls",
        <BarChart
          data={atmData}
          width={screenWidth - 20}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
            labelColor: () => "#333",
          }}
          style={{ borderRadius: 8 }}
        />,
        "atm"
      )}

      {/* Engineer Chart */}
      {renderCard(
        "Engineer Resolved Calls",
        <BarChart
          data={engineerData}
          width={screenWidth - 20}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0,0,255,${opacity})`,
            labelColor: () => "#333",
          }}
          style={{ borderRadius: 8 }}
        />,
        "engineer"
      )}

      {/* Fault Chart */}
      {renderCard(
        "Fault Types",
        <PieChart
          data={faultData}
          width={screenWidth - 20}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />,
        "fault"
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  card: { backgroundColor: "#fff", marginVertical: 8, borderRadius: 8, padding: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardContent: { marginTop: 10 },
});
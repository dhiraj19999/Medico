import React, { useEffect, useState,useRef } from "react";
import axiosInstance from "../api/Api.js";
import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
  LineChart, Line,  CartesianGrid, 
} from "recharts";


;
import { Line as LineNew  } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as TooltipNew,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TooltipNew,
  Filler
);

const HealthTrends = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState("bp");
  const chartRef = useRef(null);

  useEffect(() => {
    axiosInstance
      .get("/health/reports")
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

  const formatData = () => {
    const labels = reports.map((report) =>
      new Date(report.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    );

    let values;
    if (selectedField === "bp") {
      // Take systolic value only for graph
      values = reports.map((r) => parseInt(r.bp.split("/")[0]));
     
    
     } else if(selectedField=="bp/d"){
        // Take diastolic value only for graph
      values = reports.map((r) => parseInt(r.bp.split("/")[1]));
     }
     
     
     else {
      values = reports.map((r) => parseFloat(r[selectedField]));
    }

    return { labels, values };
  };

  const { labels, values } = formatData();

  const gradient = (ctx, chartArea) => {
    const gradientFill = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradientFill.addColorStop(0, "rgba(58,123,213,0.1)");
    gradientFill.addColorStop(0.5, "rgba(58,123,213,0.25)");
    gradientFill.addColorStop(1, "rgba(0,210,255,0.4)");
    return gradientFill;
  };

  const data = {
    labels,
    datasets: [
      {
        label: `${selectedField.toUpperCase()} Trend`,
        data: values,
        fill: true,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return null;
          return gradient(ctx, chartArea);
        },
        borderColor: "rgba(58,123,213,1)",
        borderWidth: 3,
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(58,123,213,1)",
        pointHoverRadius: 7,
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      TooltipNew: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} (${selectedField})`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { stepSize: 10 },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeOutQuart",
    },
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl mx-auto mb-20">
      <motion.h1
          className="text-4xl font-bold mb-6 text-center text-black"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
    📈 Health Trends & Analytics
        </motion.h1>

      <select
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        className="border px-3 py-2 rounded-md mb-4"
      >
        <option value="bp">Blood Pressure (Systolic)</option>
        <option value="bp/d">Blood Pressure (Diastolic)</option>
        <option value="sugar">Sugar</option>
        <option value="cholesterol">Cholesterol</option>
        <option value="heartRate">Heart Rate</option>
        <option value="weight">Weight</option>
        <option value="height">Height</option>
      </select>

      <div style={{ height: "350px" }}>
        <LineNew ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};









export default function HealthTrendsDashboard() {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await axiosInstance.get("/health/trends");
        setTrends(res.data);
      } catch (err) {
        console.error("Error fetching health trends:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
        <HashLoader color="black" size={40} />
        <p className="mt-4 text-lg font-semibold">Generating your health trends...</p>
      </div>
    );
  }

  if (!trends) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load trends.
      </p>
    );
  }

  const avgData = [
    { name: "BP", value: parseInt(trends.avgBP.split("/")[0]) },
    { name: "Sugar", value: trends.avgSugar },
    { name: "Chol", value: trends.avgCholesterol },
    { name: "Heart", value: trends.avgHeartRate },
    { name: "BMI", value: trends.bmi },
  ];

  return (
    <>
    <div className="min-h-screen  p-6 mt-20">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <motion.h1
          className="text-4xl font-bold mb-6 text-center text-black"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📊 Your Health Trends
        </motion.h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Blood Pressure", value: trends.avgBP, flag: trends.healthFlags.bp },
            { label: "Sugar", value: trends.avgSugar, flag: trends.healthFlags.sugar },
            { label: "Cholesterol", value: trends.avgCholesterol, flag: trends.healthFlags.cholesterol },
            { label: "Heart Rate", value: trends.avgHeartRate, flag: trends.healthFlags.heartRate },
            { label: "Weight", value: trends.avgWeight + " kg" },
            { label: "Height", value: trends.avgHeight + " cm" },
            { label: "BMI", value: trends.bmi, flag: trends.healthFlags.bmi },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className={`p-4 rounded-xl shadow-lg text-center ${
                stat.flag === "red"
                  ? "bg-red-300"
                  : stat.flag === "green"
                  ? "bg-green-300"
                  : "bg-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-700">{stat.label}</p>
              <p className="text-2xl font-bold text-black">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Average Health Metrics
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avgData}>
                <XAxis dataKey="name" stroke="#000" />
                <YAxis stroke="#000" />
                <Tooltip />
                <Bar dataKey="value" fill="#14b8a6" animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4 text-black">BMI Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="100%"
                barSize={20}
                data={[{ name: "BMI", value: trends.bmi, fill: "#14b8a6" }]}
              >
                <RadialBar
                  minAngle={15}
                  label={{ fill: "#000", position: "insideStart" }}
                  background
                  clockWise
                  dataKey="value"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
              </RadialBarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          className="p-6 rounded-xl bg-gray-50 shadow-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-black">
            📌 Health Summary
          </h2>
          <p className="text-lg text-gray-700">{trends.summary}</p>
        </motion.div>
      </div>
    </div>
    <HealthTrends/>
    </>
  );
}

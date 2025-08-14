import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";
import { Line as LineNew } from "react-chartjs-2";

import axiosInstance from "../api/Api.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);
import { Line } from "react-chartjs-2";

const fields = [
  { value: "bp", label: "Blood Pressure (Systolic)" },
  { value: "bp/d", label: "Blood Pressure (Diastolic)" },
  { value: "sugar", label: "Sugar" },
  { value: "cholesterol", label: "Cholesterol" },
  { value: "heartRate", label: "Heart Rate" },
  { value: "weight", label: "Weight" },
  { value: "height", label: "Height" },
];

export  function SuperAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [selectedField, setSelectedField] = useState("bp");
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get("/superanalytics");
        setAnalytics(res.data);
        console.log("Analytics data:", res.data);
      } catch (err) {
        console.error("Error fetching super analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
        <HashLoader color="teal" size={40} />
        <p className="mt-4 text-lg font-semibold">Analyzing your health journey...</p>
      </div>
    );
  }

  if (!analytics) {
    return <p className="text-center mt-10 text-red-500">Failed to load analytics.</p>;
  }

  // Prepare chart data
  const labels = analytics.reports
    .map((r) => new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }))
    .reverse();

  const values = analytics.reports
    .map((r) => {
      if (selectedField === "bp") return parseInt(r.bp.split("/")[0]);
      if (selectedField === "bp/d") return parseInt(r.bp.split("/")[1]);
      return parseFloat(r[selectedField]);
    })
    .reverse();

  const gradient = (ctx, chartArea) => {
    const grad = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    grad.addColorStop(0, "rgba(58,123,213,0.1)");
    grad.addColorStop(0.5, "rgba(58,123,213,0.25)");
    grad.addColorStop(1, "rgba(0,210,255,0.4)");
    return grad;
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
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { stepSize: 10 } },
    },
    animation: { duration: 1500, easing: "easeOutQuart" },
  };




function getRandomColor() {
   const colors = ["#FCA5A5", // red-300
    "#F9A8D4", // pink-300
    "#86EFAC", // green-300
    "#5EEAD4", // teal-300
    "#C4B5FD", // purple-300
    "#93C5FD", // blue-300
    "#FDBA74",];
  return colors[Math.floor(Math.random() * colors.length)];
}


return (
  <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-5 mb-10">

    {/* AI Summary Title */}
    <motion.h2
      className="text-3xl font-bold mb-6 text-center text-black"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      🤖 AI Summary & Prediction
    </motion.h2>

    {/* Split aiSummary into sections based on headings */}
    {analytics.aiSummary.split("\n\n").map((section, index) => {
      const [headingLine, ...restLines] = section.split("\n");
      const content = restLines.join("\n");

   
      let bgGradient = `bg-${getRandomColor()}-300`; 
      
      return (
        <motion.div
          key={index}
          className={`mb-6 p-5 rounded-xl   shadow-inner hover:shadow-lg transition-shadow duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
          style={{backgroundColor: ` ${getRandomColor()}` }}
        >
          {headingLine && (
            <h3 className="text-xl font-semibold text-black mb-2">{headingLine}</h3>
          )}
          <p className="text-gray-900 whitespace-pre-line text-base font-serif">{content}</p>
        </motion.div>
      );
    })}
  </div>
);

}

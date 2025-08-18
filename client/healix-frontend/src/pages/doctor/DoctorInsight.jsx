import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/Api.js";
import { motion } from "framer-motion";
import useUserStore from "../../store/useUserStore.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DoctorInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data } = await axiosInstance.get("/doctor/insights");

        const sentimentDistribution = [
          { emotion: "Positive", value: data.feedbackAnalysis.positive },
          { emotion: "Negative", value: data.feedbackAnalysis.negative },
          { emotion: "Neutral", value: data.feedbackAnalysis.neutral },
        ];

        const keyTopics = (data.feedbackAnalysis.keywords || []).map((k) => ({
          topic: typeof k === "string" ? k : k.topic || "Unknown",
          frequency: k.count || 1,
        }));

        setInsights({
          doctor: data.doctor,
          specialization: data.specialization,
          performance: data.performance,
          feedbackAnalysis: data.feedbackAnalysis,
          cancellationInsights: data.cancellationInsights,
          aiSuggestions: data.aiSuggestions,
          sentimentDistribution,
          keyTopics,
          rankingScore: data.aiInsights?.rankingScore || 0,
          modelUsed: data.modelUsed,
        });
      } catch (error) {
        console.error("❌ Error fetching insights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <motion.div
          className="w-14 h-14 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        <p className="text-teal-500 text-lg font-medium animate-pulse">
          Generating Insights...
        </p>
      </div>
    );
  }

  if (!insights) {
    return (
      <p className="text-center mt-10 text-red-500">No insights available</p>
    );
  }

  // Helper for star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={i} className="text-red-400 text-xl">★</span>
        ))}
        {halfStar && <span className="text-red-400 text-xl">☆</span>}
        {Array.from({ length: 5 - fullStars - (halfStar ? 1 : 0) }).map(
          (_, i) => (
            <span key={i} className="text-gray-400 text-xl">★</span>
          )
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto mt-32 mb-10">
      {/* Title */}
      <motion.h1
        className="text-3xl font-bold text-center text-teal-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Doctor Dashboard - Insights
      
      </motion.h1>
  <h1  className="text-purple-700 font-sans font-bold">Ranking Score will be from out of 100</h1>
      {/* Doctor Info + Ranking Badge */}
    <motion.div
  className="bg-gradient-to-r from-teal-100 to-red-100 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 hover:shadow-2xl transition-shadow duration-300"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <div className="flex flex-col items-center md:items-start">
    <h2 className="text-2xl font-semibold text-teal-700 text-center md:text-left">
      {insights.doctor} ({insights.specialization})
    </h2>
    {renderStars(insights.performance.avgRating)}
  </div>

        {/* Glowing Ranking Badge */}
        <div className="relative">
    <motion.div
      className="bg-gradient-to-r from-red-500 via-purple-600 to-pink-500 text-white font-bold text-lg md:text-xl px-5 py-2 rounded-full shadow-lg z-10 cursor-pointer hover:scale-105 transition-transform duration-300 text-center"
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
    >
      Ranking Score: {user?.rankingScore || insights.rankingScore}
    </motion.div>
    <span className="absolute -inset-1 rounded-full bg-pink-400 blur-xl opacity-30 animate-pulse"></span>
  </div>
</motion.div>

      {/* Performance Summary */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {[
          { title: "Total Appointments", value: insights.performance.totalAppointments, color: "bg-teal-100" },
          { title: "Completed", value: insights.performance.completed, color: "bg-teal-200" },
          { title: "Cancelled", value: insights.performance.cancelled, color: "bg-red-300" },
          { title: "Completion Rate", value: insights.performance.completionRate, color: "bg-teal-100" },
          { title: "Cancellation Rate", value: insights.performance.cancellationRate, color: "bg-red-200" },
          { title: "Average Rating", value: `⭐ ${insights.performance.avgRating}`, color: "bg-yellow-100" },
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl shadow hover:shadow-md transition bg-opacity-90 ${item.color}`}>
            <h3 className="font-semibold text-gray-700">{item.title}</h3>
            <p className="text-xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Sentiment Distribution */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Sentiment Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={insights.sentimentDistribution}
              dataKey="value"
              nameKey="emotion"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {insights.sentimentDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Key Topics */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Key Topics</h2>
        {insights.keyTopics.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.keyTopics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="frequency" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No keywords found</p>
        )}
      </motion.div>

      {/* AI Suggestions */}
    <motion.div
  className="bg-gradient-to-r from-teal-200 via-purple-300 to-pink-200 rounded-3xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
>
  <h2 className="text-2xl font-bold mb-4 text-gray-800 tracking-wide">
    AI Suggestions
  </h2>

  
  <p className="text-gray-800 leading-relaxed font-medium text-md md:text-lg font-serif">
    {insights.aiSuggestions}
  </p>

  {/* Optional subtle decorative elements */}
  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>
  <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-300 rounded-full opacity-20 blur-2xl animate-pulse"></div>
</motion.div>
    </div>
  );
};

export default DoctorInsights;


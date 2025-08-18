import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/Api";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import HashLoader from "react-spinners/HashLoader";

const COLORS = ["#14b8a6", "#facc15", "#f87171"]; // teal, yellow, red

const DOCInsight = () => {
  const { docId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);

const getRandomColor = () => {
  const colors = [
"#bbf7d0", // green-200
  "#ddd6fe", // purple-200
  "#fecaca", // red-200
  "#99f6e4", // teal-200
  "#bfdbfe", // blue-200
  "#fbcfe8", // pink-200
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};


  useEffect(() => {
    const fetchDoctorInsights = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/doctor/adminsideinsights/${docId}`);
        setInsights(data);
      } catch (err) {
        console.error("Error fetching doctor insights:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (docId) fetchDoctorInsights();
  }, [docId]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center mt-60 mb-40">
        <p className="mt-4 text-teal-600 font-semibold text-lg animate-pulse">
          Generating Insights...
        </p>
        <HashLoader color="#14b8a6" size={80} />
      </div>
    );

  if (error)
    return (
      <div className="mt-32 text-center text-red-500 text-lg font-semibold">{error}</div>
    );

  // Chart Data
  const sentimentData = [
    { name: "Positive", value: insights.feedbackAnalysis.positive },
    { name: "Neutral", value: insights.feedbackAnalysis.neutral },
    { name: "Negative", value: insights.feedbackAnalysis.negative },
  ];

  const completionData = [
    { name: "Completed", value: insights.performance.completed },
    { name: "Cancelled", value: insights.performance.cancelled },
  ];

  const keywordData = insights.feedbackAnalysis.keywords.map((k, i) => ({
    keyword: k,
    count: i + 1,
  }));

  return (
    <div className="mt-16 p-6 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Title */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-center mb-8 text-gray-800"
      >
        Doctor Insights Dashboard
      </motion.h2>

      {/* Doctor Info & Ranking Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-xl shadow-xl flex justify-between items-center"
      >
        <div>
          <h3 className="text-3xl font-semibold">{insights.doctor}</h3>
          <p className="text-lg mt-1">{insights.specialization}</p>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-wider">Ranking Score</p>
          <span className="inline-block bg-white text-teal-700 font-bold text-3xl px-4 py-2 rounded-full shadow-md animate-pulse border-4 border-yellow-300">
            {insights.aiInsights.rankingScore}
          </span>
        </div>
      </motion.div>

      {/* Performance Metrics Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(insights.performance).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className={` p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 border-l-8 ${
              index === 0 ? "border-teal-500" : index === 1 ? "border-yellow-400" : "border-red-400"
            }`}
            style={{backgroundColor:getRandomColor()}}
          >
            <h4 className="font-semibold text-lg mb-2 capitalize">{key}</h4>
            <p className="text-3xl font-bold text-gray-700">{value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Pie */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h4 className="font-semibold text-lg mb-4">Feedback Sentiment</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completion vs Cancellation Pie */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h4 className="font-semibold text-lg mb-4">Completion vs Cancellation</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {completionData.map((entry, index) => (
                  <Cell key={index} fill={index === 0 ? "#14b8a6" : "#f87171"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Keywords Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <h4 className="font-semibold text-lg mb-4">Top Feedback Keywords</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={keywordData} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="keyword" />
            <Tooltip />
            <Bar dataKey="count" fill="#14b8a6" radius={[5, 5, 5, 5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(insights.aiInsights).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            className=" p-6 rounded-xl shadow-md hover:shadow-2xl transition transform hover:scale-105 border-l-8 border-teal-400"
          style={{backgroundColor:getRandomColor()}}
         >
            <h4 className="font-semibold text-lg mb-2 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </h4>
            {typeof value === "object" ? (
              <pre className="text-sm text-gray-600">{JSON.stringify(value, null, 2)}</pre>
            ) : (
              <p className="text-gray-700 font-semibold">{value}</p>
            )}
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-6 text-center text-sm text-gray-500">
        AI Model Used: <span className="font-semibold">{insights.modelUsed}</span>
      </p>
    </div>
  );
};

export default DOCInsight;

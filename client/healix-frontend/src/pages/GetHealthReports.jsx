import { useEffect, useState } from "react";
import axiosInstance from "../api/Api";
import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";

import { toast } from "react-toastify";

export default function HealthReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState("");
const override = {
  display: "block",
 
  borderColor: "red",
  margin: "0 auto",
};
  useEffect(() => {
    axiosInstance
      .get("/health/reports")
      .then((res) => {
        setReports(res.data);
        console.log("Fetched reports:", res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

  const downloadPdf = async (id) => {
    setLoad(id);
    try {
      const res = await axiosInstance.get(`/health/reports/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `HealthReport-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("✅ PDF downloaded successfully!", {
        icon: "🚀",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
      setLoad(null);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      toast.error("❌ Failed to download PDF.", {
        icon: "🚫",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
      setLoad(null);
    }
  };

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        {Array(8)
          .fill()
          .map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded"></div>
          ))}
      </div>
      <div className="mt-4 h-16 bg-gray-200 rounded"></div>
      <div className="mt-4 h-8 bg-gray-300 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-teal-600 mb-8">
          📄 My Health Reports
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill()
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <h1 className="text-3xl font-bold text-center text-teal-600 mb-8">
        📄 My Health Reports
      </h1>

      {reports.length === 0 ? (
        <p className="text-center text-gray-500">No reports found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <motion.div
              key={report._id}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white shadow-lg rounded-xl p-5 border border-gray-200"
            >
              <h2 className="text-lg font-bold text-gray-800">
                {report.user?.name || "Health Report"}
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                {new Date(report.createdAt).toLocaleString()}
              </p>

              {/* Health Data */}
              <div className="space-y-1 text-sm text-gray-700">
                <p>🧬 Age: {report.age}</p>
                <p>🚻 Gender: {report.gender}</p>
                <p>🩸 BP: {report.bp}</p>
                <p>🍬 Sugar: {report.sugar}</p>
                <p>🧈 Cholesterol: {report.cholesterol}</p>
                <p>❤️ Heart Rate: {report.heartRate}</p>
                <p>⚖️ Weight: {report.weight} kg</p>
                <p>📏 Height: {report.height} cm</p>
                <p>🤒 Symptoms: {report.symptoms}</p>
              </div>

              {/* AI Result Section */}
              {report.riskResult && (
                <div className="mt-4 p-3 bg-gradient-to-r from-teal-50 to-green-50 border-l-4 border-teal-500 rounded-md shadow-sm">
                  <p className="text-sm font-semibold text-teal-700">🧠 AI Analysis:</p>
                  <div className="max-h-20 overflow-y-auto text-gray-800 text-sm whitespace-pre-line pr-2 scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-transparent">
                    {report.riskResult}
                  </div>
                </div>
              )}

              {/* Download Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={load===report._id?"mt-4 w-full from-green-100 to-teal-100 text-black hover:from-green-200 hover:to-teal-200 font-semibold py-2 rounded-lg shadow-md transition-colors duration-300":"mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg shadow-md transition-colors duration-300  hover:from-green-200 hover:to-teal-200"}
                onClick={() => downloadPdf(report._id)}
              >
                 {load===report._id?(<> <span className="text-sm font-medium">Generating PDF <HashLoader color="teal" size={30} cssOverride={override} /></span> </> ): " ⬇ Download PDF"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}









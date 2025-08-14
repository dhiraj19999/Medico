import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReportUploader from "./ReportUploader";
import HealthReprtPage from "./HealthReport"

export default function ReportDashboard() {
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "metrics"

  const tabs = [
    { id: "upload", label: "📄 Upload Reports" },
    { id: "metrics", label: "📊 Health Metrics" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 mt-20">
      {/* Tab Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-teal-600 text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <ReportUploader />
            </motion.div>
          )}

          {activeTab === "metrics" && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <HealthReprtPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

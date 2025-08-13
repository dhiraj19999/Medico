import { useState } from "react";
import axiosInstance from "../api/Api";
import HealthReports from "./GetHealthReports";
import { HashLoader } from "react-spinners";

import { toast } from "react-toastify";

export default function HealthReportForm() {
    const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    bp: "",
    sugar: "",
    cholesterol: "",
    heartRate: "",
    weight: "",
    height: "",
    symptoms: "",
  });
const override = {
  display: "block",
 
  borderColor: "red",
  margin: "0 auto",
};
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    console.log("Form Data:", formData);
    axiosInstance
      .post("/health/predict", formData)
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
         toast.success("✅ Health report form uploaded successfully!", {
  icon: "🚀",
  style: { fontSize: "1rem", fontWeight: "bold" },
})
    setLoad(false);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        toast.error("❌ Failed to upload health report form.", {
          icon: "🚫",
          style: { fontSize: "1rem", fontWeight: "bold" },
        });
        setLoad(false);
      });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center  p-4 mt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Health Report Form
          </h2>

          {/* Row 1: Age & Gender */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male ♂</option>
                <option value="female">Female ♀</option>
                <option value="other">Other ⚧</option>
              </select>
            </div>
          </div>

          {/* Row 2: BP & Sugar */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BP
              </label>
              <input
                type="text"
                name="bp"
                value={formData.bp}
                onChange={handleChange}
                placeholder="e.g. 120/80"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sugar
              </label>
              <input
                type="text"
                name="sugar"
                value={formData.sugar}
                onChange={handleChange}
                placeholder="e.g. 90 mg/dL"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Row 3: Cholesterol & Heart Rate */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cholesterol
              </label>
              <input
                type="text"
                name="cholesterol"
                value={formData.cholesterol}
                onChange={handleChange}
                placeholder="e.g. 180 mg/dL"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heart Rate
              </label>
              <input
                type="text"
                name="heartRate"
                value={formData.heartRate}
                onChange={handleChange}
                placeholder="e.g. 72 bpm"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Row 4: Weight & Height */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter weight"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Enter height"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Symptoms (full width) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms
            </label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe your symptoms..."
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
              required
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={load?"w-full from-green-100 to-teal-100 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-200 hover:to-teal-200 transform hover:scale-[1.02] transition duration-300":"w-full bg-teal-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-teal-600 transform hover:scale-[1.02] transition duration-300"}
          >
          {load ? <HashLoader color="teal" size={30} cssOverride={override} /> : "Submit"}
          </button>
        </form>
      </div>

      <HealthReports />
    </>
  );
}

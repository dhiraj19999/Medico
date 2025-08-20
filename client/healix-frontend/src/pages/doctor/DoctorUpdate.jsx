import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Phone,
  Mail,
  User,
  GraduationCap,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import axiosInstance from "../../api/Api";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const override = {
  display: "block",
  margin: "0 auto",
};

export default function DoctorProfile() {
  const [formData, setFormData] = useState({});
  const [doctorId, setDoctorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/auth/user");
      setFormData(res.data);
      setDoctorId(res.data._id);
    } catch (error) {
      toast.error("❌ Failed to fetch doctor profile!", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🟢 Text input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 Avatar file handler
  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  // 🟢 Available days toggle
  const toggleDay = (day) => {
    let updatedDays = [...(formData.availableDays || [])];
    if (updatedDays.includes(day)) {
      updatedDays = updatedDays.filter((d) => d !== day);
    } else {
      updatedDays.push(day);
    }
    setFormData({ ...formData, availableDays: updatedDays });
  };

  // 🟢 Submit update request
  const handleSubmit = async () => {
    setUpdating(true);
    try {
      const form = new FormData();
      for (let key in formData) {
        if (key === "availableDays") {
          formData.availableDays.forEach((day) =>
            form.append("availableDays", day)
          );
        } else if (key === "availableTime") {
          form.append("availableTime[start]", formData.availableTime.start);
          form.append("availableTime[end]", formData.availableTime.end);
        } else {
          form.append(key, formData[key]);
        }
      }

      await axiosInstance.put(`/doctor/update/${doctorId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Profile Updated successfully!", {
        icon: "🚀",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Something went wrong !", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    // 🔹 Skeleton Loader
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-teal-50 to-gray-100 p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl animate-pulse">
          <div className="flex justify-center mt-10 mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-300 shadow-lg"></div>
          </div>
          <div className="space-y-4 mt-6">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

 const renderStars = (ratings = []) => {
    let avgRating = 0;
    if (Array.isArray(ratings) && ratings.length > 0) {
      avgRating =
        ratings.reduce((sum, val) => sum + Number(val), 0) / ratings.length;
    }

    const safeRating = Math.min(5, Math.max(0, avgRating));
    const fullStars = Math.floor(safeRating);
    const halfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);


  return (
    <div className="flex justify-center gap-1 my-4">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="teal"
          viewBox="0 0 24 24"
          stroke="teal"
          strokeWidth={2}
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.5l2.09 6.42h6.75l-5.46 3.96 2.09 6.42-5.46-3.96-5.46 3.96 2.09-6.42-5.46-3.96h6.75l2.09-6.42z"
          />
        </svg>
      ))}

      {halfStar && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="teal" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M11.48 3.5l2.09 6.42h6.75l-5.46 3.96 2.09 6.42-5.46-3.96-5.46 3.96 2.09-6.42-5.46-3.96h6.75l2.09-6.42z"
            fill="url(#half-grad)"
            stroke="teal"
            strokeWidth={2}
          />
        </svg>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="teal"
          strokeWidth={2}
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.5l2.09 6.42h6.75l-5.46 3.96 2.09 6.42-5.46-3.96-5.46 3.96 2.09-6.42-5.46-3.96h6.75l2.09-6.42z"
          />
        </svg>
      ))}
    </div>
  );
};
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-teal-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl relative"
      >
        {/* Avatar Top */}
        <div className="flex justify-center mt-10 mb-6">
          <motion.img
            key={formData.avatar || "default"}
            src={
              formData.avatar instanceof File
                ? URL.createObjectURL(formData.avatar)
                : formData.avatar || "https://via.placeholder.com/150"
            }
            alt="Doctor Avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            initial={{ scale: 0, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Doctor Profile
        </h2>

        {/* ⭐ Rating */}
        {renderStars(formData?.rating ?? 4)}


        {/* 🎂 DOB Pill */}
        {formData.dob && (
          <div className="flex justify-center mb-6">
            <span className="px-5 py-1.5 rounded-full bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 text-sm font-semibold shadow-md">
              🎂 DOB: {new Date(formData?.dob).toLocaleDateString("en-GB")}
            </span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            icon={<User />}
            name="name"
            value={formData.name}
            placeholder="Full Name"
            onChange={handleChange}
          />
          <InputField
            icon={<Mail />}
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
          />
          <InputField
            icon={<Phone />}
            name="phone"
            value={formData.phone}
            placeholder="Phone"
            onChange={handleChange}
          />
          <InputField
            icon={<GraduationCap />}
            name="specialization"
            value={formData.specialization}
            placeholder="Specialization"
            onChange={handleChange}
          />
          <InputField
            icon={<GraduationCap />}
            name="qualifications"
            value={formData.qualifications}
            placeholder="Qualifications"
            onChange={handleChange}
          />
          <InputField
            icon={<Clock />}
            name="experience"
            value={formData.experience}
            placeholder="Experience (years)"
            onChange={handleChange}
          />

          {/* Gender */}
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="col-span-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Address */}
          <InputField
            name="city"
            value={formData?.address?.city}
            placeholder="City"
            onChange={handleChange}
          />
          <InputField
            name="state"
            value={formData?.address?.state}
            placeholder="State"
            onChange={handleChange}
          />
          <InputField
            name="country"
            value={formData?.address?.country}
            placeholder="Country"
            onChange={handleChange}
          />
          <InputField
            name="pincode"
            value={formData?.address?.pincode}
            placeholder="Pincode"
            onChange={handleChange}
          />

          {/* Available Time */}
          <div className="col-span-2 flex gap-2">
            <input
              type="time"
              name="start"
              value={formData.availableTime?.start || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availableTime: {
                    ...formData.availableTime,
                    start: e.target.value,
                  },
                })
              }
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <input
              type="time"
              name="end"
              value={formData.availableTime?.end || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availableTime: {
                    ...formData.availableTime,
                    end: e.target.value,
                  },
                })
              }
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>
        </div>

        {/* Available Days Pills */}
        <div className="mt-6">
          <h3 className="text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Available Days
          </h3>
          <div className="flex flex-wrap gap-2">
            {allDays.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  formData.availableDays?.includes(day)
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="mt-6">
          <input
            type="file"
            name="avatar"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={updating}
          className={`mt-8 w-full ${
            updating ? "bg-white" : "bg-teal-500"
          } text-white border border-teal-500 py-3 px-4 rounded-lg shadow-lg transition duration-300 font-semibold flex justify-center items-center gap-2 hover:bg-teal-600 `}
        >
          {updating ? (
            <HashLoader color="teal" size={30} cssOverride={override} />
          ) : (
            "Update Profile"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

// 🔹 Reusable Input Component
const InputField = ({ icon, name, value, placeholder, onChange }) => (
  <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-400">
    {icon && <span className="text-gray-500 mr-2">{icon}</span>}
    <input
      type="text"
      name={name}
      value={value || ""}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full outline-none"
    />
  </div>
);

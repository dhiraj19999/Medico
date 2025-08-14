import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/Api";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import imageCompression from 'browser-image-compression';
import {
  FaUserMd, FaUserGraduate, FaEnvelope, FaPhoneAlt, FaLock,
  FaCity, FaMapMarkerAlt, FaGlobe, FaMapPin, FaClock, FaCamera
} from "react-icons/fa";

const DoctorRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "", specialization: "", qualifications: "", experience: "",
    email: "", phone: "", password: "", gender: "", city: "", state: "",
    country: "", pincode: "", availableDays: [], availableTimeStart: "",
    availableTimeEnd: "", latitude: "", longitude: "", avatar: null,
  });
  const [errors, setErrors] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("lat:", pos.coords.latitude);
        console.log("long:", pos.coords.longitude);
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        
        }));
      },
      () => {
        toast.warning("📍 Location permission denied. Fill manually.");
      }
    );
  }, []);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      try {
        const compressedFile = await imageCompression(files[0], {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 400,
          useWebWorker: true,
        });
        setFormData((prev) => ({ ...prev, [name]: compressedFile }));
      } catch {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDaysChange = (day) => {
    setFormData((prev) => {
      const newDays = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: newDays };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name", "specialization", "qualifications", "experience", "email", "phone",
      "password", "gender", "city", "state", "country", "pincode",
      "availableTimeStart", "availableTimeEnd", "latitude", "longitude"
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    });
    if (formData.availableDays.length === 0) newErrors.availableDays = "Please select at least one available day";
    if (!formData.avatar) newErrors.avatar = "Please upload your profile picture";
    if (formData.password && formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoad(true);
  if (!validateForm()) {
    setLoad(false);
    return;
  }
  try {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "availableDays") {
        data.append(key, JSON.stringify(formData[key])); // stringify for backend
      } else if (key !== "latitude" && key !== "longitude") {
        data.append(key, formData[key]);
      }
    });

    // 🔹 Location as GeoJSON for backend
    data.append(
      "location",
      JSON.stringify({
        type: "Point",
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
      })
    );

    await axiosInstance.post("/doctor/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("✅ Registration successful!", {
      icon: "🚀",
      style: { fontSize: "1rem", fontWeight: "bold" },
    });
    setLoad(false);
  } catch (error) {
    toast.error(error.response?.data?.message || "❌ Registration failed!", {
      icon: "⚠️",
      style: { fontSize: "1rem", fontWeight: "bold" },
    });
    setLoad(false);
  }
};

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const override = { display: "block", borderColor: "red", margin: "0 auto" };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-20">
      <h2 className="text-3xl font-bold mb-6 text-center">🩺 Doctor Registration</h2>
      <h1 className="text-red-600 font-bold text-lg bg-red-50 border border-red-200 p-3 rounded-lg mb-4 text-center">
        ⚠ Please register from your clinic or hospital for precise location capture.
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar */}
        <div>
          <label className="block font-medium mb-1">📷 Profile Picture*</label>
          <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
            <FaCamera className="text-gray-400" />
            <input type="file" name="avatar" accept="image/*" onChange={handleChange} className="w-full focus:outline-none" />
          </div>
          {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaUserMd className="text-gray-400" />
              <input name="name" placeholder="Full Name*" value={formData.name} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaUserMd className="text-gray-400" />
              <input name="specialization" placeholder="Specialization*" value={formData.specialization} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaUserGraduate className="text-gray-400" />
              <input name="qualifications" placeholder="Qualifications*" value={formData.qualifications} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaUserGraduate className="text-gray-400" />
              <input type="number" name="experience" placeholder="Experience (years)*" value={formData.experience} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaEnvelope className="text-gray-400" />
              <input type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaPhoneAlt className="text-gray-400" />
              <input name="phone" placeholder="Phone*" value={formData.phone} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaLock className="text-gray-400" />
              <input type="password" name="password" placeholder="Password*" value={formData.password} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full py-2 rounded-xl bg-white shadow-inner focus:outline-none">
              <option value="">Select Gender*</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
        </div>

        {/* Address */}
        <h3 className="text-lg font-semibold mt-4">📍 Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaCity className="text-gray-400" />
              <input name="city" placeholder="City*" value={formData.city} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaMapMarkerAlt className="text-gray-400" />
              <input name="state" placeholder="State*" value={formData.state} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaGlobe className="text-gray-400" />
              <input name="country" placeholder="Country*" value={formData.country} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaMapPin className="text-gray-400" />
              <input name="pincode" placeholder="Pincode*" value={formData.pincode} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaMapMarkerAlt className="text-gray-400" />
              <input name="latitude" placeholder="Latitude*" value={formData.latitude} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaMapMarkerAlt className="text-gray-400" />
              <input name="longitude" placeholder="Longitude*" value={formData.longitude} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
          </div>
        </div>

        {/* Days */}
        <h3 className="text-lg font-semibold mt-4">📅 Available Days*</h3>
        <div className="flex flex-wrap gap-1">
          {daysOfWeek.map((day) => (
            <button type="button" key={day}
              onClick={() => handleDaysChange(day)}
              className={`px-3 py-1 rounded-lg border ml-6 ${formData.availableDays.includes(day) ? "bg-teal-500 text-white" : "bg-green-300"}`}>
              {day}
            </button>
          ))}
        </div>
        {errors.availableDays && <p className="text-red-500 text-sm mt-1">{errors.availableDays}</p>}

        {/* Time */}
        <h3 className="text-lg font-semibold mt-4">⏰ Available Time*</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaClock className="text-gray-400" />
              <input type="time" name="availableTimeStart" value={formData.availableTimeStart} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.availableTimeStart && <p className="text-red-500 text-sm mt-1">{errors.availableTimeStart}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-white shadow-inner rounded-xl px-3 py-2">
              <FaClock className="text-gray-400" />
              <input type="time" name="availableTimeEnd" value={formData.availableTimeEnd} onChange={handleChange} className="w-full focus:outline-none" />
            </div>
            {errors.availableTimeEnd && <p className="text-red-500 text-sm mt-1">{errors.availableTimeEnd}</p>}
          </div>
        </div>

        {/* Submit */}
        <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={load}
          className={load
            ? "w-full py-3 mt-2 bg-gradient-to-r from-green-100 to-teal-100 text-white font-bold rounded-xl shadow-md"
            : "w-full py-3 mt-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl shadow-md"}>
          {load ? <HashLoader color="teal" size={30} cssOverride={override} /> : "Sign Up"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DoctorRegistrationForm;

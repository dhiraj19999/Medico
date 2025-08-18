import React, { useState } from "react";
import axiosInstance from "../../api/Api";
import { motion } from "framer-motion";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";


const CreateHospital = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: "",
    gmail: "",
    city: "",
    state: "",
    pincode: "",
      streetAdd:""
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const override = {
    display: "block",
    margin: "0 auto",
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Hospital name is required";
    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "10-digit phone required";
    if (
      !formData.gmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail)
    )
      newErrors.gmail = "Valid email is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "6-digit pincode required";
    if (!avatar) newErrors.avatar = "Hospital image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      });
      setAvatar(compressedFile);
      setAvatarPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Error compressing image:", error);
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
      form.append("avatar", avatar);

      await axiosInstance.post("/hospital/createhospital", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Hospital created successfully!", {
        icon: "🏥",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });

      setFormData({
        name: "",
        specialization: "",
        phone: "",
        gmail: "",
        city: "",
        state: "",
        pincode: "",
          streetAdd:""
      });
      setAvatar(null);
      setAvatarPreview("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Failed to create hospital!", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-20 justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-white/40 backdrop-blur-xl"
      >
        <h2 className="text-2xl font-bold text-teal-600 mb-4 text-center">
          🏥 Create Hospital
        </h2>

        {/* Avatar Upload */}
        <div className="mb-4 flex flex-col items-center">
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mb-2 shadow-md"
            />
          )}
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="text-sm"
          />
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
          )}
        </div>

        {/* Fields */}
        {[
          { label: "Name", name: "name" },
          {
            label: "Specialization (comma separated)",
            name: "specialization",
          },
          { label: "Phone", name: "phone" },
          { label: "Email", name: "gmail" },
          { label: "City", name: "city" },
          { label: "State", name: "state" },
          { label: "Pincode", name: "pincode" },
          { label: "Street Address", name: "streetAdd" },
        ].map((field, idx) => (
          <div className="mb-4" key={idx}>
            <label className="block text-gray-600 font-medium mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className={
            loading
              ? "w-full py-2 bg-gradient-to-r from-green-100 to-teal-100 text-white font-medium rounded-lg shadow-md"
              : "w-full py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition-all"
          }
        >
          {loading ? (
            <HashLoader color="teal" size={30} cssOverride={override} />
          ) : (
            "Create Hospital"
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};



export default CreateHospital;

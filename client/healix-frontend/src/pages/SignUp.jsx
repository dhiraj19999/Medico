import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt,
  FaBirthdayCake, FaImage, FaVenusMars
} from "react-icons/fa";
import { HashLoader } from "react-spinners";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [load, setLoad] = useState(false);
const override = {
  display: "block",
 
  borderColor: "red",
  marginLeft: "270px",
};
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Min 6 characters";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) newErrors.phone = "10-digit phone required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of birth required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.avatar) newErrors.avatar = "Avatar is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
        alert("Registration successful!");
        console.log("Form Data Submitted:", formData);
      }, 30000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center bg-gradient-to-tr p-4 mt-12">
      {/* GIF Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden sm:block w-full max-w-md mr-6"
      >
        <img
          src="https://sparkwavegroup.com/wp-content/uploads/2022/08/chatbot-1-1.gif"
          alt="Signup GIF"
          className="rounded-3xl shadow-lg w-full"
        />
      </motion.div>

      {/* Signup Form */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl backdrop-blur-xl bg-white/30 shadow-2xl rounded-3xl p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-6 border border-white/40"
      >
        <h2 className="text-3xl sm:col-span-2 font-extrabold text-center text-gray-800 drop-shadow mb-2">
          Create Your Healix Account
        </h2>

        {/* Form Fields */}
        <InputWithIcon Icon={FaUser} name="name" placeholder="Full Name" value={formData.name} handleChange={handleChange} error={errors.name} />
        <InputWithIcon Icon={FaEnvelope} name="email" placeholder="Email Address" value={formData.email} handleChange={handleChange} error={errors.email} type="email" />
        <InputWithIcon Icon={FaLock} name="password" placeholder="Password" value={formData.password} handleChange={handleChange} error={errors.password} type="password" />
        <InputWithIcon Icon={FaPhone} name="phone" placeholder="Phone Number" value={formData.phone} handleChange={handleChange} error={errors.phone} type="tel" />

        {/* Gender */}
        <div className="relative">
          <FaVenusMars className="absolute top-3 left-3 text-gray-400" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="pl-10 w-full py-2 rounded-xl bg-white/70 shadow-inner focus:outline-none">
            <option value="">Select Gender</option>
            <option value="male">♂️ Male</option>
            <option value="female">♀️ Female</option>
            <option value="other">⚧️ Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        {/* DOB */}
        <InputWithIcon Icon={FaBirthdayCake} name="dob" value={formData.dob} handleChange={handleChange} error={errors.dob} type="date" />

        {/* Address */}
        <InputWithIcon Icon={FaMapMarkerAlt} name="address" placeholder="Address" value={formData.address} handleChange={handleChange} error={errors.address} isFullWidth />

        {/* Avatar */}
        <div className="relative sm:col-span-2">
          <FaImage className="absolute top-3 left-3 text-gray-400" />
          <input type="file" name="avatar" accept="image/*" onChange={handleChange} className="pl-10 w-full py-2 rounded-xl bg-white/70 shadow-inner focus:outline-none" />
          {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={load}
          className={load?"sm:col-span-2 w-full py-3 mt-2 bg-gradient-to-r from-green-100 to-teal-100 text-white font-bold rounded-xl shadow-md hover:from-green-200 hover:to-teal-200 transition-all duration-300":"sm:col-span-2 w-full py-3 mt-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300"}
        >
          {load ? 
          
          
<HashLoader color="teal" size={30} cssOverride={override} />
         
          
          
          
          : "Sign Up"}
        </motion.button>
      </motion.form>
    </div>
  );
}

// Reusable Input with Icon
function InputWithIcon({ Icon, name, value, placeholder, handleChange, error, type = "text", isFullWidth = false }) {
  return (
    <div className={`relative ${isFullWidth ? "sm:col-span-2" : ""}`}>
      <Icon className="absolute top-3 left-3 text-gray-400" />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="pl-10 w-full py-2 rounded-xl bg-white/70 shadow-inner focus:outline-none"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

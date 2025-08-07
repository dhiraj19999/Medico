import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email required";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Login successful!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center bg-gradient-to-tr p-4 mt-12">
      {/* Animated GIF */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden sm:block w-full max-w-md mr-6"
      >
        <img
          src="https://media.tenor.com/y2JXkY1pXkwAAAAC/login.gif
"
          alt="Login GIF"
          className="rounded-3xl shadow-lg w-full"
        />
      </motion.div>

      {/* Login Form */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="w-full max-w-xl backdrop-blur-xl bg-white/30 shadow-2xl rounded-3xl p-6 sm:p-10 grid grid-cols-1 gap-6 border border-white/40"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 drop-shadow mb-2">
          Welcome Back to Healix 👋
        </h2>

        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="pl-10 w-full py-2 rounded-xl bg-white/70 shadow-inner focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="pl-10 w-full py-2 rounded-xl bg-white/70 shadow-inner focus:outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
        >
          Log In
        </motion.button>
      </motion.form>
    </div>
  );
}

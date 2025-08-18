import { motion } from "framer-motion";
import { useState } from "react";
import loginlogo from "../assets/login.gif"
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import {
   FaEnvelope, FaLock, 
 
} from "react-icons/fa";
import { HashLoader } from "react-spinners";
import axiosInstance from "../api/Api";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [formData, setFormData] = useState({
   
    email: "",
    password: "",
   
  });
 const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [load, setLoad] = useState(false);
    const setUser = useUserStore((state) => state.setUser);
const override = {
  display: "block",
 
  borderColor: "red",
  margin: "0 auto",
};
  const validate = () => {
    const newErrors = {};
   
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Min 6 characters";
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



const getUser= async () => {
   
    try {
      const response = await axiosInstance.get("/auth/user", {
        headers: {
          "Content-Type": "application/json"
       
        },
      });
      console.log("User data:", response.data);
       if (response.data) setUser(response.data);
     
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  
  }
  




  const handleChange =  (e) => {
  const { name, value } = e.target;

 
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
};

const LoginUser = async () => {

  await axiosInstance.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/json", 
      },
    })
    .then((response) => {
      console.log("Login successful:", response.data);
      getUser();
     // Cookies.set("token", response.data.token, { expires: 7 }); // Set cookie for 7 days
      setLoad(false);
      toast.success("✅ Login successful!", {
  icon: "🚀",
  style: { fontSize: "1rem", fontWeight: "bold" },
});
     // window.location.href = "/login"; // Redirect to login after successful registration
    // window.location.href = "/"; // Redirect to home after successful login
    navigate("/");
    })
    .catch((error) => {
      console.error("Registration error:", error);
      setLoad(false);
      toast.error(error.response?.data?.message || "❌ Login failed!", {
  icon: "⚠️",
  style: { fontSize: "1rem", fontWeight: "bold" },
});
     
    });  


 }
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoad(true);
      LoginUser();
    }
  };

  return (
<div className="min-h-screen flex flex-col sm:flex-row md:flex-row items-center justify-center bg-gradient-to-tr p-4 pt-24 ">
  {/* GIF Section */}

 
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full max-w-md mb-6 sm:mb-0 sm:mr-6"  // hidden hata diya, mobile me niche margin diya
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
    className="w-full max-w-2xl backdrop-blur-xl bg-white/30 shadow-2xl rounded-3xl p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-6 border border-white/40   justify-center items-center"
  >
     <div className="sm:col-span-2 flex justify-center">
    <img
      src={loginlogo}
      alt="Logo"
      className="w-[60px] h-[60px] rounded-full"
    />
  </div>
    <h2 className="text-3xl sm:col-span-2  font-extrabold text-center text-gray-800 drop-shadow mb-2">
      Login to Your Healix Account
    </h2>

    {/* Form Fields */}
    <InputWithIcon
      Icon={FaEnvelope}
      name="email"
      placeholder="Email Address"
      value={formData.email}
      handleChange={handleChange}
      error={errors.email}
      type="email"
    />
    <InputWithIcon
      Icon={FaLock}
      name="password"
      placeholder="Password"
      value={formData.password}
      handleChange={handleChange}
      error={errors.password}
      type="password"
    />

    {/* Submit */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      disabled={load}
      className={
        load
          ? "sm:col-span-2 w-full py-3 mt-2 bg-gradient-to-r from-green-100 to-teal-100 text-white font-bold rounded-xl shadow-md hover:from-green-200 hover:to-teal-200 transition-all duration-300"
          : "sm:col-span-2 w-full py-3 mt-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300"
      }
    >
      {load ? <HashLoader color="teal" size={30} cssOverride={override} /> : "Login"}
    </motion.button>
    <Link to="/register" className="text-teal-500 font-semibold text-sm mt-2 hover:underline">
    Don't have an account? Sign up here.
  </Link>
   <Link to="/doctorlogin" className="text-teal-500 font-semibold text-sm mt-2 hover:underline">
    Login as a Doctor.
  </Link>
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

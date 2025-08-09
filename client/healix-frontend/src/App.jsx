
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar';
import SignupForm from './pages/SignUp';
import LoginForm from './pages/Login';
import { useEffect } from 'react';
import axiosInstance from './api/Api';
import useUserStore from './store/useUserStore';
function App() {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const getUser= async () => {
    try {
      const response = await axiosInstance.get("/auth/user", {
        headers: {
          "Content-Type": "application/json"
       
        },
      });
      console.log("User data:", response.data);
       if (response.data) setUser(response.data);
      if(user) console.log("User from store:", user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  
  
  useEffect(() => {
    
getUser();

console.log("User updated in store:", user);
  }, []);
  
  
  
  
  
  
  return (
    <BrowserRouter>
   <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored" // "light", "dark", or "colored"
  className="custom-toast-container"
/>

      <Navbar />
   
    <LoginForm/>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;














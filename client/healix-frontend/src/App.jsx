
import './App.css'
import Footer from './components/Footer';
import Cookies from 'js-cookie';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar';
import SignupForm from './pages/SignUp';
import LoginForm from './pages/Login';
import { useEffect } from 'react';
import axiosInstance from './api/Api';
import useUserStore from './store/useUserStore';
import HomePage from './pages/Home';
import About from './pages/About';
import ChatBot from './pages/Chatbot';
import NearbyFinder from './pages/NearBy';
import DoctorRegistrationForm from './pages/DocRegistaration.jsx';
import {PrivateRoute} from './components/PrivateRoute.jsx';
import PricingPage from './pages/Pricing';
import BookAppointment from './pages/BookAppointment.jsx';
import DoctorLoginForm from './pages/doctor/Doctorlogin.jsx';
import HealthTrendsDashboard from './pages/HealthTrend';
import ReportDashboard from './pages/ReportDashbord';
import CreateHospital from './pages/admin/CreateHospital.jsx';
import Hospitalassign from './pages/doctor/AssignHopital.jsx';
import AppointmentsPage from './pages/Appointment.jsx';
import ModifyAppointments from './pages/doctor/ModifyStatus.jsx';
function App() {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const setLoadingUser = useUserStore((state) => state.setLoadingUser);
  //const cookie = Cookies.get("token");
  //console.log("Cookie:", cookie);
  const getUser= async () => {
   setLoadingUser(true)
    try {
      const response = await axiosInstance.get("/auth/user", {
        headers: {
          "Content-Type": "application/json"
       
        },
      });
      console.log("User data:", response.data);
       if (response.data) setUser(response.data);
       setLoadingUser(false);
     
    } catch (error) {
     
      setLoadingUser(false);
    }
  
  }
  
  
  useEffect(() => {
    
getUser();


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
  {/* <HomePage/>*/}
   {/*<About/>*/}
   {/* <ChatBot /> */}
   
  
      <Routes>
        
        {/* Add more routes here */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<PrivateRoute><About /></PrivateRoute> } />
        <Route path="/chatbot" element={<PrivateRoute><ChatBot /></PrivateRoute>} />
       
        <Route path="/nearby" element={<PrivateRoute><NearbyFinder /></PrivateRoute>} />
         <Route path="/login" element={<LoginForm />} />
         <Route path="/register" element={<SignupForm />} />
         <Route path="/pricing" element={<PricingPage />} />
         <Route path="/health-report" element={<PrivateRoute><ReportDashboard /></PrivateRoute>} />
         <Route path="/dashboard" element={<PrivateRoute><HealthTrendsDashboard /></PrivateRoute>} />
         <Route path="/docregister" element={<DoctorRegistrationForm />} />
          <Route path="/book-appointment" element={<AppointmentsPage />} />
          <Route path="/create-hospital" element={<CreateHospital />} />
          <Route path='/doctorlogin' element={<DoctorLoginForm/>}/>
          <Route path='/assign-hospital' element={<Hospitalassign/>}/>
          <Route path='/modify-appointment' element={<ModifyAppointments/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;














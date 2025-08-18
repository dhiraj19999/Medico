
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
import { AdminPrivate } from './pages/admin/AdminPrivate.jsx';
import { DocPrivate } from './pages/doctor/DocPrivate.jsx';
import DoctorInsights from './pages/doctor/DoctorInsight.jsx';
import AllDoc from './pages/admin/AllDoctors.jsx';
import DOCInsight from './pages/admin/DocInsight.jsx';

function App() {
  const setUser = useUserStore((s) => s.setUser);
  const setLoadingUser = useUserStore((s) => s.setLoadingUser);

  const getUser = async () => {
    setLoadingUser(true);
    try {
      const res = await axiosInstance.get("/auth/user", {
        headers: { "Content-Type": "application/json" },
      });
      // backend se plain user aa raha hai
      if (res.data) setUser(res.data);
      setLoadingUser(false);
    } catch (err) {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    getUser(); // refresh pe cookie se user hydrate
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />

        <Route path="/chatbot" element={<PrivateRoute><ChatBot /></PrivateRoute>} />
        <Route path="/nearby" element={<PrivateRoute><NearbyFinder /></PrivateRoute>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/health-report" element={<PrivateRoute><ReportDashboard /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><HealthTrendsDashboard /></PrivateRoute>} />
        <Route path="/docregister" element={<AdminPrivate><DoctorRegistrationForm /></AdminPrivate>} />
        <Route path="/book-appointment" element={<PrivateRoute><AppointmentsPage /></PrivateRoute>} />
        <Route path="/create-hospital" element={<AdminPrivate><CreateHospital /></AdminPrivate>} />
        <Route path="/doctorlogin" element={<DoctorLoginForm />} />
        <Route path="/assign-hospital" element={<AdminPrivate><Hospitalassign /></AdminPrivate>} />
        <Route path="/modify-appointment" element={<DocPrivate><ModifyAppointments/></DocPrivate>} />
        <Route path="/doctorinsights" element={<DocPrivate><DoctorInsights/></DocPrivate>} />
       <Route path="/all-doc" element={<AdminPrivate><AllDoc/></AdminPrivate>} />
       <Route path="/insight/:docId" element={<AdminPrivate><DOCInsight/></AdminPrivate>} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;











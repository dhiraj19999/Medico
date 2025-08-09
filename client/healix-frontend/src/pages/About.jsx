import React from "react";
import { motion } from "framer-motion";
import {
  FaUserMd, FaCalendarCheck, FaUser, FaHistory, FaFileAlt, FaLanguage,
  FaBell, FaVideo, FaPrescriptionBottleAlt, FaFlask, FaMapMarkerAlt,
  FaMoneyCheckAlt, FaAmbulance, FaReceipt, FaRobot, FaPills, FaChartLine,
  FaUsers, FaMicrophone, FaVideoSlash, FaHeart, FaSyncAlt
} from "react-icons/fa";

const services = [
  {
    category: "Core Features",
    items: [
      { icon: <FaUserMd />, title: "👨⚕️ Doctor Directory Listing", desc: "Find trusted doctors near you with easy filters and detailed profiles." },
      { icon: <FaCalendarCheck />, title: "📆 Book Appointment", desc: "Schedule in-person and soon video appointments at your convenience." },
      { icon: <FaUser />, title: "👤 User Profile & Registration", desc: "Securely manage your personal and health information." },
      { icon: <FaHistory />, title: "🗂 Past Appointments History", desc: "Keep track of all your previous consultations in one place." },
      { icon: <FaFileAlt />, title: "📋 Upload & View Health Reports", desc: "Store and access your medical reports (PDF/Image) anytime." },
      { icon: <FaLanguage />, title: "🌐 Multi-language Support", desc: "Use Healix comfortably in Hindi, Marathi, English and more." },
      { icon: <FaBell />, title: "📳 Push Notifications", desc: "Receive reminders and personalized health tips directly." },
    ],
  },
  {
    category: "Intermediate Features",
    items: [
      { icon: <FaVideo />, title: "📹 Teleconsultation via Video/Audio", desc: "Connect remotely with your doctor using WebRTC/Zoom API." },
      { icon: <FaPrescriptionBottleAlt />, title: "📄 Doctor’s Digital Prescription Generator", desc: "Access digital prescriptions without paperwork." },
      { icon: <FaFlask />, title: "🧪 Lab Test Booking", desc: "Book pathology tests with partnered labs easily." },
      { icon: <FaMapMarkerAlt />, title: "📍 Location Detection", desc: "Find hospitals and pharmacies near you automatically." },
      { icon: <FaMoneyCheckAlt />, title: "💰 UPI Payment Integration", desc: "Make secure payments seamlessly with Razorpay." },
      { icon: <FaAmbulance />, title: "📞 Emergency SOS Button", desc: "Call ambulance or family instantly in emergencies." },
      { icon: <FaReceipt />, title: "🧾 Basic Billing/Invoice System", desc: "Get invoices for your consultations and tests." },
    ],
  },
  {
    category: "Advanced + AI-Powered Features",
    items: [
      { icon: <FaRobot />, title: "🧾 OCR-Based Report Reader", desc: "Upload reports and get AI-extracted insights instantly." },
      { icon: <FaPills />, title: "💊 Medicine Identifier", desc: "Scan pills and get detailed medicine info." },
      { icon: <FaChartLine />, title: "🔁 AI-Driven Personalized Health Tips", desc: "Receive health advice tailored to you by AI." },
      { icon: <FaHeart />, title: "🎯 Predictive Disease Alerts", desc: "Get early warnings based on symptoms and history." },
      { icon: <FaSyncAlt />, title: "📡 Offline-first Mode", desc: "Use Healix offline with data syncing later." },
    ],
  },
  {
    category: "Future / Growth-Stage Features",
    items: [
      { icon: <FaUsers />, title: "🧑‍🤝‍🧑 Community Forum", desc: "Ask doctors questions and share health experiences." },
      { icon: <FaFileAlt />, title: "🧾 Govt Scheme Checker", desc: "Check your eligibility for schemes like Ayushman Bharat." },
      { icon: <FaMicrophone />, title: "🗣️ Voice Command Support", desc: "Use voice commands for easier access, especially for disabled users." },
      { icon: <FaVideoSlash />, title: "🧑‍🏫 Live Health Webinars", desc: "Attend webinars and awareness camps live." },
      { icon: <FaVideo />, title: "📺 Health Video Library", desc: "Watch short videos explaining health topics." },
      { icon: <FaUsers />, title: "🔄 Referral Rewards / Invite System", desc: "Invite friends and earn rewards." },
      { icon: <FaMapMarkerAlt />, title: "🧭 Navigation to Nearest Clinic/Hospital", desc: "Get directions to the closest healthcare centers." },
    ],
  },
];

// Define animation variants
const variants = {
  left: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  right: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  bottom: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
};

const animationTypes = ["left", "right", "bottom"];

const getRandomVariant = () => {
  const randomIndex = Math.floor(Math.random() * animationTypes.length);
  return variants[animationTypes[randomIndex]];
};

const WhoWeAre = () => (
  <motion.section
    className="max-w-screen-xl mx-auto py-16 px-6 text-center"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={variants.bottom}
  >
    <h2 className="text-4xl font-extrabold mb-6 text-teal-900">Who We Are</h2>
    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
      Healix is a smart healthcare system combining cutting-edge AI with compassionate care to make wellness accessible to everyone. We empower you with the right tools and information for better health decisions.
    </p>
  </motion.section>
);

const VisionMission = () => (
  <motion.section
    className="max-w-screen-xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 text-teal-900"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={variants.bottom}
  >
    <motion.div className="bg-teal-50 p-8 rounded-lg shadow-md" variants={variants.left}>
      <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
      <p className="text-gray-700 text-lg">
        To revolutionize healthcare by creating a user-friendly, AI-powered platform that brings precision and personalized care to everyone’s fingertips.
      </p>
    </motion.div>
    <motion.div className="bg-teal-50 p-8 rounded-lg shadow-md" variants={variants.right}>
      <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
      <p className="text-gray-700 text-lg">
        To empower users with seamless access to healthcare services, trusted information, and AI-driven insights — all while ensuring data privacy and ease of use.
      </p>
    </motion.div>
  </motion.section>
);

const ServicesSection = () => (
  <section className="max-w-screen-xl mx-auto py-16 px-6">
    {services.map(({ category, items }, idx) => (
      <motion.div
        key={idx}
        className="mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={variants.bottom}
      >
        <h2 className="text-4xl font-extrabold mb-10 text-teal-900 border-b-4 border-teal-600 inline-block pb-2">
          {category}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map(({ icon, title, desc }, i) => {
            const variantName = animationTypes[(idx + i) % animationTypes.length]; // cycle through for consistency
            const variant = variants[variantName];
            return (
              <motion.div
                key={i}
                className="flex items-start gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={variant}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-teal-600 text-4xl mt-1">{icon}</div>
                <div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-gray-700">{desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    ))}
  </section>
);

export default function Services() {
  return (
    <main className="bg-white min-h-screen mt-20">
      <WhoWeAre />
      <VisionMission />
      <ServicesSection />
    </main>
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaFileMedical,
  FaLanguage,
  FaBell,
  FaVideo,
  FaPrescriptionBottleAlt,
  FaFlask,
  FaMapMarkerAlt,
  FaMoneyCheckAlt,
  FaRobot,
  FaPills,
  FaChartLine,
  FaHeart,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import doctor from "../assets/doctor.png";
import doctor2 from "../assets/doctor2.webp";  
// Cartoon Illustrations
const heroImages = [doctor, doctor2];
const features = [
  {
    title: "Trusted Doctor Directory",
    desc: "Find the right doctor quickly from hundreds of verified professionals near you. Filter by specialty, location, and reviews — so you get expert care you can trust.",
    icon: <FaUserMd />,
    img: "https://img.freepik.com/free-vector/doctor-checklist-concept-illustration_114360-1898.jpg",
  },
  {
    title: "Easy Appointment Booking",
    desc: "Book in-person or video consultations in just a few taps. Skip the waiting room — get timely care from the comfort of your home or on the go.",
    icon: <FaCalendarCheck />,
    img: "https://img.freepik.com/free-vector/appointment-booking-concept-illustration_114360-5169.jpg",
  },
  {
    title: "Your Health, All in One Place",
    desc: "Keep your medical records, appointment history, and reports organized safely. Access your health info anytime, anywhere — because your health data should be easy to manage.",
    icon: <FaFileMedical />,
    img: "https://img.freepik.com/free-vector/medical-record-concept-illustration_114360-1683.jpg",
  },
  {
    title: "Communicate in Your Language",
    desc: "Healix supports Hindi, Marathi, and more — so you can use the app easily in your preferred language. Healthcare should be simple and inclusive.",
    icon: <FaLanguage />,
    img: "https://img.freepik.com/free-vector/language-learning-concept-illustration_114360-7413.jpg",
  },
  {
    title: "Never Miss an Appointment",
    desc: "Get smart reminders and personalized health tips sent straight to your phone — stay on top of your health without stress.",
    icon: <FaBell />,
    img: "https://img.freepik.com/free-vector/notification-concept-illustration_114360-2566.jpg",
  },
];

const intermediateFeatures = [
  {
    title: "Consult Your Doctor from Anywhere",
    desc: "Connect instantly with your doctor via video or audio calls. No travel needed — get expert advice wherever you are.",
    icon: <FaVideo />,
    img: "https://img.freepik.com/free-vector/telemedicine-concept-illustration_114360-8905.jpg",
  },
  {
    title: "Digital Prescriptions at Your Fingertips",
    desc: "Receive and manage prescriptions digitally. No more lost papers — access your medicines info anytime.",
    icon: <FaPrescriptionBottleAlt />,
    img: "https://img.freepik.com/free-vector/online-pharmacy-concept-illustration_114360-8350.jpg",
  },
  {
    title: "Book Lab Tests Conveniently",
    desc: "Schedule pathology tests online and get results directly on Healix. Stay informed and in control of your health journey.",
    icon: <FaFlask />,
    img: "https://img.freepik.com/free-vector/medical-research-concept-illustration_114360-8922.jpg",
  },
  {
    title: "Find Nearby Hospitals & Pharmacies",
    desc: "Automatically discover healthcare centers and medical stores close to you. Emergency or routine — help is always nearby.",
    icon: <FaMapMarkerAlt />,
    img: "https://img.freepik.com/free-vector/hospital-building-concept-illustration_114360-1694.jpg",
  },
  {
    title: "Easy & Secure Payments",
    desc: "Pay hassle-free using UPI. Your bookings, consultations, and purchases all in one trusted platform.",
    icon: <FaMoneyCheckAlt />,
    img: "https://img.freepik.com/free-vector/online-payment-concept-illustration_114360-2385.jpg",
  },
];

const advancedFeatures = [
  {
    title: "AI That Understands Your Health Reports",
    desc: "Upload reports and let Healix’s AI highlight key insights — so you get clearer understanding without medical jargon.",
    icon: <FaRobot />,
    img: "https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-8264.jpg",
  },
  {
    title: "Instant Medicine Identification",
    desc: "Scan any pill to instantly learn about its uses and precautions — take medicine safely with confidence.",
    icon: <FaPills />,
    img: "https://img.freepik.com/free-vector/medicine-bottle-concept-illustration_114360-7626.jpg",
  },
  {
    title: "Personalized Health Tips Just for You",
    desc: "Get AI-powered advice tailored to your unique health profile — simple tips that make a real difference.",
    icon: <FaChartLine />,
    img: "https://img.freepik.com/free-vector/healthy-habits-concept-illustration_114360-7454.jpg",
  },
  {
    title: "Early Alerts to Keep You Safe",
    desc: "Receive warnings about potential health risks based on your symptoms and history — be proactive, not reactive.",
    icon: <FaHeart />,
    img: "https://img.freepik.com/free-vector/medical-protection-concept-illustration_114360-1713.jpg",
  },
];

// Animation Variants
const variants = {
  left: {
    hidden: { opacity: 0, x: -100, y: 0 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8 } },
  },
  right: {
    hidden: { opacity: 0, x: 100, y: 0 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8 } },
  },
  up: {
    hidden: { opacity: 0, y: 50, x: 0 },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.8 } },
  },
};
const getVariant = (idx) => {
  const types = ["left", "right", "up"];
  return variants[types[idx % types.length]];
};

// FAQ data
const faqs = [
  {
    question: "Is Healix free to use?",
    answer: "Yes, the basic features are completely free. Premium features will be available soon.",
  },
  {
    question: "Can I book video appointments?",
    answer: "Absolutely! Healix supports both in-person and video appointments for your convenience.",
  },
  {
    question: "Is my health data secure?",
    answer: "We use top-notch encryption and follow industry standards to keep your data safe and private.",
  },
  {
    question: "Does Healix support multiple languages?",
    answer: "Yes, currently Hindi, Marathi, and English are supported with more coming soon.",
  },
];

// Welcome Hero Section
const WelcomeHero = () => (
  <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-24 bg-gradient-to-r from-teal-100 to-white gap-12 max-w-screen-xl mx-auto overflow-hidden">
    <motion.div
      className="md:w-1/2 text-center md:text-left"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-5xl font-extrabold text-teal-900 mb-6">
        Welcome to Healix
      </h1>
      <p className="text-xl text-gray-700 leading-relaxed">
        Your ultimate AI-powered healthcare companion. From booking appointments to AI-driven health insights — we bring precision and care to your fingertips.
      </p>
    </motion.div>
    <motion.img
      src={heroImages[0]}
      alt="Healthcare Hero"
      className="md:w-1/2 rounded-xl shadow-xl max-w-full"
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    />
  </section>
);

// Reusable Feature Section
const FeatureSection = ({ title, items }) => (
  <section className="max-w-screen-xl mx-auto py-24 px-4 md:px-0 space-y-24">
    <h2 className="text-4xl md:text-5xl font-extrabold text-center text-teal-900 mb-16">
      {title}
    </h2>

    {items.map((feature, idx) => {
      const variant = getVariant(idx);
      const isEven = idx % 2 === 0;
      return (
        <motion.div
          key={idx}
          className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? "" : "md:flex-row-reverse"}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variant}
        >
          <motion.img
            src={feature.img}
            alt={feature.title}
            className="md:w-1/2 rounded-xl shadow-xl max-w-full bg-white"
            variants={variant}
          />

          <motion.div className="md:w-1/2 space-y-6" variants={variant}>
            <h3 className="text-4xl font-bold text-teal-900 flex items-center gap-4">
              <span className="text-5xl text-teal-600">{feature.icon}</span>
              {feature.title}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">{feature.desc}</p>
          </motion.div>
        </motion.div>
      );
    })}
  </section>
);

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="max-w-screen-xl mx-auto py-24 px-4 md:px-0 bg-teal-50 rounded-xl shadow-lg space-y-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-teal-900 mb-16">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-teal-300 rounded-lg shadow-sm">
            <button
              onClick={() => toggleIndex(i)}
              className="w-full px-6 py-4 flex justify-between items-center text-left text-teal-800 font-semibold text-lg hover:bg-teal-50 transition"
            >
              {faq.question}
              {openIndex === i ? (
                <FaChevronUp className="text-teal-600" />
              ) : (
                <FaChevronDown className="text-teal-600" />
              )}
            </button>
            {openIndex === i && (
              <div className="px-6 pb-6 text-gray-700">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// Footer CTA Section
const CTASection = () => (
  <section className="bg-teal-600 text-white py-20 px-6 text-center rounded-xl max-w-screen-xl mx-auto shadow-lg mb-24 mt-3">
    <motion.h2
      className="text-4xl md:text-5xl font-extrabold mb-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      Ready to take control of your health?
    </motion.h2>
    <motion.p
      className="mb-10 max-w-xl mx-auto text-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      Join thousands of users who trust Healix for smarter, faster, and personalized healthcare.
    </motion.p>
    <motion.button
      className="bg-white text-teal-700 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-teal-50 transition"
      initial={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Get Started Now
    </motion.button>
  </section>
);

export default function HomePage() {
  return (
    <main className="bg-white min-h-screen overflow-x-hidden mt-5">
      <WelcomeHero />
      <FeatureSection title="Core Features – MVP Ready" items={features} />
      <FeatureSection title="Intermediate Features" items={intermediateFeatures} />
      <FeatureSection title="Advanced AI-Powered Features" items={advancedFeatures} />
      <FAQSection />
      <CTASection />
    </main>
  );
}

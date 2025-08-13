import React, { useState } from "react";
import { motion } from "framer-motion";
import useUserStore from "../store/useUserStore";
const plans = [
  {
    name: "Basic",
    priceUSD: 9,
    priceINR: 750,
    features: ["Access to core features", "Email support", "1 user"],
  },
  {
    name: "Pro",
    priceUSD: 19,
    priceINR: 1500,
    features: ["All Basic features", "Priority support", "Up to 5 users"],
    offer: "Save 20% on annual subscription!",
  },
  {
    name: "Enterprise",
    priceUSD: 49,
    priceINR: 3900,
    features: ["All Pro features", "Dedicated manager", "Unlimited users"],
    offer: "Save 25% on annual subscription!",
  },
];



 function PremiumCard() {
  const [rotation, setRotation] = useState(0);

  const handleMouseMove = (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    setRotation(x * 360); // full 360 rotation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <motion.div
        onMouseMove={handleMouseMove}
        animate={{ rotateY: rotation }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="w-96 h-56 rounded-2xl shadow-2xl relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #000000, #0d0d0d)",
          boxShadow: "0px 0px 30px rgba(255, 215, 0, 0.15)",
          perspective: "1000px",
        }}
      >
        {/* Glow Border */}
        <div className="absolute inset-0 rounded-2xl border border-gray-700 shadow-[0_0_20px_#FFD700]" />

        {/* Healix Logo */}
        <div className="absolute top-4 left-4 text-lg font-bold text-yellow-400 tracking-widest">
          HEALIX
        </div>

        {/* Card Details */}
        <div className="absolute bottom-8 left-6">
          <p className="text-gray-300 text-sm tracking-widest">CARDHOLDER</p>
          <p className="text-white text-lg font-semibold">John Doe</p>
          <p className="text-gray-400 text-sm">Age: 32</p>
          <p className="mt-2 text-lg tracking-widest text-gray-200">
            **** **** **** 4598
          </p>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="mt-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400">
          Premium Healix Card Benefits
        </h2>
        <ul className="space-y-2 text-gray-300">
          <li>🏥 Up to 40% discount on hospital bills</li>
          <li>💊 Free yearly health checkup</li>
          <li>🚑 Priority emergency support</li>
          <li>📅 Exclusive appointment slots</li>
        </ul>
      </div>
    </div>
  );
}






const PricingCard = ({ plan, currency }) => {
  const price = currency === "USD" ? plan.priceUSD : plan.priceINR;
  const symbol = currency === "USD" ? "$" : "₹";

  return (
    <motion.div
      className="bg-white shadow-xl rounded-2xl p-8 flex flex-col justify-between hover:scale-105 transition-transform duration-300 relative border-2 border-teal-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {plan.offer && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white font-bold px-4 py-1 rounded-full text-sm shadow-md">
          {plan.offer}
        </div>
      )}
      <h3 className="text-3xl font-bold text-teal-700 mb-4">{plan.name}</h3>
      <p className="text-4xl font-extrabold text-gray-900 mb-6">
        {symbol}{price}
        <span className="text-lg font-medium text-gray-500">/month</span>
      </p>
      <ul className="mb-6 space-y-2">
        {plan.features.map((feat, idx) => (
          <li key={idx} className="flex items-center gap-2 text-gray-700">
            <span className="text-teal-500 font-bold">✔</span> {feat}
          </li>
        ))}
      </ul>
      <button className="mt-auto bg-gradient-to-r from-teal-400 via-teal-500 to-sky-500 text-white font-bold py-3 rounded-xl hover:from-teal-500 hover:via-teal-600 hover:to-sky-600 shadow-lg transition-all duration-300">
        Choose Plan
      </button>
    </motion.div>
  );
};

export default function PricingPage() {
  const [currency, setCurrency] = useState("USD");
  const user = useUserStore((state) => state.user);
  return (
    <main className="bg-gradient-to-b from-teal-50 to-white min-h-screen py-16 px-6 md:px-12">
      <motion.h1
        className="text-5xl font-extrabold text-teal-900 text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Choose Your Plan
      </motion.h1>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Select a subscription that fits your needs. Save more when you choose an annual plan!
      </p>

      {/* Currency Toggle */}
      <div className="flex justify-center mb-12 gap-4">
        <button
          className={`px-6 py-2 rounded-full font-semibold transition ${
            currency === "USD"
              ? "bg-teal-500 text-white shadow-lg"
              : "bg-white text-teal-700 border border-teal-500 hover:bg-teal-100"
          }`}
          onClick={() => setCurrency("USD")}
        >
          USD
        </button>
        <button
          className={`px-6 py-2 rounded-full font-semibold transition ${
            currency === "INR"
              ? "bg-teal-500 text-white shadow-lg"
              : "bg-white text-teal-700 border border-teal-500 hover:bg-teal-100"
          }`}
          onClick={() => setCurrency("INR")}
        >
          INR
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <PricingCard key={idx} plan={plan} currency={currency} />
        ))}
      </div>

      {/* Yearly subscription highlight */}
      <motion.div
        className="mt-16 max-w-4xl mx-auto bg-teal-100 rounded-xl p-8 text-center shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-teal-800 mb-4">
          Special Offer: Annual Subscription
        </h2>
        <p className="text-gray-700 mb-4">
          Pay for 12 months upfront and get up to 25% discount on all plans! Unlock exclusive benefits and priority support.
        </p>
        <button className="bg-gradient-to-r from-teal-400 via-teal-500 to-sky-500 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:from-teal-500 hover:via-teal-600 hover:to-sky-600 transition-all duration-300">
          Get Annual Plan
        </button>
      </motion.div>

      <PremiumCard user={user} />
    </main>
  );
}

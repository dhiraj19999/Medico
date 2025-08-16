import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/Api.js";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import { FaStar, FaRegStar } from "react-icons/fa";

// debounce helper
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [selectedHospital, setSelectedHospital] = useState("");
  const [booking, setBooking] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ lat: null, long: null });

  // Fetch nearby doctors by lat/long
  const getDoctors = async (lat, long) => {
    console.log(lat,long)
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/doctor/nearbydoc?latitude=${lat}&longitude=${long}`
      );
      setDoctors(res.data.data);
      console.log(res.data.data)
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors by search
  const searchDoctors = async (query) => {
    if (!query.trim()) {
      if (coords.lat && coords.long) getDoctors(coords.lat, coords.long);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/doctor/search`, { search: query });
      setDoctors(res.data.data || []);
    } catch (error) {
      console.error("Error searching doctors:", error);
       setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((val) => {
      searchDoctors(val);
    }, 500),
    [coords]
  );

function calculateAverageRating(ratings) {
  if (!ratings.length) return 0;

  const filteredRatings = ratings.filter(r => r > 0);

  if (!filteredRatings.length) return 0;

  const sum = filteredRatings.reduce((acc, rating) => acc + rating, 0);
  const average = sum / filteredRatings.length;

  // agar integer hai to as it is, nahi to 1 decimal
  return Number.isInteger(average) ? average : parseFloat(average.toFixed(1));
}

function convertTo12Hour(time) {
  let [hour, minute] = time.split(":").map(Number);
  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

  // Initial fetch on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        setCoords({ lat, long });
        getDoctors(lat, long);
      },
      (err) => {
        console.error(err);
        toast.warning("📍 Location permission denied. Fill manually.");
        setLoading(false);
      }
    );
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedHospital("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDoctor(null);
    setAppointmentData({ date: "", time: "", reason: "" });
    setSelectedHospital("");
  };

  const handleChange = (e) => {
    setAppointmentData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBooking = async () => {
    const { date, time, reason } = appointmentData;
    if (!date || !time) return toast.error("📅 Select date and time");
    if (!selectedHospital) return toast.error("🏥 Please select a hospital");

    try {
      setBooking(true);

      await axiosInstance.post("/appointment/book", {
        doctor: selectedDoctor._id,
        date,
        time,
        reason,
        hospital: selectedHospital,
      });

      toast.success("✅ Appointment booked successfully and Email sent to you !", {
        icon: "🚀",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Booking failed!", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    } finally {
      setBooking(false);
    }
  };

  const DoctorCardSkeleton = () => (
    <div className="animate-pulse bg-white rounded-2xl shadow-md p-6 text-center flex flex-col h-full">
      <div className="h-32 w-32 rounded-full mx-auto bg-gray-200 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
      <div className="flex justify-center gap-1 mb-3">
        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded mt-auto"></div>
    </div>
  );

  const renderStars = (rating = 4.5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating))
        stars.push(<FaStar key={i} className="text-teal-500 inline" />);
      else if (i - rating < 1)
        stars.push(<FaStar key={i} className="text-teal-300 inline" />);
      else stars.push(<FaRegStar key={i} className="text-gray-300 inline" />);
    }
    return stars;
  };

  const override = {
    display: "block",
    borderColor: "red",
    margin: "0 auto",
  };

  return (
    <div className="p-4 pt-20 -mt-16 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        📅🩺 Book an Appointment with Nearby Doctors
      </h1>

      {/* Search bar */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search doctors by name, city, state, or pincode..."
          value={search}
          onChange={handleSearchChange}
          className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* GRID: 1 col on mobile, 2 on md, 3 on lg+ */}
     {/* GRID OR NO RESULT */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading ? (
    Array(6)
      .fill(0)
      .map((_, idx) => <DoctorCardSkeleton key={idx} />)
  ) : doctors.length > 0 ? (
    doctors.map((doc) => (
      <motion.div
        key={doc._id}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col h-full"
      >
        <img
          src={doc.avatar}
          alt={doc.name}
          className="w-32 h-32 rounded-full mx-auto object-cover shadow-md mb-3"
        />
        <div className="mb-3">
          {renderStars(calculateAverageRating(doc.rating))}
          <span className="text-gray-500 ml-2">{calculateAverageRating(doc.rating)}</span>
        </div>
        <h2 className="text-xl font-bold">{doc.name}</h2>

        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm">
            {doc.specialization.replace(/,/g, '|')     // saare commas remove
  .replace(/\s+/g, ' ')  // multiple spaces ko single space me convert
  .trim()}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm shadow-sm">
            {doc.qualifications} | {doc.experience} yr exp
          </span>
          <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm">
            {doc.address.city} | {doc.address.state}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {doc.availableDays.map((day) => (
            <span
              key={day}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {day}
            </span>
          ))}
        </div>

        {doc.availableTime && (
          <p className="text-gray-700 mt-2 font-medium">
            {convertTo12Hour(doc.availableTime.start)} - {convertTo12Hour(doc.availableTime.end)}
          </p>
        )}

        <button
          onClick={() => openModal(doc)}
          className="mt-auto w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300"
        >
          Book Appointment
        </button>
      </motion.div>
    ))
  ) : (
    <div className="col-span-full text-center text-gray-500 font-medium py-10">
      😔 No doctors found
    </div>
  )}
</div>


      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-96 relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">
              Book with {selectedDoctor.name}
            </h2>

            {/* Hospital Selection */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Select Hospital:</h3>
              {selectedDoctor.hospitals?.map((hosp) => (
                <label
                  key={hosp._id}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="hospital"
                    value={hosp._id}
                    checked={selectedHospital === hosp._id}
                    onChange={() => setSelectedHospital(hosp._id)}
                  />
                  <span>
                    {hosp.name} - {hosp.city}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="date"
                name="date"
                value={appointmentData.date}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="time"
                name="time"
                value={appointmentData.time}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <textarea
                name="reason"
                placeholder="Reason (optional)"
                value={appointmentData.reason}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <button
                onClick={handleBooking}
                disabled={booking}
                className={
                  booking
                    ? "bg-gradient-to-r from-green-100 to-teal-100 text-white py-2 rounded-xl shadow-md"
                    : "bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl shadow-md hover:from-green-600 hover:to-teal-600"
                }
              >
                {booking ? (
                  <HashLoader size={25} color="teal" cssOverride={override} />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;

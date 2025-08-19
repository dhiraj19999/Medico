import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/Api";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// debounce helper
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const AllDoc = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ lat: null, long: null });

  const getDoctors = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/doctor/all");
      if (res.data.success) setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  // Delete doctor
  const deleteDoctor = async (id) => {
    setDeleteId(id);
    try {
      const res = await axiosInstance.delete(`/doctor/delete/${id}`);
      toast.success(res.data?.message || "✅ Doctor deleted successfully", {
        icon: "🚀",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
      getDoctors();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Something went wrong", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    } finally {
      setDeleteId("");
    }
  };

  // Search doctors
  const searchDoctors = async (query) => {
    if (!query.trim()) {
      getDoctors();
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

  const debouncedSearch = useCallback(
    debounce((val) => {
      searchDoctors(val);
    }, 500),
    [coords]
  );

  function calculateAverageRating(ratings) {
    if (!ratings?.length) return 0;
    const filteredRatings = ratings.filter((r) => r > 0);
    if (!filteredRatings.length) return 0;
    const sum = filteredRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / filteredRatings.length;
    return Number.isInteger(average) ? average : parseFloat(average.toFixed(1));
  }

  function convertTo12Hour(time) {
    let [hour, minute] = time.split(":").map(Number);
    let ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }

  useEffect(() => {
    getDoctors();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const DoctorCardSkeleton = () => (
    <div className="animate-pulse bg-white rounded-2xl shadow-md p-6 text-center flex flex-col h-full">
      <div className="h-32 w-32 rounded-full mx-auto bg-gray-200 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
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
    <div className="p-4 pt-20 mt-8 max-w-7xl mx-auto ">
      <h1 className="text-3xl font-bold text-center mb-8">🩺 Doctor List</h1>

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
                <span className="text-gray-500 ml-2">
                  {calculateAverageRating(doc.rating)}
                </span>
              </div>
              <h2 className="text-xl font-bold">{doc.name}</h2>

              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  {doc.specialization?.replace(/,/g, " | ").trim()}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  {doc.qualifications} | {doc.experience} yr exp
                </span>
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  {doc.address?.city} | {doc.address?.state}
                </span>
              </div>

              {doc.availableDays?.length > 0 && (
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
              )}

              {doc.availableTime && (
                <p className="text-gray-700 mt-2 font-medium">
                  {convertTo12Hour(doc.availableTime.start)} -{" "}
                  {convertTo12Hour(doc.availableTime.end)}
                </p>
              )}

              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => navigate(`/insight/${doc._id}`)}
                  className="w-1/2 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                >
                  See Insights
                </button>
                <button
                  onClick={() => deleteDoctor(doc._id)}
                  className="w-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-xl shadow-md hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                >
                  {deleteId === doc._id ? (
                    <HashLoader color="white" size={25} cssOverride={override} />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 font-medium py-10">
            😔 No doctors found
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDoc;

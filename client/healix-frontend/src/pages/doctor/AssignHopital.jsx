import { useState, useEffect,useCallback } from "react";
import axiosInstance from "../../api/Api.js";
import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function DoctorAssign() {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [searchHospital, setSearchHospital] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [searchDoctor, setSearchDoctor] = useState("");
  

const handleToggleAssignment = async (hospitalId, alreadyAssigned) => {
  if (!selectedDoctor) return;

  try {
    setAssigning(true);
    const res = await axiosInstance.post("/hospital/assigndoctor", {
      doctorId: selectedDoctor._id,
      hospitalIds: [hospitalId],
      action: alreadyAssigned ? "remove" : "assign",
    });
    toast.success(res.data.message);

    // Local state update
    setSelectedHospitals(prev =>
      alreadyAssigned
        ? prev.filter(id => id !== hospitalId)
        : [...prev, hospitalId]
    );
    fetchDoctors(); // doctor-hospital fresh data
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Operation failed");
  } finally {
    setAssigning(false);
  }
};

  // Fetch doctors
  // debounce helper
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const searchDoctors = async (query) => {
  if (!query.trim()) {
    fetchDoctors();
    return;
  }
  try {
    setLoadingDoctors(true);
    const res = await axiosInstance.post("/doctor/search", { search: query });
    setDoctors(res.data.data || []);
  } catch (error) {
    console.error("Error searching doctors:", error);
    setDoctors([]);
  } finally {
    setLoadingDoctors(false);
  }
};

const debouncedSearch = useCallback(
  debounce((val) => {
    searchDoctors(val);
  }, 500),
  []
);

const handleDoctorSearchChange = (e) => {
  setSearchDoctor(e.target.value);
  debouncedSearch(e.target.value);
};


  
  
  
  function calculateAverageRating(ratings) {
  if (!ratings || !ratings.length) return 0;
  const filtered = ratings.filter(r => r > 0);
  if (!filtered.length) return 0;
  const sum = filtered.reduce((a,b) => a+b, 0);
  const avg = sum / filtered.length;
  return Number.isInteger(avg) ? avg : parseFloat(avg.toFixed(1));
}

const renderStars = (rating = 4.5) => {
  const stars = [];
  for(let i=1;i<=5;i++){
    if(i <= Math.floor(rating)) stars.push(<FaStar key={i} className="text-teal-500 inline"/>)
    else if(i - rating < 1) stars.push(<FaStar key={i} className="text-teal-300 inline"/>)
    else stars.push(<FaRegStar key={i} className="text-gray-300 inline"/>)
  }
  return stars;
};

function convertTo12Hour(time) {
  if(!time) return "";
  let [h,m] = time.split(":").map(Number);
  let ampm = h>=12?"PM":"AM";
  h = h%12||12;
  return `${h}:${m.toString().padStart(2,"0")} ${ampm}`;
}

  
  
  
  
  
  
  
  
  
  
  
  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const res = await axiosInstance.get("/doctor/all");
      if (res.data.success) setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching doctors");
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch hospitals
  const fetchHospitals = async () => {
    try {
      setHospitalLoading(true);
      const res = await axiosInstance.get("/hospital");
      if (res.data.success) setHospitals(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching hospitals");
    } finally {
      setHospitalLoading(false);
    }
  };

  const toggleDoctorAssignment = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedHospitals(doctor.hospitals?.map((h) => h._id) || []);
    fetchHospitals();
  };

  const toggleSelectHospital = (id) => {
    setSelectedHospitals((prev) =>
      prev.includes(id) ? prev.filter((hid) => hid !== id) : [...prev, id]
    );
  };

  const handleAssignHospitals = async () => {
    if (!selectedDoctor) return;
    try {
      setAssigning(true);
      const res = await axiosInstance.post("/hospital/assigndoctor", {
        doctorId: selectedDoctor._id,
        hospitalIds: selectedHospitals,
      });
      toast.success(res.data.message);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Assignment failed");
    } finally {
      setAssigning(false);
    }
  };

  // Filter hospitals
  const filteredHospitals = hospitals.filter((h) => {
    const searchText = searchHospital || "";
    return (
      h.name.toLowerCase().includes(searchText.toLowerCase()) ||
      h.city.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Manual skeleton for loading
  const SkeletonCard = () => (
    <div className="border rounded-lg p-4 shadow animate-pulse">
      <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"></div>
      <div className="h-5 bg-gray-300 rounded mb-2 w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded mb-1 w-2/3 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded mb-1 w-2/3 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded mb-1 w-1/2 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-1/2 mx-auto"></div>
      <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto mt-3"></div>
    </div>
  );

  return (
    <div className="p-6 mt-20 mb-10">
      <h1 className="text-3xl font-bold mb-6">👨‍⚕️ Doctors List</h1>
      <div className="max-w-md mx-auto mb-6">
  <input
    type="text"
    placeholder="Search doctors by name, city, state, or pincode..."
    value={searchDoctor}
    onChange={handleDoctorSearchChange}
    className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
  />
</div>

      {loadingDoctors ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <motion.div
  key={doc._id}
  whileHover={{ scale: 1.02 }}
  className="bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col relative"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  <img
    src={doc.avatar || "/default-doc.png"}
    alt={doc.name}
    className="w-32 h-32 rounded-full mx-auto object-cover shadow-md mb-3"
  />

  {/* Star Ratings */}
  <div className="mb-3 flex justify-center gap-1">
    {renderStars(calculateAverageRating(doc.rating))}
    <span className="text-gray-500 ml-2">{calculateAverageRating(doc.rating)}</span>
  </div>

  <h2 className="text-xl font-bold">{doc.name}</h2>

  {/* Badges: Specialization, Qualification, Location */}
  <div className="flex flex-wrap justify-center gap-2 mt-3">
    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm">
      {doc.specialization.replace(/,/g, '|').replace(/\s+/g,' ').trim()}
    </span>
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm shadow-sm">
      {doc.qualifications} | {doc.experience} yr exp
    </span>
    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm">
      {doc.address.city} | {doc.address.state}
    </span>
  </div>

  {/* Available Days */}
  <div className="flex flex-wrap justify-center gap-2 mt-3">
    {doc.availableDays?.map((day) => (
      <span
        key={day}
        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
      >
        {day}
      </span>
    ))}
  </div>

  {/* Available Time */}
  {doc.availableTime && (
    <p className="text-gray-700 mt-2 font-medium">
      {convertTo12Hour(doc.availableTime.start)} - {convertTo12Hour(doc.availableTime.end)}
    </p>
  )}

  <button
    onClick={() => toggleDoctorAssignment(doc)}
    className="mt-auto w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300"
  >
    Assign Hospital
  </button>

              {selectedDoctor?._id === doc._id && (
                <div className="absolute left-0 mt-2 w-full bg-gray-50 border rounded p-3 shadow-lg z-10">
                  <input
                    type="text"
                    placeholder="Search hospital..."
                    value={searchHospital}
                    onChange={(e) => setSearchHospital(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                  />
                  {hospitalLoading ? (
                    <div className="flex justify-center">
                      <HashLoader color="#36d7b7" size={30} />
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                   {filteredHospitals.map((h) => {
  const assigned = selectedHospitals.includes(h._id);
  return (
    <div
      key={h._id}
      className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
    >
      <div>
        {h.name} ({h.city})
      </div>
      <div>
        <button
          onClick={() => handleToggleAssignment(h._id, assigned)}
          className={`px-3 py-1 rounded text-sm ${
            assigned
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-teal-500 text-white hover:bg-teal-600"
          }`}
        >
          {assigned ? "Remove" : "Assign"} 
        </button>
      </div>
    </div>
  );
})}

                    </div>
                  )}
                 
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

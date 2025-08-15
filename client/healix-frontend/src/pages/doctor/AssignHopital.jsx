import { useState, useEffect } from "react";
import axiosInstance from "../../api/Api.js";
import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Hospitalassign() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/hospital");
      if (res.data.success) {
        setHospitals(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Search filter
  const filtered = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectHospital = (id) => {
    setSelectedHospitals((prev) =>
      prev.includes(id) ? prev.filter((hid) => hid !== id) : [...prev, id]
    );
  };

  const handleAssignDoctor = async () => {
    if (selectedHospitals.length === 0) {
      toast.error("Please select at least one hospital");
      return;
    }
    try {
      setAssigning(true);
      const res = await axiosInstance.post("/hospital/assigndoctor", {
        hospitalIds: selectedHospitals,
      });
      toast.success(res.data.message);
      setSelectedHospitals([]); // Clear selection after assign
    } catch (error) {
      console.error("Error assigning doctor:", error);
      toast.error(error.response?.data?.message || "Failed to assign doctor");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="p-6 mt-20 mb-10">
      <h1 className="text-2xl font-bold mb-4">🏥 Hospital List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {loading ? (
        <div className="flex justify-center mt-10">
          <HashLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          <motion.table
            className="w-full border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Select</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">City</th>
                <th className="border p-2">Pincode</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((h) => (
                  <tr key={h._id} className="hover:bg-gray-100">
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedHospitals.includes(h._id)}
                        onChange={() => toggleSelectHospital(h._id)}
                      />
                    </td>
                    <td className="border p-2">{h.name}</td>
                    <td className="border p-2">{h.city}</td>
                    <td className="border p-2">{h.pincode}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No hospitals found
                  </td>
                </tr>
              )}
            </tbody>
          </motion.table>

          {/* Assign Button */}
          <button
            onClick={handleAssignDoctor}
            disabled={assigning}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {assigning ? "Assigning..." : "Assign Selected Hospitals"}
          </button>
        </>
      )}
    </div>
  );
}

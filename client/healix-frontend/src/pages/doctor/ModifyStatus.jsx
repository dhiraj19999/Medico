import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/Api.js";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
const ModifyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [submitting, setSubmitting] = useState(null);
  const override = {
    display: "block",
    margin: "0 auto",
  };

   const fetchAppointments = async () => {
      try {
        const { data } = await axiosInstance.get("/appointment/doctor");
        setAppointments(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  // fetch doctor appointments
  useEffect(() => {
   
    fetchAppointments();
  }, []);

  // handle status change
  const handleStatusChange = (id, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [id]: { ...prev[id], newStatus: value, reason: "" },
    }));
  };

  // handle reason change
  const handleReasonChange = (id, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [id]: { ...prev[id], reason: value },
    }));
  };
  const timeStr = function formatTimeTo12Hour(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // convert 0 => 12
  minutes = minutes.toString().padStart(2, '0');

  return `${hours}:${minutes} ${ampm}`;
}


const datestr=(apptDate)=>{

const date = new Date(apptDate); 
  const dateStr = date.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
return dateStr
            }

  // submit modify request
  const handleSubmit = async (id, userId) => {
    const { newStatus, reason } = statusUpdates[id] || {};
    if (!newStatus) return alert("Please select a status first.");
    if (newStatus === "Cancelled" && !reason.trim())
      return alert("Reason is mandatory when cancelling!");
console.log(newStatus, reason, userId)
    setSubmitting(id);
    try {
      const { data } = await axiosInstance.put(`/appointment/modify/${id}`, {
        newStatus,
        reason,
        userId,
      });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? data.appointment : a))
      );
     
      toast.success("Appointment updated successfully ✅");
      fetchAppointments()
    } catch (err) {
      console.error(err);
      toast.error("Failed to update appointment ❌");
  
    } finally {
      setSubmitting(null);
    }
  };

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white p-5 rounded-2xl shadow animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );

  if (loading)
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
      {appointments.map((appt) => (
    
        <motion.div
          key={appt._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="shadow-lg rounded-2xl bg-white p-5 hover:shadow-2xl transition border border-gray-100">
            {/* User + Hospital Info */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User size={18} className="text-blue-500" />
                  {appt.user?.name || "Unknown User"}
                </h2>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={15} className="text-gray-400" />
                  {appt.hospital?.name || "N/A"} — {appt.hospital?.city || "N/A"}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appt.status === "Confirmed"
                    ? "bg-green-500 text-white"
                    : appt.status === "Cancelled"
                    ? "bg-red-500 text-white"
                    : appt.status === "Completed"
                    ? "bg-gray-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {appt.status}
              </span>
            </div>

            {/* Reason */}
            <p className="text-sm text-gray-700 mb-2">
              <b>Reason:</b> {appt.reason || "N/A"}
            </p>

            {/* Date + Time */}
            <div className="flex flex-wrap gap-7 mb-4">
              <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                <CalendarDays size={14} /> {datestr(appt.date)}
              </span>
              <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                <Clock size={14} /> {timeStr(new Date(appt.time))}
              </span>
               {appt.feedback &&(
              
                <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                 Feedback: {appt?.feedback?.comment}
              </span>
               
           
               )}

 {appt.feedback &&(
              
               <span className="flex items-center gap-1 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs">
                 Rating: {appt?.feedback?.rating}
              </span>
               
           
               )}





            </div>

       <div className="flex flex-wrap gap-7 mb-4">


 {appt.cancelReason &&(
              
               <span className="flex items-center gap-1 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs">
                 Cancellation Reason: {appt?.cancelReason
}
              </span>
               
           
               )}

       </div>


            {/* ✅ Sirf jab status Completed/Cancelled NAHI hai tabhi update options dikhana */}
            {appt.status =="Pending" && (
              <>
                <div className="mt-2">
                  <select
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                    value={statusUpdates[appt._id]?.newStatus || ""}
                  >
                    <option value="">Change Status</option>
                    <option value="Confirmed">Confirm</option>
                    <option value="Cancelled">Cancel</option>
                   
                  </select>
                </div>

                {/* Show reason input if cancelled */}
                {statusUpdates[appt._id]?.newStatus === "Cancelled" && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Enter reason for cancellation"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-400"
                      value={statusUpdates[appt._id]?.reason || ""}
                      onChange={(e) =>
                        handleReasonChange(appt._id, e.target.value)
                      }
                    />
                  </div>
                )}

                {/* Action button */}
                <div className="mt-4">
                  <button
                   className={
            submitting === appt._id
              ? "w-full py-2 bg-gradient-to-r from-green-100 to-teal-100 text-white font-medium rounded-lg shadow-md"
              : "w-full py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition-all"
          }
                    onClick={() => handleSubmit(appt._id, appt.user?._id)}
                    disabled={submitting === appt._id}
                  >
                    {submitting === appt._id ? (
                     <HashLoader color="teal" size={30} cssOverride={override} />
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ModifyAppointments;


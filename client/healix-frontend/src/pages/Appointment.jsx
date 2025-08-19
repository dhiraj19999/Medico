import React, { useState, useEffect } from "react";
import BookAppointment from "./BookAppointment.jsx";
import axiosInstance from "../api/Api";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CalendarDays, Clock, MapPin, Stethoscope } from "lucide-react";

const AppointmentsPage = () => {
  const [view, setView] = useState("book"); // book | list
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming"); // upcoming | past
  const [feedbacks, setFeedbacks] = useState({});


function calculateAverageRating(ratings) {
  if (!ratings.length) return 0;

  const filteredRatings = ratings.filter(r => r > 0);

  if (!filteredRatings.length) return 0;

  const sum = filteredRatings.reduce((acc, rating) => acc + rating, 0);
  const average = sum / filteredRatings.length;

  // agar integer hai to as it is, nahi to 1 decimal
  return Number.isInteger(average) ? average : parseFloat(average.toFixed(1));
}




const handleSubmitFeedback = async (appt) => {
  const data = feedbacks[appt._id];
  if(!data || !data.doctorRating || !data.feedbackRating) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const body = {
      doctorId: appt.doctor._id,
      appointmentId: appt._id,
      doctorRating: data.doctorRating,
      feedbackRating: data.feedbackRating,
      comment: data.comment || ""
    };
    const res = await axiosInstance.post("/feedback/add", body);
    toast.success("Feedback submitted successfully!");
    fetchAppointments();
    
    // Update appointment card locally
    setAppointments((prev) => prev.map(a => 
      a._id === appt._id ? { ...a, feedback: res.data } : a
    ));
  } catch (err) {
    console.error(err);
    toast.error("Failed to submit feedback");
  }
};



useEffect(() => {
    if (view === "list") {
      fetchAppointments();
    }
  }, [view]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/appointment/getappointments");
      setAppointments(res.data);
      console.log("appointment",res.data)
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
const filteredAppointments = appointments.filter(appt => {
  const apptDate = new Date(appt.date);
  const status = appt.status?.toLowerCase();

  if (tab === "upcoming") {
    return (
      apptDate >= now && 
      (status === "pending" || status === "confirmed")
    );
  } else {
    return (
      apptDate < now || 
      status === "completed" || 
      status === "cancelled"
    );
  }
});

  const AppointmentSkeleton = () => (
    <div className="animate-pulse bg-white p-4 rounded-2xl shadow-md mb-4">
      <div className="h-6 bg-gray-200 w-1/3 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 w-1/2 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
    </div>
  );

  function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-purple-500 text-white";
    case "confirmed":
      return "bg-green-500 text-white";
    case "completed":
      return "bg-teal-700 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
}



  return (
    <div className="pt-20 p-4 mt-4 mb-6">
      {/* Switcher */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setView("book")}
          className={`px-6 py-2 rounded-l-full ${
            view === "book" ? "bg-teal-500 text-white" : "bg-gray-200"
          } transition-all duration-300`}
        >
          Book Appointment
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-6 py-2 rounded-r-full ${
            view === "list" ? "bg-teal-500 text-white" : "bg-gray-200"
          } transition-all duration-300`}
        >
          My Appointments
        </button>
      </div>

      {/* Conditional View */}
      {view === "book" ? (
        <BookAppointment />
      ) : (
        <div>
          {/* Tabs for Upcoming / Past */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-4 py-2 rounded-l-full ${
                tab === "upcoming" ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTab("past")}
              className={`px-4 py-2 rounded-r-full ${
                tab === "past" ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Past
            </button>
          </div>

          {/* Appointment List */}
          {loading
            ? Array(4)
                .fill(0)
                .map((_, idx) => <AppointmentSkeleton key={idx} />)
            : filteredAppointments.length > 0
            ? filteredAppointments.map((appt,ind) => {
                const apptDate = new Date(appt.date);
                const dateStr = apptDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const timeStr = function formatTimeTo12Hour(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // convert 0 => 12
  minutes = minutes.toString().padStart(2, '0');

  return `${hours}:${minutes} ${ampm}`;
}

                return (
                  <motion.div
                    key={appt._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg p-5 mb-4 hover:shadow-xl transition-shadow"
                  >
                    {/* Doctor + Hospital Info */}
                    <div className="flex justify-between items-center border-b pb-3 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Stethoscope size={18} className="text-teal-600" />
                          {appt.doctor?.name || "Unknown Doctor"}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          {appt.hospital?.name || "Unknown Hospital"} —{" "}
                          {appt.hospital?.city || "City N/A"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getStatusColor(appt.status)
                        }`}
                      >
                        {appt.status || "Pending"}
                      </span>
                    </div>

                    {/* Date + Time */}
                    <div className="flex flex-wrap gap-4 mb-3">
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <CalendarDays size={16} /> {dateStr}
                      </span>
                      <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                        <Clock size={16} /> {timeStr(new Date(appt.time))}
                      </span>
                       <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Reason: {appt.reason}
                      </span>

                     {appt.cancelReason&&(
                      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                       Cancelled Reason : {appt.cancelReason}
                      </span>
                     )}

                    </div>

                    {/* Reason */}
                    


                   {tab === "past" && !appt.feedback && appt.
status=="Completed"
 ? (
  <div className="mt-3 border-t pt-3">
    <input
      type="number"
      placeholder="Doctor Rating (1-5)"
      value={feedbacks[appt._id]?.doctorRating || ""}
      onChange={(e) => setFeedbacks({
        ...feedbacks,
        [appt._id]: { 
          ...feedbacks[appt._id], 
          doctorRating: e.target.value 
        }
      })}
      className="border p-2 rounded w-24 mr-2"
      min={1}
      max={5}
    />
    <input
      type="number"
      placeholder="Feedback Rating (1-5)"
      value={feedbacks[appt._id]?.feedbackRating || ""}
      onChange={(e) => setFeedbacks({
        ...feedbacks,
        [appt._id]: { 
          ...feedbacks[appt._id], 
          feedbackRating: e.target.value 
        }
      })}
      className="border p-2 rounded w-24 mr-2"
      min={1}
      max={5}
    />
    <input
      type="text"
      placeholder="Comment"
      value={feedbacks[appt._id]?.comment || ""}
      onChange={(e) => setFeedbacks({
        ...feedbacks,
        [appt._id]: { 
          ...feedbacks[appt._id], 
          comment: e.target.value 
        }
      })}
      className="border p-2 rounded w-64 mr-2"
    />
    <button
      onClick={() => handleSubmitFeedback(appt)}
      className="bg-teal-500 text-white px-4 py-1 rounded"
    >
      Submit
    </button>
  </div>
) : appt.feedback ? (
  
  


 <div className="flex flex-wrap gap-4 mb-3">
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Doctor Avrage Rating: {calculateAverageRating(appt?.doctor.rating)}
                      </span>
                      <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                       Feedback Rating: {appt.feedback.rating}
                      </span>
                        <span className="flex items-center gap-1 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                       Comment: {appt.feedback.comment}
  </span>
                      
                  
                  
                    </div>


  
  
) : null}




                  </motion.div>
                );
              })
            : (
              <p className="text-center text-gray-500">No {tab} appointments</p>
            )}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;

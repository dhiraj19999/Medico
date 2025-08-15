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
    return tab === "upcoming" ? apptDate >= now : apptDate < now;
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
            ? filteredAppointments.map((appt) => {
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
                      <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <CalendarDays size={16} /> {dateStr}
                      </span>
                      <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                        <Clock size={16} /> {timeStr(new Date(appt.time))}
                      </span>
                    </div>

                    {/* Reason */}
                    <p className="text-gray-700 text-sm">
                        <span className=" items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm">
                      <span className="font-medium">Reason:</span>{" "}
                      {appt.reason || "No reason provided"} </span>
                    </p>
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

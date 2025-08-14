import React from 'react';
import { useEffect } from 'react';
import axiosInstance from "../api/Api";


const BookAppointment = () => {
 
 const [doctors, setDoctors] = React.useState([]);

  const getDoctors = async (lat, long) => {
    try {
      const response = await axiosInstance.get(`/doctor/nearbydoc?latitude=${lat}&longitude=${long}`);
      setDoctors(response.data);
      console.log("Nearby Doctors:", response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {

  navigator.geolocation.getCurrentPosition((position) => {
    const lat=position.coords.latitude;
    const long=position.coords.longitude;
  console.log("Latitude:", lat);
  console.log("Longitude:", long);
       getDoctors(lat, long);


  });
      

  }, []);


  return (
    <div>
      <h1>Book Appointment</h1>
    </div>
  );
};

export default BookAppointment;

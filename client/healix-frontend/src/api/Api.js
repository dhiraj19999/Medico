
import axios from "axios";



const axiosInstance = axios.create({
// baseURL: "https://medico-ha7q.onrender.com/api",
baseURL:"http://localhost:5000/api",
 // change to your backend API
  withCredentials: true, // 🧁 IMPORTANT: allows sending cookies
});

// Optional: interceptors for response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (unauthorized) globally
    if (error.response?.status === 401) {
      // Optional: auto logout
     // window.location.href = "/"
   

    }

    return Promise.reject(error);
  }
);

export default axiosInstance;



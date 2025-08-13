
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend API
  withCredentials: true, // 🧁 IMPORTANT: allows sending cookies
});

// Optional: interceptors for response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (unauthorized) globally
    if (error.response?.status === 401) {
      // Optional: auto logout
     // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

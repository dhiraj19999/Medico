
import axios from "axios";

//

const axiosInstance = axios.create({
 baseURL: "https://medico-ha7q.onrender.com/api",
//baseURL:"http://localhost:5000/api",

  withCredentials: true, // allows sending cookies
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
   
    if (error.response?.status === 401) {
     
   

    }

    return Promise.reject(error);
  }
);

export default axiosInstance;



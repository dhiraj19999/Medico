
import axios from "axios";

//

const axiosInstance = axios.create({
 baseURL: "https://medico-3-ifjq.onrender.com/api",
//baseURL:"http://localhost:5002/api",

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



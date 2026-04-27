import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // 🔥 FIXED
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
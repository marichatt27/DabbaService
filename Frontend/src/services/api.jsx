import axios from "axios";

const api = axios.create({
  baseURL: "https://dabbaservice.onrender.com/api",
  withCredentials: true,
});

// Add token automatically to every request
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;
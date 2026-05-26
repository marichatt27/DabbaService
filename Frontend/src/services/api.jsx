import axios from "axios";

const api = axios.create({
  baseURL: "https://dabbaservice.onrender.com/api",
  withCredentials: true,
});

export default api;
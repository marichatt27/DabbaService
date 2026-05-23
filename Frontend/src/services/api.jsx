import axios from "axios";

const api = axios.create({
  baseURL: "https://dabbaservice.onrender.com",
  withCredentials: true,
});

export default api;
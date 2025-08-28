import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL+ "/api",
  withCredentials: true, // important for cookie auth
});

export default api;

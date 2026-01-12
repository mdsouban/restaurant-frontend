import axios from "axios";

const api = axios.create({
  baseURL: "https://restaurant-backend-pos.onrender.com/api",
});

export default api;

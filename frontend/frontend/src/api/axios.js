import axios from "axios";

const API = axios.create({
  baseURL: "https://rentigo-vehicle-rental-system.onrender.com/api",
});

export default API;

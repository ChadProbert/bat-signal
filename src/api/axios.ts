import axios from "axios";

// Sets up the base URL + default headers for interacting with the API
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json", // Content type sent to the API
    Accept: "application/json", // Content type accepted from the API
  },
});

// Attaches the bearer token to every outgoing request to the API
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("bat_signal_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default instance;

import axios from "axios";

// baseURL: "http://localhost:8000", # for local

export const api = axios.create({
  baseURL: "https://at-backend-api.vercel.app",
  // baseURL: "http://localhost:8000", 
  withCredentials: true,
});

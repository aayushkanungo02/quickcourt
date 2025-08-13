import axios from "axios";
const base_Url =
  import.meta.env.MODE === "development" ? "http://localhost:4001/api" : "/api";
export const axiosInstance = axios.create({
  baseURL: base_Url,
  withCredentials: true, // Include credentials (cookies) in requests
});
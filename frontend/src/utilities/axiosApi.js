import axios from "axios";

let urlHost = "";

if (process.env.NODE_ENV === "development") {
  urlHost = "http://localhost:8000/";
}

if (process.env.NODE_ENV === "production") {
  urlHost = "";
}

const axiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:8000/",
  baseURL: urlHost,
  // timeout: 5000,
  headers: {
    HTTP_AUTHORIZATION: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
    accept: "application/json",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  },
});

export default axiosInstance;
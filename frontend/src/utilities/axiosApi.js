import axios from "axios";

const urlHost = process.env.REACT_APP_PROD_URL;

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

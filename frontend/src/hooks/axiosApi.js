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
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response.status === 401 &&
//       error.response.statusText === "Unauthorized"
//     ) {
//       const refresh_token = localStorage.getItem("refresh_token");

//       return axiosInstance
//         .post("/refresh-token", { refresh: refresh_token })
//         .then((response) => {
//           localStorage.setItem("access_token", response.data.access);
//           localStorage.setItem("refresh_token", response.data.refresh);

//           axiosInstance.defaults.headers["Authorization"] =
//             "Bearer " + response.data.access;
//           originalRequest.headers["Authorization"] =
//             "Bearer " + response.data.access;

//           return axiosInstance(originalRequest);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;

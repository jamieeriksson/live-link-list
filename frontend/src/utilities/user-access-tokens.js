import axiosInstance from "./axiosApi.js";

export default async function getUserAccessToken() {
  try {
    const response = await axiosInstance.post("/refresh-token", {
      refresh: localStorage.getItem("refresh_token"),
    });
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    return response.data.access;
  } catch (error) {
    if ("data" in error && error.data.detail === "Token is blacklisted")
      localStorage.clear();
    console.log(error);
    console.log(error.message);
    console.log(error.request);
    console.log(error.config);
    console.log(error.stack);
  }
}

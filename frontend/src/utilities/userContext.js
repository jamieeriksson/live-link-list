import React, { createContext, useEffect, useState } from "react";
import getUserAccessToken from "./user-access-tokens.js";
import axios from "axios";

export const UserContext = createContext();

export const getUserAccountData = async () => {
  const accessToken = await getUserAccessToken();

  try {
    const response = await axios.get(
      `http://localhost:8000/users/${localStorage.getItem("user")}`,
      {
        headers: {
          AUTHORIZATION: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          accept: "application/json",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.log(error.message);
    console.log(error.request);
    console.log(error.config);
    console.log(error.stack);
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    const today = new Date(Date.now());
    const expiration = new Date(localStorage.getItem("expiration"));

    if (today >= expiration) {
      localStorage.clear();
      setUser();
    } else {
      setUser(localStorage.getItem("user"));
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser({ ...getUserAccountData() });
    }

    return () => {};
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

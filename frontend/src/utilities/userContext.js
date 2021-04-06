import React, { createContext, useEffect, useState } from "react";
import getUserAccessToken from "./user-access-tokens.js";
import axios from "axios";

export const UserContext = createContext();

export const getUserAccountData = async () => {
  const accessToken = await getUserAccessToken();

  const urlHost = process.env.REACT_APP_PROD_URL;

  const url = new URL(`/users/${localStorage.getItem("user")}`, urlHost);

  try {
    const response = await axios.get(url, {
      headers: {
        AUTHORIZATION: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        accept: "application/json",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
    return response.data;
  } catch (error) {
    localStorage.clear();
    console.log(error);
    console.log(error.message);
    console.log(error.request);
    console.log(error.config);
    console.log(error.stack);
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ logged_in: false });
  const user_id = localStorage.getItem("user");

  const setUserData = async () => {
    if (user_id) {
      const user_data = await getUserAccountData();
      if (user_data) {
        setUser({ ...user_data, logged_in: true });
      } else {
        setUser({ logged_in: false });
      }
    } else {
      setUser({ logged_in: false });
    }
  };

  useEffect(() => {
    const today = new Date(Date.now());
    const expiration = new Date(localStorage.getItem("expiration"));

    if (today >= expiration) {
      localStorage.clear();
      setUser({ logged_in: false });
    } else {
      setUserData();
    }

    return () => {};
  }, []);

  useEffect(() => {
    setUserData();
    window.addEventListener("storage", setUserData);

    return () => {
      window.removeEventListener("storage", setUserData);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

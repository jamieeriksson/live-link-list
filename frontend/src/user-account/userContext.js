import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

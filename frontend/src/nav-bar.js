import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import logo from "./assets/logo.svg";
import { UserContext } from "./user-account/userContext";

export default function NavBar() {
  // const [user, setUser] = useState();
  let user = useContext(UserContext);

  const { pathname } = useLocation();

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem("user");

  //   if (loggedInUser) {
  //     console.log(loggedInUser);
  //     setUser(loggedInUser);
  //   }
  // }, []);

  const handleLogout = async (e) => {
    e.preventDefault();

    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const url = new URL("/log-out", urlHost);

    try {
      const response = await axios.post(url, {
        refresh: localStorage.getItem("refresh_token"),
      });

      console.log(response.data);
      user.setUser();
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="z-50 max-w-screen w-full h-36 px-10 pt-1 pb-8 flex flex-col place-items-center">
      <div className="h-8 w-full flex place-items-center">
        <img src={logo} alt="live link list logo" className="w-auto h-7" />
        <div className="flex-grow"></div>
        {user.user ? (
          <div></div>
        ) : (
          <Link
            to="/register"
            className="font-body uppercase text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline"
          >
            Sign Up
          </Link>
        )}
        {user.user ? (
          <div>
            <Link
              to="/account"
              className="ml-6 font-body uppercase text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline"
            >
              Account
            </Link>
            <Link
              to="/user-lives"
              className="ml-6 font-body uppercase text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline"
            >
              Your Lives
            </Link>
            <button
              onClick={handleLogout}
              className="ml-6 font-body uppercase text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline focus:outline-none"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="ml-6 font-body uppercase text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline"
          >
            Login
          </Link>
        )}
      </div>
      <div className="flex-grow"></div>
      <div className="flex uppercase font-body text-gray-500 text-lg">
        <Link
          to="/"
          className={`mx-4 md:mx-8 my-1 border-b border-transparent text-center ${
            pathname === "/"
              ? "font-semibold text-gray-900 border-gray-800"
              : ""
          }`}
        >
          Post a live
        </Link>
        <Link
          to="/browse"
          className={`mx-4 md:mx-8 my-1 border-b border-transparent text-center ${
            pathname === "/browse"
              ? "font-semibold text-gray-900 border-gray-800"
              : ""
          }`}
        >
          Browse Lives
        </Link>
      </div>
    </div>
  );
}

import { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import logo from "./assets/logo.svg";
import useOutsideAlerter from "./utilities/outside-alerter.js";
import { UserContext } from "./utilities/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCircle,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleRegular } from "@fortawesome/free-regular-svg-icons";

export default function NavBar() {
  let user = useContext(UserContext);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const outsideClickRef = useRef(null);

  useOutsideAlerter(outsideClickRef, () => {
    setMenuIsOpen(false);
  });

  const { pathname } = useLocation();

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

      user.setUser();
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="z-50 max-w-screen w-full h-36 px-10 pt-1 pb-8 flex flex-col place-items-center">
      <div ref={outsideClickRef} className="h-8 w-full flex place-items-center">
        <img src={logo} alt="live link list logo" className="w-auto h-7" />
        <div className="flex-grow"></div>
        <div
          onClick={() => setMenuIsOpen(!menuIsOpen)}
          className="md:hidden flex place-items-center"
        >
          <div className="block fa-layers fa-fw text-sm">
            <FontAwesomeIcon icon={faUserCircle} size="2x" color="#666666" />
            <FontAwesomeIcon icon={faCircleRegular} size="2x" color="#444444" />
          </div>
          <div className="ml-5 text-sm">
            <FontAwesomeIcon icon={faCaretDown} color="#444444" />
          </div>
        </div>
        {user.user ? (
          <div
            className={`${
              menuIsOpen ? "flex" : "hidden md:flex"
            } absolute inset-0 mt-10 h-36 md:static md:mt-0 md:h-full flex-col place-items-center justify-center md:justify-end md:flex-row w-full bg-gray-100 md:bg-transparent border md:border-0 shadow-lg md:shadow-none`}
          >
            <Link
              onClick={() => setMenuIsOpen(false)}
              to="/account"
              className="my-2 md:ml-6 font-body uppercase text-lg md:text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline"
            >
              Account
            </Link>
            <Link
              onClick={() => setMenuIsOpen(false)}
              to="/user-lives"
              className="my-2 md:ml-6 font-body uppercase text-lg md:text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline"
            >
              Your Lives
            </Link>
            <button
              onClick={handleLogout}
              className="my-2 md:ml-6 font-body uppercase text-lg md:text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline focus:outline-none"
            >
              Logout
            </button>
          </div>
        ) : (
          <div
            className={`${
              menuIsOpen ? "flex" : "hidden md:flex"
            } absolute inset-0 mt-10 h-28 md:static md:mt-0 md:h-full flex-col place-items-center justify-center md:justify-end md:flex-row w-full bg-gray-100 md:bg-transparent border md:border-0 shadow-lg md:shadow-none`}
          >
            <Link
              onClick={() => setMenuIsOpen(false)}
              to="/register"
              className="my-2 font-body uppercase text-lg md:text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline"
            >
              Sign Up
            </Link>
            <Link
              onClick={() => setMenuIsOpen(false)}
              to="/login"
              className="my-2 md:ml-6 font-body uppercase text-lg md:text-sm tracking-wide text-gray-600 hover:text-gray-800 hover:underline"
            >
              Login
            </Link>
          </div>
        )}
        {/* </div> */}
      </div>
      <div className="flex-grow"></div>
      <div className="flex uppercase font-body text-gray-500 text-lg">
        <Link
          onClick={() => setMenuIsOpen(false)}
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
          onClick={() => setMenuIsOpen(false)}
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

import { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { UserContext } from "../utilities/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loggingIn, setLoggingIn] = useState(false);

  let user = useContext(UserContext);

  const history = useHistory();

  const loginUser = async () => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const url = new URL("/log-in", urlHost);

    try {
      const response = await axios.post(url, {
        email: email,
        password: password,
      });

      const date = Date.now();
      const expiration = new Date(date);
      expiration.setDate(expiration.getDate() + 14);

      localStorage.setItem("refresh_token", response.data["refresh"]);
      localStorage.setItem("access_token", response.data["access"]);
      localStorage.setItem("user", response.data["user"].id);
      localStorage.setItem("expiration", expiration);

      window.location.href = "/";
    } catch (error) {
      setErrors({
        login:
          "Account not found. Check that your email and password are correct.",
        ...errors,
      });
      setLoggingIn(false);

      console.log(error.response.data);
      console.log(error.response.data["detail"]);
      console.log(error.response.data.detail);
      console.log(error);
      console.log(error.message);
      console.log(error.request);
      console.log(error.config);
      console.log(error.stack);
    }
  };

  const handleLogin = async () => {
    setErrors({});
    let errors = {};

    if (!email) {
      errors = {
        email: "You must enter an email.",
        ...errors,
      };
    }

    if (!password) {
      errors = {
        password: "You must enter a password.",
        ...errors,
      };
    }

    if (Object.keys(errors).length === 0) {
      await loginUser();
    } else {
      setErrors({ ...errors });
      window.scrollTo(0, 0);
      setLoggingIn(false);
    }
  };

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
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };

  if (user.user) {
    return (
      <div
        className={`max-w-screen w-full min-h-screen md:mt-5 px-4 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
      >
        <div className="h-36 w-full hidden md:static"></div>

        <div
          className={`max-w-xl w-full mx-3 my-3 pb-14 pt-14 px-3 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
        >
          <h1 className="w-full text-center font-title tracking-wider text-2xl md:text-3xl">
            You are already logged in.
          </h1>
          <p
            onClick={handleLogout}
            className="mt-5 cursor-pointer text-primary-blue hover:underline"
          >
            Logout to switch accounts
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`max-w-screen w-full md:min-h-screen md:mt-5 px-4 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
      >
        {/* <div className="h-36 w-full"></div> */}

        <div
          className={`max-w-lg w-full mx-3 my-3 pb-14 pt-14 px-3 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
        >
          <h1 className="w-full mb-10 text-center font-title tracking-wider text-2xl md:text-3xl">
            Login
          </h1>
          <form className="max-w-xs w-full flex flex-col">
            <div className="mb-5 flex flex-col">
              <input
                type="text"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
              />
              {"email" in errors ? (
                <p className="ml-2 mt-1 text-sm font-body text-red-500">
                  {errors.email}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="mb-5 flex flex-col">
              <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
              />
              {"password" in errors ? (
                <p className="ml-2 mt-1 text-sm font-body text-red-500">
                  {errors.password}
                </p>
              ) : (
                ""
              )}
            </div>
            {"login" in errors ? (
              <p className="self-center text-center text-sm font-body text-red-500">
                {errors.login}
              </p>
            ) : (
              ""
            )}
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setLoggingIn(true);
                handleLogin();
              }}
              className="mt-5 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
                {loggingIn ? (
                  <FontAwesomeIcon icon={faSpinner} size="2x" spin />
                ) : (
                  "Login"
                )}
              </span>
            </button>
            <p className="mt-4 self-center text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="ml-1 text-blue-800 hover:text-blue-700 hover:underline"
              >
                Sign up here
              </a>
            </p>
            <a
              href="/forgot-password"
              className="mt-1 self-center text-sm text-blue-800 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </a>
          </form>
        </div>
      </div>
    );
  }
}

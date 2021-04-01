import { useState, useEffect, useContext } from "react";
import { UserContext } from "../utilities/userContext";
import axios from "axios";
import queryString from "query-string";

export default function PasswordResetConfirmed() {
  let user = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  useEffect(() => {
    if (window.location.search) {
      const queryToken = queryString.parse(window.location.search);
      setQuery(queryToken);
    }
    return () => {};
  }, []);

  const resetPassword = async () => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const url = new URL("/password-reset-confirmed", urlHost);

    try {
      const response = await axios.post(url, {
        email: email,
        password: password,
        token: query.token,
      });
      console.log(response);
    } catch (error) {
      if (error.response.data) {
        let errorObj = {};

        for (const [key, value] of Object.entries(error.response.data)) {
          errorObj[key] = value[0];
        }
        setErrors({ ...errorObj });
        window.scrollTo(0, 0);
      }

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

      setResetComplete(true);
    } catch (error) {
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

  const handleReset = async () => {
    let newErrors = {};

    if (!email) {
      newErrors = {
        email: "You must enter an email.",
        ...newErrors,
      };
    }

    if (!password) {
      newErrors = {
        password: "Enter a password.",
        ...newErrors,
      };
    }

    if (!passwordConfirm) {
      newErrors = {
        passwordConfirm: "Confirm your password.",
        ...newErrors,
      };
    } else if (password !== passwordConfirm) {
      newErrors = {
        passwordConfirm: "Passwords do not match.",
        ...newErrors,
      };
    }

    if (Object.keys(newErrors).length === 0) {
      await resetPassword();
      loginUser();
    } else {
      setErrors({ ...newErrors });
      window.scrollTo(0, 0);
    }
  };
  return (
    <div
      className={`max-w-screen w-full min-h-screen md:mt-5 px-1 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
    >
      <div
        className={`max-w-lg w-full mx-3 my-3 pb-14 pt-14 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
      >
        <h1 className="w-full mb-10 text-center font-title tracking-wider text-2xl md:text-3xl">
          Reset Password
        </h1>
        {resetComplete ? (
          <div className="flex flex-col justify-center place-items-center">
            <p className="text-center font-title font-light tracking-wider text-lg">
              Your password is reset!
            </p>
            {/* <button
              onClick={(e) => {
                setPasswordChangeIsOpen(false);
              }}
              className="mt-8 mx-3 px-3 py-1.5 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-gray-100">
                Close
              </span>
            </button> */}
          </div>
        ) : (
          <form className="w-full px-10 flex flex-col">
            <div className="mb-5 self-start w-full">
              <div className="flex place-items-center">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Email
                  <span className="ml-0.5 text-primary-red text-base">*</span>
                </p>
                <input
                  type="text"
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
              </div>
              <p className="mt-1 text-right text-sm font-body text-red-500">
                {errors.email}
              </p>
            </div>

            <div className="mb-5 self-start w-full">
              <div className="flex place-items-center">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  New Password
                  <span className="ml-0.5 text-primary-red text-base">*</span>
                </p>
                <input
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
              </div>
              <p className="mt-1 text-right text-sm font-body text-red-500">
                {errors.password}
              </p>
            </div>
            <div className="mb-5 self-start w-full">
              <div className="flex place-items-center">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Confirm Password
                  <span className="ml-0.5 text-primary-red text-base">*</span>
                </p>
                <input
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
              </div>
              <p className="mt-1 text-right text-sm font-body text-red-500">
                {errors.passwordConfirm}
              </p>
            </div>

            {"detail" in errors ? (
              <p className="self-center text-center text-sm font-body text-red-500">
                {errors.detail}
              </p>
            ) : (
              ""
            )}

            {"token" in errors ? (
              <p className="self-center text-center text-sm font-body text-red-500">
                {errors.detail}
              </p>
            ) : (
              ""
            )}

            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setErrors({});
                handleReset();
              }}
              className="self-center mt-5 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
                Reset Password
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

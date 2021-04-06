import { useState, useEffect, useContext } from "react";
import { getUserAccountData, UserContext } from "../utilities/userContext";
import axios from "axios";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import getUserAccessToken from "../utilities/user-access-tokens.js";
import LoginPage from "./login.js";

export default function ConfirmEmail() {
  let user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (window.location.search) {
      const queryToken = queryString.parse(window.location.search);
      setQuery(queryToken);
    }
    return () => {};
  }, []);

  useEffect(() => {
    if (
      user.user &&
      user.user.email &&
      !user.user.email_confirmed &&
      query.token &&
      Object.keys(errors).length === 0
    ) {
      handleConfirm();
    } else {
      setLoading(false);
    }
  }, [user, query]);

  const sendConfirmEmail = async () => {
    if (user.user.email) {
      const urlHost = process.env.REACT_APP_PROD_URL;

      const url = new URL("/send-confirm-email", urlHost);

      try {
        const response = await axios.post(url, {
          email: user.user.user.email,
        });

        alert("New confirmation email sent!");
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
    } else {
      setErrors({ detail: "No user email found. Try logging in again." });
    }
  };

  const confirmEmail = async (accessToken) => {
    const urlHost = process.env.REACT_APP_PROD_URL;

    const url = new URL("/confirm-email", urlHost);

    try {
      const response = await axios.post(
        url,
        {
          email: user.user.email,
          token: query.token,
        },
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
      console.log(response);
      user.setUser({ ...user.user, email_confirmed: true, logged_in: true });
    } catch (error) {
      if (error.response.data) {
        let errorObj = {};

        for (const [key, value] of Object.entries(error.response.data)) {
          errorObj[key] = value;
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

  const handleConfirm = async () => {
    if (user.user.email && query.token) {
      console.log("handle confirm");
      const accessToken = await getUserAccessToken();
      console.log("got tokens");
      await confirmEmail(accessToken);
      console.log("confirmed");
    }
    setLoading(false);
  };

  if (user.user && !user.user["logged_in"]) {
    return <LoginPage />;
  }
  return (
    <div
      className={`max-w-screen w-full min-h-screen md:mt-5 px-1 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
    >
      <div
        className={`max-w-lg w-full mx-3 my-3 pb-14 pt-14 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
      >
        <h1 className="w-full mb-10 text-center font-title tracking-wider text-2xl md:text-3xl">
          Confirm Email
        </h1>

        {loading ? <FontAwesomeIcon icon={faSpinner} size="2x" spin /> : ""}

        {"detail" in errors ? (
          <div>
            <p className="self-center text-center text-sm font-body text-red-500">
              {errors.detail}
            </p>
            <button
              onClick={async (e) => {
                e.preventDefault();
                sendConfirmEmail();
              }}
              className="ml-1 underline text-primary-blue focus:outline-none"
            >
              Resend confirmation email
            </button>
          </div>
        ) : (
          <p className="text-center font-title font-light tracking-wider text-lg">
            Your email has been confirmed!
          </p>
        )}
      </div>
    </div>
  );
}

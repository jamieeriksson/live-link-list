import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext.js";
import axiosInstance from "../../utilities/axiosApi.js";
import EditLive from "./user-individual-live.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import getUserAccessToken from "../../utilities/user-access-tokens.js";

function UserLives(props) {
  const userData = props.userData;

  if ("lives" in userData) {
    return (
      <div>
        {userData.lives.map((live) => (
          <EditLive live={live} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center place-items-center">
        <p className="mb-6 text-lg font-body tracking-wide text-center">
          You have not posted any lives.
        </p>
        <div>
          <Link
            to="/"
            className="px-3 py-1.5 rounded-md bg-primary-blue text-lg text-gray-100 font-semibold uppercase tracking-wide hover:shadow-md"
          >
            Post a live
          </Link>
        </div>
      </div>
    );
  }
}

export default function UserLivesPage() {
  let user = useContext(UserContext);

  const [userData, setUserData] = useState();
  const [error, setError] = useState("");

  const getUserAccountData = async () => {
    if (user.user) {
      const accessToken = await getUserAccessToken();

      try {
        const response = await axios.get(
          `http://localhost:8000/users/${localStorage.getItem("user")}`,
          {
            headers: {
              AUTHORIZATION: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              accept: "application/json",
              "Access-Control-Allow-Methods":
                "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
            },
          }
        );
        setUserData({ ...response.data });
      } catch (error) {
        console.log(error);
        console.log(error.message);
        console.log(error.request);
        console.log(error.config);
        console.log(error.stack);
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    getUserAccountData();

    return () => {};
  }, [user]);

  if (!user.user) {
    return (
      <div
        className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-blue-300 to-gray-50`}
      >
        <div
          className={`max-w-3xl w-full mx-3 my-3 pb-9 flex flex-col justify-center place-items-center shadow-md rounded-lg md:rounded-2xl bg-gray-100`}
        >
          <h1 className="w-full mb-7 pb-7 pt-7 px-3 bg-gray-700 rounded-t-lg md:rounded-t-2xl text-gray-100 text-center font-title tracking-wider text-2xl md:text-3xl shadow-md">
            Your Account
          </h1>
          <p className="my-8 text-body text-xl leading-relaxed text-center text-gray-700">
            You are not logged in.
            <br />
            To view your lives or account details{" "}
            <Link to="/login" className="ml-1 text-blue-500 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    );
  } else if (error) {
    return (
      <div
        className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-pink-200 to-gray-50`}
      >
        <div
          className={`max-w-3xl w-full mx-3 my-3 pb-9 flex flex-col justify-center place-items-center shadow-md rounded-lg md:rounded-2xl bg-gray-100`}
        >
          <h1 className="w-full mb-12 pb-7 pt-7 px-3 bg-gray-700 rounded-t-lg md:rounded-t-2xl text-gray-100 text-center font-title tracking-wider text-2xl md:text-3xl shadow-md">
            Your Lives
          </h1>
          <p className="mb-6 text-lg font-body tracking-wide text-center">
            There was an error getting your posted lives: {error}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-pink-200 to-gray-50`}
    >
      <div
        className={`max-w-3xl w-full mx-3 my-3 pb-9 flex flex-col justify-center place-items-center shadow-md rounded-lg md:rounded-2xl bg-gray-100`}
      >
        <h1 className="w-full mb-12 pb-7 pt-7 px-3 bg-gray-700 rounded-t-lg md:rounded-t-2xl text-gray-100 text-center font-title tracking-wider text-2xl md:text-3xl shadow-md">
          Your Lives
        </h1>
        {userData ? (
          <UserLives userData={userData} />
        ) : (
          <FontAwesomeIcon icon={faSpinner} size="2x" spin />
        )}
      </div>
    </div>
  );
}

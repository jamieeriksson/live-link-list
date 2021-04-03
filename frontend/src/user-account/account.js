import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../utilities/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import getUserAccessToken from "../utilities/user-access-tokens.js";
import EditAccountInfo from "./edit-account/edit-account.js";

function AccountInfo(props) {
  const userData = props.userData;
  const setEditAccount = props.setEditAccount;

  return (
    <div className="px-5">
      {userData ? (
        <div className="mb-5">
          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              First Name:
            </p>
            <span>{userData.first_name}</span>
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              Last Name:
            </p>
            <span>{userData.last_name}</span>
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              Email:
            </p>
            <span>{userData.email}</span>
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              Phone Number:
            </p>

            {userData.phone_number ? (
              <span>{userData.phone_number}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>

          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              TikTok Username:
            </p>

            {userData.tiktok_username ? (
              <span>{userData.tiktok_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              Instagram Username:
            </p>

            {userData.instagram_username ? (
              <span>{userData.instagram_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              Youtube Username:
            </p>

            {userData.youtube_username ? (
              <span>{userData.youtube_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              Facebook Username:
            </p>

            {userData.facebook_username ? (
              <span>{userData.facebook_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              Twitch Username:
            </p>

            {userData.twitch_username ? (
              <span>{userData.twitch_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-1 md:mr-6 font-semibold">
              Credits:
            </p>
            <span>{userData.credits}</span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={(e) => {
                setEditAccount(true);
              }}
              className="mt-10 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-gray-100">
                Edit Account
              </span>
            </button>
          </div>
        </div>
      ) : (
        <FontAwesomeIcon icon={faSpinner} size="2x" spin />
      )}
    </div>
  );
}

export default function UserAccountPage() {
  let user = useContext(UserContext);

  const [userData, setUserData] = useState();
  const [editAccount, setEditAccount] = useState(false);

  const getUserAccountData = async () => {
    if (user.user && user.user["logged_in"]) {
      const accessToken = await getUserAccessToken();

      try {
        const getResponse = await axios.get(
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
        setUserData({ ...getResponse.data });
      } catch (error) {
        console.log(error);
        console.log(error.message);
        console.log(error.request);
        console.log(error.config);
        console.log(error.stack);
      }
    }
  };

  useEffect(() => {
    getUserAccountData();

    return () => {};
  }, [user]);

  if (user.user && !user.user["logged_in"]) {
    return (
      <div
        className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-blue-300 to-gray-50`}
      >
        <div
          className={`max-w-3xl w-full mx-3 my-3 pb-9 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100`}
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
  }

  return (
    <div
      className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-4 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-blue-300 to-gray-50`}
    >
      <div
        className={`max-w-3xl w-full my-3 pb-9 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100`}
      >
        <h1 className="w-full mb-12 pb-7 pt-7 px-3 bg-gray-700 rounded-t-lg md:rounded-t-2xl text-gray-100 text-center font-title tracking-wider text-2xl md:text-3xl shadow-md">
          Your Account
        </h1>
        {editAccount ? (
          <EditAccountInfo
            userData={userData}
            setUserData={setUserData}
            setEditAccount={setEditAccount}
          />
        ) : (
          <AccountInfo setEditAccount={setEditAccount} userData={userData} />
        )}
      </div>
    </div>
  );
}

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../utilities/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import getUserAccessToken from "../utilities/user-access-tokens.js";

function EditAccountInfo(props) {
  const userData = props.userData;
  const setUserData = props.setUserData;
  const setEditAccount = props.setEditAccount;

  const [firstName, setFirstName] = useState(userData.first_name);
  const [lastName, setLastName] = useState(userData.last_name);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone_number);
  const [tikTok, setTikTok] = useState(userData.tiktok_username);
  const [instagram, setInstagram] = useState(userData.instagram_username);
  const [youtube, setYoutube] = useState(userData.youtube_username);
  const [facebook, setFacebook] = useState(userData.facebook_username);
  const [twitch, setTwitch] = useState(userData.twitch_username);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});

  const updateUser = async (accessToken) => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const updateUserUrl = new URL(
      `/users/${localStorage.getItem("user")}`,
      urlHost
    );

    try {
      const response = await axios.patch(
        updateUserUrl,
        {
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
          email: email,
          tiktok_username: tikTok,
          instagram_username: instagram,
          youtube_username: youtube,
          facebook_username: facebook,
          twitch_username: twitch,
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

      setUserData({ ...response.data });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    let errors = {};

    if (!firstName) {
      errors = {
        firstName: "Enter a first name.",
        ...errors,
      };
    }

    if (!lastName) {
      errors = {
        lastName: "Enter a last name.",
        ...errors,
      };
    }

    if (!email) {
      errors = {
        email: "Enter an email.",
        ...errors,
      };
    }

    // if (!password) {
    //   errors = {
    //     password: "Enter a password.",
    //     ...errors,
    //   };
    // }

    // if (!passwordConfirm) {
    //   errors = {
    //     passwordConfirm: "Confirm your password.",
    //     ...errors,
    //   };
    // } else if (password !== passwordConfirm)
    //   errors = {
    //     passwordConfirm: "Passwords do not match.",
    //     ...errors,
    //   };

    if (Object.keys(errors).length === 0) {
      const accessToken = await getUserAccessToken();
      await updateUser(accessToken);
      setEditAccount(false);
    } else {
      setErrors({ ...errors });
      window.scrollTo(0, 0);
    }
  };

  return (
    <form className="mb-5">
      <div className="mb-3">
        <p className="inline-block w-40 mr-6 font-semibold">
          First Name:
          <span className="ml-0.5 text-primary-red text-base">*</span>
        </p>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
        <p className="mt-1 text-right text-sm font-body text-red-500">
          {errors.firstName}
        </p>
      </div>
      <div className="mb-3">
        <p className="inline-block w-40 mr-6 font-semibold">
          Last Name:
          <span className="ml-0.5 text-primary-red text-base">*</span>
        </p>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
        <p className="mt-1 text-right text-sm font-body text-red-500">
          {errors.lastName}
        </p>
      </div>
      <div className="mb-3">
        <p className="inline-block w-40 mr-6 font-semibold">
          Email:<span className="ml-0.5 text-primary-red text-base">*</span>
        </p>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
        <p className="mt-1 text-right text-sm font-body text-red-500">
          {errors.email}
        </p>
      </div>
      <div className="mb-3">
        <p className="inline-block w-40 mr-6 font-semibold">Phone Number:</p>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
      </div>

      <div className="mb-3">
        <p className="inline-block w-40 mr-6 font-semibold">TikTok Username:</p>

        <input
          type="text"
          value={tikTok}
          onChange={(e) => setTikTok(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
      </div>
      <div className="mb-3">
        <p className="inline-block w-40 mr-6 font-semibold">
          Instagram Username:
        </p>

        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
      </div>
      <div className="mb-3">
        <p className="inline-block w-40 mr-6 font-semibold">
          Youtube Username:
        </p>

        <input
          type="text"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
      </div>
      <div className="mb-3">
        <p className="inline-block w-40 mr-6 font-semibold">
          Facebook Username:
        </p>

        <input
          type="text"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
      </div>
      <div className="mb-3">
        <p className="inline-block w-40 mr-6 font-semibold">Twitch Username:</p>

        <input
          type="text"
          value={twitch}
          onChange={(e) => setTwitch(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={(e) => {
            setEditAccount(false);
          }}
          className="mt-10 mx-3 px-3 py-1.5 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none"
        >
          <span className="uppercase font-semibold font-title tracking-widest text-gray-100">
            Cancel
          </span>
        </button>

        <button
          onClick={handleSubmit}
          className="mt-10 mx-3 px-3 py-1.5 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
        >
          <span className="uppercase font-semibold font-title tracking-widest text-gray-100">
            Save Changes
          </span>
        </button>
      </div>
    </form>
  );
}

function AccountInfo(props) {
  const userData = props.userData;
  const setEditAccount = props.setEditAccount;

  return (
    <div>
      {userData ? (
        <div className="mb-5">
          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">First Name:</p>
            <span className>{userData.first_name}</span>
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">Last Name:</p>
            <span className>{userData.last_name}</span>
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">Email:</p>
            <span className>{userData.email}</span>
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">
              Phone Number:
            </p>

            {userData.phone_number ? (
              <span className>{userData.phone_number}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>

          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">
              TikTok Username:
            </p>

            {userData.tiktok_username ? (
              <span className>{userData.tiktok_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">
              Instagram Username:
            </p>

            {userData.instagram_username ? (
              <span className>{userData.instagram_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">
              Youtube Username:
            </p>

            {userData.youtube_username ? (
              <span className>{userData.youtube_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">
              Facebook Username:
            </p>

            {userData.facebook_username ? (
              <span className>{userData.facebook_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">
              Twitch Username:
            </p>

            {userData.twitch_username ? (
              <span className>{userData.twitch_username}</span>
            ) : (
              <span className="text-gray-600">none</span>
            )}
          </div>
          <div className="mb-3">
            <p className="inline-block w-40 mr-6 font-semibold">Credits:</p>
            <span className>{userData.credits}</span>
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
    if (user.user) {
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

  if (!user.user) {
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
      className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-blue-300 to-gray-50`}
    >
      <div
        className={`max-w-3xl w-full mx-3 my-3 pb-9 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100`}
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

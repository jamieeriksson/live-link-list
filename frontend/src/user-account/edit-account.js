import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import getUserAccessToken from "../utilities/user-access-tokens.js";

function ChangePasswordModal(props) {
  const email = props.email;
  const passwordChangeIsOpen = props.passwordChangeIsOpen;
  const setPasswordChangeIsOpen = props.setPasswordChangeIsOpen;

  const [emailSent, setEmailSent] = useState(false);

  const sendEmail = async () => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const url = new URL("/password-reset", urlHost);

    try {
      const response = await axios.post(url, {
        email: email,
      });
      setEmailSent(true);
    } catch (error) {
      console.log(error.response.data);
      console.log(error);
      console.log(error.message);
      console.log(error.request);
      console.log(error.config);
      console.log(error.stack);
    }
  };

  return (
    <div
      className={`z-50 fixed ${
        passwordChangeIsOpen ? "" : "hidden"
      } inset-0 w-screen h-screen blur-lg flex justify-center place-items-center`}
    >
      <div
        className={`max-w-lg w-full mx-3 my-3 pb-14 pt-14 px-8 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
      >
        <h1 className="w-full mb-10 text-center font-title tracking-wider text-2xl md:text-3xl">
          Change Password
        </h1>
        {emailSent ? (
          <div className="flex flex-col justify-center place-items-center">
            <p className="text-center font-title font-light tracking-wider text-lg">
              A reset password link was sent to the email associated with your
              user account.
            </p>
            <button
              onClick={(e) => {
                setPasswordChangeIsOpen(false);
              }}
              className="mt-8 mx-3 px-3 py-1.5 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-gray-100">
                Close
              </span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-center place-items-center">
            <p className="text-center font-title font-light tracking-wider text-lg">
              We will send a link to your email to reset your password.
            </p>

            <div className="flex justify-center">
              <button
                onClick={(e) => {
                  setPasswordChangeIsOpen(false);
                }}
                className="mt-10 mx-3 px-3 py-1.5 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none"
              >
                <span className="uppercase font-semibold font-title tracking-widest text-gray-100">
                  Cancel
                </span>
              </button>
              <button
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  await sendEmail();
                }}
                className="mt-10 mx-3 px-3 py-1.5  ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
              >
                <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
                  Send Email
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditAccountInfo(props) {
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
  const [passwordChangeIsOpen, setPasswordChangeIsOpen] = useState(false);
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
    <form className="px-3 mb-5 flex flex-col justify-center place-items-center md:block">
      <div className="mb-3">
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
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
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
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
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
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
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
          Phone Number:
        </p>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
      </div>

      <div className="mb-3">
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
          TikTok Username:
        </p>

        <input
          type="text"
          value={tikTok}
          onChange={(e) => setTikTok(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
      </div>
      <div className="mb-3">
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
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
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
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
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
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
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
          Twitch Username:
        </p>

        <input
          type="text"
          value={twitch}
          onChange={(e) => setTwitch(e.target.value)}
          className="py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
        />
      </div>

      <div className="mb-3 mt-5">
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
          Password:
        </p>
        <p
          onClick={() => setPasswordChangeIsOpen(true)}
          className="cursor-pointer inline-block text-primary-blue hover:underline"
        >
          Change password
        </p>
      </div>
      <ChangePasswordModal
        email={userData.email}
        passwordChangeIsOpen={passwordChangeIsOpen}
        setPasswordChangeIsOpen={setPasswordChangeIsOpen}
      />

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

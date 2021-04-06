import React, { useState } from "react";
import axios from "axios";
import getUserAccessToken from "../../utilities/user-access-tokens.js";
import ChangePasswordModal from "./change-password.js";
import ChangeEmailModal from "./change-email-modal.js";
import DeleteAccountModal from "./delete-account-modal.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

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
  const [emailChangeIsOpen, setEmailChangeIsOpen] = useState(false);
  const [deleteAccountIsOpen, setDeleteAccountIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const updateUser = async (accessToken) => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = process.env.REACT_APP_PROD_URL;
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

      <div className="mt-8">
        <p className="md:inline-block w-40 mr-1 md:mr-6 font-semibold">
          Email:
        </p>
        <p
          onClick={() => setEmailChangeIsOpen(true)}
          className="cursor-pointer inline-block text-primary-blue hover:underline"
        >
          Change email
        </p>
      </div>
      <ChangeEmailModal
        email={email}
        setEmail={setEmail}
        emailChangeIsOpen={emailChangeIsOpen}
        setEmailChangeIsOpen={setEmailChangeIsOpen}
        setUserData={setUserData}
        userData={userData}
      />

      <div className="mt-3">
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
        email={email}
        passwordChangeIsOpen={passwordChangeIsOpen}
        setPasswordChangeIsOpen={setPasswordChangeIsOpen}
      />

      <div className="mb-3 mt-3">
        <p className="md:inline-block w-40 mr-1 md:mr-6"></p>
        <p
          onClick={() => setDeleteAccountIsOpen(true)}
          className="cursor-pointer inline-block text-primary-red hover:underline"
        >
          Delete Account
        </p>
      </div>
      <DeleteAccountModal
        userId={userData.id}
        deleteAccountIsOpen={deleteAccountIsOpen}
        setDeleteAccountIsOpen={setDeleteAccountIsOpen}
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

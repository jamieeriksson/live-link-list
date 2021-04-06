import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../utilities/userContext";
import getUserAccessToken from "../../utilities/user-access-tokens";

export default function ChangeEmailModal(props) {
  let user = useContext(UserContext);
  const email = props.email;
  const setEmail = props.setEmail;
  const emailChangeIsOpen = props.emailChangeIsOpen;
  const setEmailChangeIsOpen = props.setEmailChangeIsOpen;
  const setUserData = props.setUserData;
  const userData = props.userData;
  const [errors, setErrors] = useState({});

  const [emailSent, setEmailSent] = useState(false);

  const sendConfirmEmail = async () => {
    const urlHost = process.env.REACT_APP_PROD_URL;

    const url = new URL("/send-confirm-email", urlHost);

    try {
      const response = await axios.post(url, {
        email: email,
      });
      setEmailSent(true);
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

  const editUserEmail = async (accessToken) => {
    const urlHost = process.env.REACT_APP_PROD_URL;

    const url = new URL(`/users/${localStorage.getItem("user")}`, urlHost);

    try {
      const response = await axios.patch(
        url,
        {
          email: email,
          email_confirmed: false,
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
      setUserData({ ...userData, email: email });
      user.setUser({ ...user.user, email: email, email_confirmed: false });

      return true;
    } catch (error) {
      let errorObj = {};

      for (const [key, value] of Object.entries(error.response.data)) {
        if (
          key === "email" &&
          value[0] === "user with this email already exists."
        ) {
          errorObj.email = "A user account with this email already exists.";
        } else {
          errorObj[key] = value;
        }
      }
      setErrors({ ...errorObj });
      window.scrollTo(0, 0);

      console.log(error);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!email) {
      errors = {
        email: "Enter an email.",
        ...errors,
      };
    }

    if (Object.keys(errors).length === 0) {
      const accessToken = await getUserAccessToken();
      const success = await editUserEmail(accessToken);
      if (success) {
        await sendConfirmEmail();
      }
    } else {
      setErrors({ ...errors });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className={`z-50 fixed ${
        emailChangeIsOpen ? "" : "hidden"
      } inset-0 w-screen h-screen blur-lg flex justify-center place-items-center`}
    >
      <div
        className={`max-w-lg w-full mx-3 my-3 pb-14 pt-14 px-8 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
      >
        <h1 className="w-full mb-10 text-center font-title tracking-wider text-2xl md:text-3xl">
          Change Email
        </h1>
        {emailSent ? (
          <div className="flex flex-col justify-center place-items-center">
            <p className="text-center font-title font-light tracking-wider text-lg">
              An email confirmation link has been sent to your new email
              address.
            </p>
            <button
              onClick={(e) => {
                setEmailChangeIsOpen(false);
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
              A link will be sent to your new email address for confirmation
            </p>
            <div className="mt-5 w-full flex flex-col md:flex-row">
              <p className="md:inline-block ml-1 md:ml-0 mr-1 md:mr-6 font-semibold">
                Email:
                <span className="ml-0.5 text-primary-red text-base">*</span>
              </p>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="md:flex-grow py-0.5 px-3 shadow-inner border border-gray-200 rounded-md focus:outline-none"
              />
            </div>
            <p className="w-full mt-1 text-right text-sm font-body text-red-500">
              {errors.email}
            </p>

            <div className="flex justify-center">
              <button
                onClick={(e) => {
                  setEmailChangeIsOpen(false);
                }}
                className="mt-10 mx-3 px-3 py-1.5 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none"
              >
                <span className="uppercase font-semibold font-title tracking-widest text-gray-100">
                  Cancel
                </span>
              </button>
              <button
                type="submit"
                onClick={handleChangeEmail}
                className="mt-10 mx-3 px-3 py-1.5  ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
              >
                <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
                  Change Email
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

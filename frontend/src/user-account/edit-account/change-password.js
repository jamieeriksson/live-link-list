import React, { useState } from "react";
import axios from "axios";

export default function ChangePasswordModal(props) {
  const email = props.email;
  const passwordChangeIsOpen = props.passwordChangeIsOpen;
  const setPasswordChangeIsOpen = props.setPasswordChangeIsOpen;

  const [emailSent, setEmailSent] = useState(false);

  const sendEmail = async () => {
    const urlHost = process.env.REACT_APP_PROD_URL;

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

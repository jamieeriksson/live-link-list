import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import getUserAccessToken from "../../utilities/user-access-tokens.js";

export default function DeleteAccountModal(props) {
  const userId = props.userId;
  const deleteAccountIsOpen = props.deleteAccountIsOpen;
  const setDeleteAccountIsOpen = props.setDeleteAccountIsOpen;

  const deleteAccount = async (accessToken) => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = process.env.REACT_APP_PROD_URL;
    }

    const url = new URL(`/users/${userId}`, urlHost);

    try {
      const response = await axios.delete(url, {
        headers: {
          AUTHORIZATION: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          accept: "application/json",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      });
      window.location.href = "/";
      alert("Your account was successfully deleted");
      localStorage.clear();
    } catch (error) {
      console.log(error.response.data);
      console.log(error);
      console.log(error.message);
      console.log(error.request);
      console.log(error.config);
      console.log(error.stack);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const accessToken = await getUserAccessToken();
    await deleteAccount(accessToken);
  };

  return (
    <div
      className={`z-50 fixed ${
        deleteAccountIsOpen ? "" : "hidden"
      } inset-0 w-screen h-screen blur-lg flex justify-center place-items-center`}
    >
      <div
        className={`max-w-lg w-full mx-3 my-3 pb-14 pt-14 px-8 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
      >
        <h1 className="w-full mb-10 text-center font-title tracking-wider text-2xl md:text-3xl">
          Delete Account
        </h1>
        <div className="flex flex-col justify-center place-items-center">
          <p className="text-center font-title font-light tracking-wider text-lg">
            <span className="mr-2 text-red-900">
              <FontAwesomeIcon icon={faExclamationCircle} />
            </span>
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be lost.
          </p>

          <div className="flex justify-center">
            <button
              onClick={(e) => {
                setDeleteAccountIsOpen(false);
              }}
              className="mt-10 mx-3 px-3 py-1.5 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-gray-100">
                Cancel
              </span>
            </button>
            <button
              type="submit"
              onClick={handleDelete}
              className="mt-10 mx-3 px-3 py-1.5  ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
                Delete Account
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../hooks/axiosApi.js";

export default function DeleteLiveModal(props) {
  const live = props.live;
  const setIsConfirmDeleteOpen = props.setIsConfirmDeleteOpen;
  const isConfirmDeleteOpen = props.isConfirmDeleteOpen;

  const getNewTokens = async () => {
    try {
      const response = await axiosInstance.post("/refresh-token", {
        refresh: localStorage.getItem("refresh_token"),
      });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      console.log("set new tokens");
      return response.data.access;
    } catch (error) {
      console.log(error);
      console.log(error.message);
      console.log(error.request);
      console.log(error.config);
      console.log(error.stack);
    }
  };

  const deleteLive = async (accessToken) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/lives/${live.id}`,
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
    } catch (error) {
      console.log(error);
      console.log(error.message);
      console.log(error.request);
      console.log(error.config);
      console.log(error.stack);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const accessToken = await getNewTokens();
    await deleteLive(accessToken);

    window.location.reload();
  };

  return (
    <div
      className={`z-50 fixed ${
        isConfirmDeleteOpen ? "" : "hidden"
      } inset-0 w-screen h-screen blur-md flex justify-center place-items-center`}
    >
      <div className="px-5 py-8 max-w-md w-full flex flex-col justify-center place-items-center bg-gray-100 shadow-md border border-gray-200 rounded-lg">
        <p className="font-gray-800 tracking-wide text-center font-semibold text-xl">
          Are you sure you want to delete this live?
          <br />
          <span className="text-base text-primary-red tracking-wide">
            This action cannot be undone.
          </span>
        </p>
        <div className="flex mt-8">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsConfirmDeleteOpen(false);
            }}
            className="mx-3 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none hover:shadow-md opacity-90 hover:opacity-100"
          >
            <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
              Cancel
            </span>
          </button>
          <button
            onClick={handleDelete}
            className="mx-3 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none hover:shadow-md opacity-90 hover:opacity-100"
          >
            <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
              Delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

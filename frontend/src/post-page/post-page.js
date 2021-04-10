import React, { useState, useContext } from "react";
import axios from "axios";
import {
  faInstagram,
  faTiktok,
  faFacebook,
  faYoutube,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";
import { UserContext } from "../utilities/userContext";
import getUserAccessToken from "../utilities/user-access-tokens.js";
import LinkInput from "./link-input.js";
import LiveDetails from "./live-details.js";
import CheckoutModal from "./checkout-modal.js";
import { PlatformContext } from "../utilities/platformContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

const durationOptions = [
  {
    duration: "5 minutes",
    postDuration: "00:05:00",
    cost: 0,
  },
  {
    duration: "10 minutes",
    postDuration: "00:10:00",
    cost: 0,
  },
  {
    duration: "15 minutes",
    postDuration: "00:15:00",
    cost: 0,
  },
  {
    duration: "30 minutes",
    postDuration: "00:30:00",
    cost: 0,
  },
  {
    duration: "60 minutes",
    postDuration: "00:60:00",
    cost: 0,
  },
];

export default function PostingPage() {
  const platformOptions = useContext(PlatformContext);
  let user = useContext(UserContext);

  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);
  const [username, setUsername] = useState("");
  const [featured, setFeatured] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlInputDesktop, setUrlInputDesktop] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [hashtagsList, setHashtagsList] = useState([]);
  const [description, setDescription] = useState("");
  const [linkDuration, setLinkDuration] = useState(durationOptions[0]);
  const [amountOwed, setAmountOwed] = useState(0);
  const [errors, setErrors] = useState({});
  const [checkoutModalIsOpen, setCheckoutModalIsOpen] = useState(false);
  const [isLiveSuccess, setIsLiveSuccess] = useState(false);
  const descMaxLength = 100;
  const featuredCost = 25;

  const handleUrlChange = (url, platform) => {
    let urlPlatform = selectedPlatform;

    if (platform !== null) {
      urlPlatform = platform;
    }
    const input = url;

    if (input.includes(urlPlatform.urlStart)) {
      setUrlInput(input.slice(urlPlatform.urlStart.length));
    } else {
      setUrlInput(input);
    }
  };

  const handleUrlChangeDesktop = (url, platform) => {
    let urlPlatform = selectedPlatform;

    if (platform !== null) {
      urlPlatform = platform;
    }
    const input = url;

    if (input.includes(urlPlatform.urlStartDesktop)) {
      setUrlInputDesktop(input.slice(urlPlatform.urlStartDesktop.length));
    } else {
      setUrlInputDesktop(input);
    }
  };

  const addHashtag = (e) => {
    let existingHashtags = [...hashtagsList];

    if (e.keyCode === 32) {
      const text = e.target.value;

      if (text.slice(0, 1) === "#") {
        existingHashtags.push(text.slice(0, -1));
      } else {
        existingHashtags.push("#" + text.slice(0, -1));
      }
      setHashtagsList([...existingHashtags]);
      setHashtags("");
    }

    if (e.keyCode === 8 && hashtags === "") {
      existingHashtags.pop();
      setHashtagsList([...existingHashtags]);
    }
  };

  const removeHashtag = (hashtag) => {
    let existingHashtags = [...hashtagsList];
    const index = existingHashtags.indexOf(hashtag);
    existingHashtags.splice(index, 1);
    setHashtagsList([...existingHashtags]);
  };

  const postLive = async (accessToken) => {
    setLiveUrl(`${selectedPlatform.urlStart} + ${urlInput}`);
    const postHashtags = [];

    const urlHost = process.env.REACT_APP_PROD_URL;

    const url = new URL(`/lives`, urlHost);

    for (const hashtag of hashtagsList) {
      postHashtags.push(hashtag.slice(1));
    }

    let body = {};

    if (urlInputDesktop) {
      body = {
        link: selectedPlatform.urlStartDesktop + urlInputDesktop,
        username: username,
        description: description,
        duration: linkDuration.postDuration,
        is_featured: featured,
        platform_id: selectedPlatform.id,
        hashtags: postHashtags,
      };
    } else {
      body = {
        link: selectedPlatform.urlStart + urlInput,
        username: username,
        description: description,
        duration: linkDuration.postDuration,
        is_featured: featured,
        platform_id: selectedPlatform.id,
        hashtags: postHashtags,
      };
    }

    try {
      if (accessToken) {
        const response = await axios.post(url, body, {
          headers: {
            AUTHORIZATION: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            accept: "application/json",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },
        });
      } else {
        const response = await axios.post(url, body);
      }

      setSelectedPlatform(platformOptions[0]);
      setUsername("");
      setFeatured(false);
      setUrlInput("");
      setUrlInputDesktop("");
      setLiveUrl("");
      setHashtags("");
      setHashtagsList([]);
      setDescription("");
      setLinkDuration(durationOptions[0]);
      // setAmountOwed(0);
      setErrors({});
      // setCheckoutModalIsOpen(false);
      setIsLiveSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
      console.log(error.message);
      console.log(error.request);
      console.log(error.config);
      console.log(error.stack);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    let errors = {};

    if ("urlStartDesktop" in selectedPlatform) {
      if (!urlInput && !urlInputDesktop) {
        errors = {
          urlInputDesktop: "You must enter a link",
          ...errors,
        };
      }

      if (urlInput && urlInputDesktop) {
        errors = {
          urlInputDesktop: "You cannot enter two links",
          ...errors,
        };
      }
    } else {
      if (!urlInput) {
        errors = {
          urlInput: "You must enter a link",
          ...errors,
        };
      }
    }

    for (const hashtag of hashtagsList) {
      console.log(hashtag);
      console.log(hashtag.slice(1));
      if (hashtag.slice(1) === "") {
        errors = {
          hashtags: "You cannot have a blank hashtag",
          ...errors,
        };
      }
    }

    if (description.length > descMaxLength) {
      errors = {
        description: `Must be less than ${descMaxLength} characters`,
        ...errors,
      };
    }

    if (Object.keys(errors).length === 0) {
      // if (user.user['logged_in']) {
      if (user.user && user.user["logged_in"]) {
        const accessToken = await getUserAccessToken();
        await postLive(accessToken);
      } else {
        await postLive();
      }
    } else {
      setErrors({ ...errors });
      window.scrollTo(0, 0);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    alert("checkout!");
    setCheckoutModalIsOpen(false);
  };

  return (
    <div
      className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-2 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-${selectedPlatform.color}-300 to-gray-50`}
    >
      {isLiveSuccess ? (
        <div className="relative mb-3 py-3 px-8 border border-green-200 bg-green-100 rounded-lg flex justify-center place-items-center">
          <span className="mr-2 text-green-500">
            <FontAwesomeIcon icon={faCheckCircle} />
          </span>
          <span>Your live was successfully posted!</span>
          <span
            onClick={() => setIsLiveSuccess(false)}
            className="mt-1 mr-2 absolute top-0 right-0 text-xs text-gray-500 ml-2 hover:text-gray-900 cursor-pointer"
          >
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </div>
      ) : null}
      <form
        className={`max-w-3xl w-full mx-3 my-3 pb-9 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100`}
      >
        <h1 className="w-full mb-7 pb-7 pt-7 px-3 bg-gray-700 rounded-t-lg md:rounded-t-2xl text-gray-100 text-center font-title tracking-wider text-2xl md:text-3xl shadow-md">
          Pick your platform and enter the url for your live stream
        </h1>
        <LinkInput
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          urlInput={urlInput}
          urlInputDesktop={urlInputDesktop}
          setUrlInput={setUrlInput}
          setUrlInputDesktop={setUrlInputDesktop}
          handleUrlChange={handleUrlChange}
          handleUrlChangeDesktop={handleUrlChangeDesktop}
          username={username}
          setUsername={setUsername}
          user={user}
          errors={errors}
        />
        <LiveDetails
          hashtags={hashtags}
          hashtagsList={hashtagsList}
          setHashtagsList={setHashtagsList}
          removeHashtag={removeHashtag}
          setHashtags={setHashtags}
          addHashtag={addHashtag}
          description={description}
          setDescription={setDescription}
          durationOptions={durationOptions}
          linkDuration={linkDuration}
          setLinkDuration={setLinkDuration}
          descMaxLength={descMaxLength}
          featured={featured}
          setFeatured={setFeatured}
          errors={errors}
        />
        {/* {linkDuration.cost > 0 || featured ? (
          <div className="mt-10 flex flex-col place-items-center">
            <p className="mb-2 text-lg">
              <span className="mr-2 tracking-wide">Total:</span>
              <span className="text-red-500">
                ${(linkDuration.cost + (featured && featuredCost)).toFixed(2)}
              </span>
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCheckoutModalIsOpen(true);
              }}
              className="px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
                Checkout &amp; Post
              </span>
            </button>
          </div>
        ) : ( */}
        <button
          onClick={handleSubmit}
          className="mt-10 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none"
        >
          <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
            Post Your Live
          </span>
        </button>
        {/* )} */}
      </form>
      {/* 
      <CheckoutModal
        checkoutModalIsOpen={checkoutModalIsOpen}
        setCheckoutModalIsOpen={setCheckoutModalIsOpen}
        duration={linkDuration}
        featured={featured}
        featuredCost={featuredCost}
        handleCheckout={handleCheckout}
      /> */}
    </div>
  );
}

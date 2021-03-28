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
import { PlatformContext } from "../utilities/platformContext";

const durationOptions = [
  {
    duration: "5 minutes",
    postDuration: "00:05:00",
    cost: "Free",
  },
  {
    duration: "10 minutes",
    postDuration: "00:10:00",
    cost: "$2",
  },
  {
    duration: "15 minutes",
    postDuration: "00:15:00",
    cost: "$5",
  },
  {
    duration: "30 minutes",
    postDuration: "00:30:00",
    cost: "$10",
  },
  {
    duration: "60 minutes",
    postDuration: "00:60:00",
    cost: "$25",
  },
];

export default function PostingPage() {
  const platformOptions = useContext(PlatformContext);
  let user = useContext(UserContext);

  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);
  const [username, setUsername] = useState("");
  const [featured, setFeatured] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [hashtagsList, setHashtagsList] = useState([]);
  const [description, setDescription] = useState("");
  const [linkDuration, setLinkDuration] = useState(durationOptions[0]);
  const [errors, setErrors] = useState({});
  const descMaxLength = 100;

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

    for (const hashtag of hashtagsList) {
      postHashtags.push(hashtag.slice(1));
    }

    const body = {
      link: selectedPlatform.urlStart + urlInput,
      username: username,
      description: description,
      duration: linkDuration.postDuration,
      is_featured: featured,
      platform: selectedPlatform.id,
      hashtags: postHashtags,
    };

    try {
      const response = await axios.post("http://localhost:8000/lives", body, {
        headers: {
          AUTHORIZATION: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          accept: "application/json",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      });
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

    if (!urlInput) {
      errors = {
        urlInput: "You must enter a link",
        ...errors,
      };
    }

    if (description.length > descMaxLength) {
      errors = {
        description: `Must be less than ${descMaxLength} characters`,
        ...errors,
      };
    }

    if (Object.keys(errors).length === 0) {
      if (user.user) {
        const accessToken = await getUserAccessToken();
        await postLive(accessToken);
      } else {
        await postLive();
      }

      window.location.reload();
    } else {
      setErrors({ ...errors });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-${selectedPlatform.color}-300 to-gray-50`}
    >
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
          setUrlInput={setUrlInput}
          handleUrlChange={handleUrlChange}
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
          errors={errors}
        />
        <div className="flex justify-center place-items-center"></div>
        <button
          onClick={handleSubmit}
          className="mt-10 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none"
        >
          <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
            Post Your Live
          </span>
        </button>
      </form>
    </div>
  );
}

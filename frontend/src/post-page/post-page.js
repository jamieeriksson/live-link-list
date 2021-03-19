import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  faTimesCircle,
  faClipboard,
} from "@fortawesome/free-regular-svg-icons";
import {
  faInstagram,
  faTiktok,
  faFacebook,
  faYoutube,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";
import useOutsideAlerter from "../hooks/outside-alerter";
import { UserContext } from "../user-account/userContext";
import axiosInstance from "../hooks/axiosApi.js";

function LinkInput(props) {
  const [isPlatformSelectOpen, setIsPlatformSelectOpen] = useState(false);

  const selectedPlatform = props.selectedPlatform;
  const setSelectedPlatform = props.setSelectedPlatform;
  const platformOptions = props.platformOptions;
  const urlInput = props.urlInput;
  const setUrlInput = props.setUrlInput;
  const handleUrlChange = props.handleUrlChange;

  useEffect(() => {
    checkPaste();

    return () => {};
  }, []);

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    setIsPlatformSelectOpen(!isPlatformSelectOpen);
    setUrlInput("");
  };

  async function checkPaste() {
    const pasted = await navigator.clipboard.readText();

    for (const platform of platformOptions) {
      if (pasted.includes(platform.urlStart)) {
        setSelectedPlatform(platform);
        handleUrlChange(pasted, platform);
      }
    }

    return;
  }

  return (
    <div className="w-full flex flex-col justify-center place-items-center">
      <div className="max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg w-full mb-5 md:mb-10 flex justify-center place-items-center flex-wrap">
        {platformOptions.map((platform) => (
          <button
            key={platform.name}
            onClick={(e) => {
              e.preventDefault();
              handlePlatformSelect(platform);
            }}
            className={`${
              selectedPlatform.name === platform.name
                ? `text-${platform.color}-700 border-${platform.color}-700`
                : "text-gray-600"
            } mx-auto px-1 pb-1 border-b-4 border-transparent hover:text-${
              platform.color
            }-700 focus:outline-none`}
          >
            <FontAwesomeIcon icon={platform.icon} size="2x" />
          </button>
        ))}
      </div>

      <div className="flex justify-center place-items-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            checkPaste();
          }}
          className={`mb-5 px-4 py-1 flex justify-center place-items-center ring-1 ring-gray-200 rounded-md shadow-sm text-gray-200 hover:text-gray-100 bg-${selectedPlatform.color}-900 hover:bg-${selectedPlatform.color}-800 hover:shadow-md focus:outline-none`}
        >
          <FontAwesomeIcon icon={faClipboard} />

          <span className="ml-3 uppercase font-semibold font-title tracking-widest">
            Paste Link
          </span>
        </button>
      </div>

      <div className="px-3 max-w-xl w-full flex justify-center place-items-center flex-wrap md:flex-nowrap text-xl md:text-2xl">
        <span className="md:whitespace-nowrap mr-2 mb-1 md:mb-0 font-semibold md:tracking-wide">
          {selectedPlatform.urlStart}
        </span>
        <div className="flex-grow inline px-2 py-1 rounded-md ring-1 ring-gray-200 shadow-sm bg-white">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => {
              const input = e.target.value;
              handleUrlChange(input, selectedPlatform);
            }}
            placeholder={selectedPlatform.placeholder}
            className="w-full bg-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function LiveDetails(props) {
  const [isLinkDurationOpen, setIsLinkDurationOpen] = useState(false);

  const hashtags = props.hashtags;
  const hashtagsList = props.hashtagsList;
  const setHashtagsList = props.setHashtagsList;
  const removeHashtag = props.removeHashtag;
  const setHashtags = props.setHashtags;
  const addHashtag = props.addHashtag;
  const description = props.description;
  const setDescription = props.setDescription;
  const durationOptions = props.durationOptions;
  const linkDuration = props.linkDuration;
  const setLinkDuration = props.setLinkDuration;

  const outsideClickDurationRef = useRef(null);
  useOutsideAlerter(outsideClickDurationRef, () => {
    setIsLinkDurationOpen(false);
  });

  return (
    <div className="px-3 max-w-2xl w-full flex flex-col justify-center place-items-center">
      <div className="w-full mt-8 flex flex-col">
        <span className="mb-1 text-xl uppercase">Hashtags</span>
        <div className="flex-grow px-2 py-1 flex flex-wrap place-items-center ring-1 ring-gray-200 rounded-md shadow-sm bg-white">
          {hashtagsList.map((hashtag) => (
            <div
              key={hashtag.id}
              className="flex flex-nowrap px-2 mx-1 text-sm border border-gray-500 bg-gray-300 rounded-2xl text-gray-800"
            >
              <span className="mr-1">{hashtag}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeHashtag(hashtag);
                }}
                className="focus:outline-none"
              >
                <FontAwesomeIcon icon={faTimesCircle} color="#222222" />
              </button>
            </div>
          ))}
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            onKeyUp={addHashtag}
            placeholder={`${
              hashtagsList.length > 0
                ? ""
                : "enter a hashtag, press space to enter another"
            }`}
            className="flex-grow bg-white focus:outline-none"
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setHashtags("");
            setHashtagsList([]);
          }}
          className="mt-1 self-end hover:underline text-sm text-primary-blue focus:outline-none"
        >
          Clear Hashtags
        </button>
      </div>

      <div className="w-full mt-8 flex flex-col">
        <span className="mb-1">
          <span className="uppercase text-xl">Description</span> (max 100
          characters):
        </span>
        <textarea
          placeholder="enter short description for your live"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-24 px-2 py-1 ring-1 ring-gray-200 rounded-md shadow-sm bg-white focus:outline-none"
        />
      </div>

      <div className="mt-8 flex justify-center place-items-center">
        <span className="mr-4 mb-1 text-xl uppercase">Link Duration:</span>
        <div ref={outsideClickDurationRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLinkDurationOpen(!isLinkDurationOpen);
            }}
            className="w-48 px-3 py-1 flex place-items-center ring-1 ring-gray-200 rounded-md shadow-sm bg-white focus:outline-none"
          >
            <span className="flex-grow text-left text-lg">
              {linkDuration.duration}
            </span>
            <span className="text-sm float-right">
              <FontAwesomeIcon icon={faChevronDown} color="#111111" />
            </span>
          </button>

          <div
            className={`absolute z-10 flex flex-col ${
              isLinkDurationOpen ? "block" : "hidden"
            }`}
          >
            {durationOptions.map((option) => (
              <button
                key={option.duration}
                onClick={(e) => {
                  e.preventDefault();
                  setLinkDuration(option);
                  setIsLinkDurationOpen(!isLinkDurationOpen);
                }}
                className="w-48 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-gray-100 focus:outline-none"
              >
                <span className="float-left text-xl font-light">
                  {option.duration}
                </span>
                <span className="float-right text-xl font-medium">
                  {option.cost}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostingPage() {
  const platformOptions = [
    {
      name: "TikTok",
      icon: faTiktok,
      urlStart: "https://vm.tiktok.com/",
      placeholder: "xxxxxxxxx",
      color: "indigo",
    },
    {
      name: "Instagram",
      icon: faInstagram,
      urlStart: "https://www.instagram.com/",
      placeholder: "username/live",
      color: "pink",
    },
    {
      name: "Youtube",
      icon: faYoutube,
      urlStart: "https://www.youtube.com/watch?v=",
      placeholder: "5qap5aO4i9A",
      color: "red",
    },
    {
      name: "Facebook",
      icon: faFacebook,
      urlStart: "https://fb.watch/",
      placeholder: "3WERq5mV2x",
      color: "blue",
    },
    {
      name: "Twitch",
      icon: faTwitch,
      urlStart: "https://www.twitch.tv/",
      placeholder: "username",
      color: "purple",
    },
  ];

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

  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);
  const [username, setUsername] = useState("");
  const [featured, setFeatured] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [hashtagsList, setHashtagsList] = useState([]);
  const [description, setDescription] = useState("");
  const [linkDuration, setLinkDuration] = useState(durationOptions[0]);
  let user = useContext(UserContext);

  const handleUrlChange = (url, platform) => {
    let urlPlatform = selectedPlatform;

    if (platform !== null) {
      urlPlatform = platform;
    }
    const input = url;

    if (input.includes(urlPlatform.urlStart)) {
      console.log(input.slice(urlPlatform.urlStart.length));
      setUrlInput(input.slice(urlPlatform.urlStart.length));
    } else {
      setUrlInput(input);
    }
  };

  const addHashtag = (e) => {
    let existingHashtags = [...hashtagsList];

    if (e.keyCode === 32) {
      const text = e.target.value;
      console.log(`adding hashtag ${text}`);

      if (text.slice(0, 1) === "#") {
        existingHashtags.push(text.slice(0, -1));
      } else {
        existingHashtags.push("#" + text.slice(0, -1));
      }
      setHashtagsList([...existingHashtags]);
      setHashtags("");
    }

    if (e.keyCode === 8 && hashtags === "") {
      console.log("removing last hashtag");
      existingHashtags.pop();
      setHashtagsList([...existingHashtags]);
    }
  };

  const removeHashtag = (hashtag) => {
    console.log(`removing ${hashtag}`);
    let existingHashtags = [...hashtagsList];
    const index = existingHashtags.indexOf(hashtag);
    console.log(index);
    existingHashtags.splice(index, 1);
    setHashtagsList([...existingHashtags]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      platform: selectedPlatform.name,
      hashtags: postHashtags,
    };
    console.log(body);

    if (user.user) {
      try {
        const response = await axiosInstance.post("/refresh-token", {
          refresh: localStorage.getItem("refresh_token"),
        });
        console.log(response);
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        console.log("set new tokens");
        const postResponse = await axios.post(
          "http://localhost:8000/lives",
          body,
          {
            headers: {
              AUTHORIZATION: `Bearer ${response.data.access}`,
              "Content-Type": "application/json",
              accept: "application/json",
              "Access-Control-Allow-Methods":
                "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
            },
          }
        );
        console.log(postResponse);
      } catch (error) {
        console.log(error);
        console.log(error.message);
        console.log(error.request);
        console.log(error.config);
        console.log(error.stack);
      }
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
          platformOptions={platformOptions}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          handleUrlChange={handleUrlChange}
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

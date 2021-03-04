import React, { useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faInstagram,
  faTiktok,
  faFacebook,
  faYoutube,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";
import useOutsideAlerter from "../hooks/outside-alerter";

export default function PostingPage() {
  const platformOptions = [
    {
      name: "Tiktok",
      icon: faTiktok,
      urlStart: "https://www.tiktok.com/",
      placeholder: "@username",
      urlEnd: "/live",
    },
    {
      name: "Instagram",
      icon: faInstagram,
      urlStart: "https://www.instagram.com/",
      placeholder: "username",
      urlEnd: "/live",
    },
    {
      name: "Youtube",
      icon: faYoutube,
      urlStart: "https://www.youtube.com/watch?v=",
      placeholder: "5qap5aO4i9A",
      urlEnd: "",
    },
    {
      name: "Facebook",
      icon: faFacebook,
      urlStart: "https://fb.watch.com/",
      placeholder: "3WERq5mV2x",
      urlEnd: "",
    },
    {
      name: "Twitch",
      icon: faTwitch,
      urlStart: "https://www.twitch.tv.com/",
      placeholder: "username",
      urlEnd: "",
    },
  ];

  const durationOptions = [
    {
      duration: "5 minutes",
      cost: "Free",
    },
    {
      duration: "10 minutes",
      cost: "$2",
    },
    {
      duration: "15 minutes",
      cost: "$5",
    },
    {
      duration: "30 minutes",
      cost: "$10",
    },
    {
      duration: "60 minutes",
      cost: "$25",
    },
  ];

  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);
  const [urlInput, setUrlInput] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [hashtagsList, setHashtagsList] = useState([]);
  const [description, setDescription] = useState("");
  const [linkDuration, setLinkDuration] = useState(durationOptions[0]);

  const [isPlatformSelectOpen, setIsPlatformSelectOpen] = useState(false);
  const [isLinkDurationOpen, setIsLinkDurationOpen] = useState(false);

  const outsideClickPlatformRef = useRef(null);
  const outsideClickDurationRef = useRef(null);
  useOutsideAlerter(outsideClickPlatformRef, () => {
    setIsPlatformSelectOpen(false);
  });
  useOutsideAlerter(outsideClickDurationRef, () => {
    setIsLinkDurationOpen(false);
  });

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    setIsPlatformSelectOpen(!isPlatformSelectOpen);
    setUrlInput("");
  };

  const handleUrlChange = (e) => {
    const input = e.target.value;

    console.log(input);
    console.log(selectedPlatform);
    console.log(selectedPlatform.name);
    console.log(input.slice(0, 1) !== "@");

    if (selectedPlatform.name === "Tiktok" && input.slice(0, 1) !== "@") {
      setUrlInput("@" + input);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLiveUrl(
      `${selectedPlatform.urlStart} + ${urlInput} + ${selectedPlatform.urlEnd}`
    );

    alert(
      `Platform: ${selectedPlatform.name}, Live URL: ${liveUrl}, Description: ${description}, Link Duration: ${linkDuration.duration}`
    );
  };

  return (
    <div className="max-w-screen w-full max-h-screen h-full flex justify-center place-items-center font-body">
      <form className="max-w-4xl w-full mx-3 my-3 flex flex-col justify-center place-items-center border-transparent rounded-xl bg-gray-50">
        <h1 className="mt-8 font-title text-3xl">
          Pick your platform and enter the url for your live stream
        </h1>
        <div className="my-12">
          <div className="float-left">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsPlatformSelectOpen(!isPlatformSelectOpen);
              }}
              className="w-52 px-5 py-1 flex justify-end bg-primary-blue text-gray-100 focus:outline-none"
            >
              <div className="flex-grow text-center">
                <span className="text-2xl">
                  <FontAwesomeIcon
                    icon={selectedPlatform.icon}
                    color="#f3f4f6"
                  />
                </span>
                <span className="ml-3 text-xl uppercase">
                  {selectedPlatform.name}
                </span>
              </div>
              <span className="self-end text-lg">
                <FontAwesomeIcon icon={faChevronDown} color="#f3f4f6" />
              </span>
            </button>
            <div
              ref={outsideClickPlatformRef}
              className={`absolute z-10 flex flex-col ${
                isPlatformSelectOpen ? "block" : "hidden"
              }`}
            >
              {platformOptions.map((platform) => (
                <button
                  key={platform.name}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePlatformSelect(platform);
                  }}
                  className="w-52 px-3 py-1 bg-blue-400 hover:bg-primary-blue font-light hover:font-normal text-gray-100 focus:outline-none"
                >
                  <span className="text-xl">
                    <FontAwesomeIcon icon={platform.icon} color="#f3f4f6" />
                  </span>
                  <span className="ml-3 text-xl">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="inline ml-4 px-2 pb-2 text-xl border-b border-gray-800">
            <span className="mr-2">{selectedPlatform.urlStart}</span>
            <div className="inline px-2 py-1 rounded-md ring-1 ring-gray-200 shadow-sm bg-white">
              <input
                type="text"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder={selectedPlatform.placeholder}
                className="w-36 bg-white focus:outline-none"
              />
            </div>
            <span className="ml-2">{selectedPlatform.urlEnd}</span>
          </div>

          <div className="mt-12 flex justify-center place-items-center">
            <span className="mr-4 text-xl font-medium">Hashtags:</span>
            <div className="flex-grow px-2 py-1 flex place-items-center ring-1 ring-gray-200 rounded-md shadow-sm bg-white">
              {hashtagsList.map((hashtag) => (
                <div
                  key={hashtag}
                  className="px-2 mx-1 text-sm border border-gray-500 bg-gray-300 rounded-2xl text-gray-800"
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
          </div>

          <div className="mt-12 flex flex-col justify-center place-items-center">
            <span className="mr-4 mb-3 text-xl font-medium">
              Description (max 100 characters):
            </span>
            <textarea
              placeholder="enter short description for your live"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 px-2 py-1 ring-1 ring-gray-200 rounded-md shadow-sm bg-white focus:outline-none"
            />
          </div>

          <div className="mt-12 flex justify-center place-items-center">
            <span className="mr-4 text-xl font-medium">Link Duration:</span>
            <div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsLinkDurationOpen(!isLinkDurationOpen);
                }}
                className="w-48 px-3 py-1 ring-1 ring-gray-200 rounded-md shadow-sm bg-white focus:outline-none"
              >
                <span className="ml-3 mr-8 text-xl">
                  {linkDuration.duration}
                </span>
                <span className="text-lg">
                  <FontAwesomeIcon icon={faChevronDown} color="#111111" />
                </span>
              </button>

              <div
                ref={outsideClickDurationRef}
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

          <div className="flex justify-center place-items-center">
            <button
              onClick={handleSubmit}
              className="mt-12 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none"
            >
              <span className="uppercase font-medium text-xl text-gray-100">
                Post Your Live
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

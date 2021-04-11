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
import { UserContext } from "../../utilities/userContext.js";
import getUserAccessToken from "../../utilities/user-access-tokens.js";

import LiveDetails from "./edit-live-details.js";
import LinkInput from "./edit-live-link-input.js";
import { PlatformContext } from "../../utilities/platformContext";

function EditLiveModal(props) {
  const setEditModalIsOpen = props.setEditModalIsOpen;

  return (
    <div
      className={`z-50 fixed ${
        props.editModalIsOpen ? "" : "hidden"
      } inset-0 w-screen min-h-screen pt-24 pb-18 blur-md flex justify-center place-items-center overflow-y-scroll`}
    >
      <form
        className={`max-w-3xl w-full mx-3 my-3 py-14 flex flex-col justify-center place-items-center border border-gray-200 rounded-lg md:rounded-2xl bg-gray-100 shadow-xl`}
      >
        <LinkInput
          selectedPlatform={props.selectedPlatform}
          setSelectedPlatform={props.setSelectedPlatform}
          urlInput={props.urlInput}
          urlInputDesktop={props.urlInputDesktop}
          setUrlInput={props.setUrlInput}
          setUrlInputDesktop={props.setUrlInputDesktop}
          handleUrlChange={props.handleUrlChange}
          handleUrlChangeDesktop={props.handleUrlChangeDesktop}
          username={props.username}
          setUsername={props.setUsername}
          errors={props.errors}
        />
        <LiveDetails
          hashtags={props.hashtags}
          hashtagsList={props.hashtagsList}
          setHashtagsList={props.setHashtagsList}
          removeHashtag={props.removeHashtag}
          setHashtags={props.setHashtags}
          addHashtag={props.addHashtag}
          description={props.description}
          setDescription={props.setDescription}
          addDuration={props.addDuration}
          setAddDuration={props.setAddDuration}
          errors={props.errors}
          descMaxLength={props.descMaxLength}
        />
        <div className="flex justify-center place-items-center"></div>
        <div className="flex mt-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              setEditModalIsOpen(false);
            }}
            className="mx-3 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none hover:shadow-md opacity-90 hover:opacity-100"
          >
            <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
              Cancel
            </span>
          </button>
          <button
            onClick={props.handleUpdate}
            className="mx-3 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none hover:shadow-md opacity-90 hover:opacity-100"
          >
            <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
              Update Live
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditLiveModalContainer(props) {
  const live = props.live;
  const editModalIsOpen = props.editModalIsOpen;
  const setEditModalIsOpen = props.setEditModalIsOpen;
  const platformOptions = useContext(PlatformContext);

  const [selectedPlatform, setSelectedPlatform] = useState(
    platformOptions.find((obj) => {
      return obj.id === live.platform_id;
    })
  );
  const [username, setUsername] = useState("");
  const [featured, setFeatured] = useState(live.is_featured);
  const [urlInput, setUrlInput] = useState(
    live.link.includes(selectedPlatform.urlStart)
      ? live.link.slice(selectedPlatform.urlStart.length)
      : null
  );
  const [urlInputDesktop, setUrlInputDesktop] = useState(
    live.link.includes(selectedPlatform.urlStartDesktop)
      ? live.link.slice(selectedPlatform.urlStartDesktop.length)
      : null
  );
  const [liveUrl, setLiveUrl] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [hashtagsList, setHashtagsList] = useState(
    live.hashtags.map((hashtag) => {
      return "#" + hashtag.name;
    })
  );
  const [description, setDescription] = useState(live.description);
  const [addDuration, setAddDuration] = useState({
    duration: "0 minutes",
    postDuration: "00:00:00",
    cost: 0,
  });
  let user = useContext(UserContext);
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

  const handleUrlChangeDesktop = (url, platform) => {
    let urlPlatform = selectedPlatform;

    if (platform !== null) {
      urlPlatform = platform;
    }
    const input = url;

    if (input.includes(urlPlatform.urlStartDesktop)) {
      setUrlInputDesktop(input.slice(urlPlatform.urlStart.length));
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

  const updateLive = async (accessToken) => {
    setLiveUrl(`${selectedPlatform.urlStart} + ${urlInput}`);
    const postHashtags = [];

    for (const hashtag of hashtagsList) {
      postHashtags.push(hashtag.slice(1));
    }

    let body = {};

    if (urlInputDesktop) {
      body = {
        link: selectedPlatform.urlStartDesktop + urlInputDesktop,
        username: username,
        description: description,
        duration: addDuration.postDuration,
        is_featured: featured,
        platform_id: selectedPlatform.id,
        hashtags: postHashtags,
      };
    } else {
      body = {
        link: selectedPlatform.urlStart + urlInput,
        username: username,
        description: description,
        duration: addDuration.postDuration,
        is_featured: featured,
        platform_id: selectedPlatform.id,
        hashtags: postHashtags,
      };
    }

    const urlHost = process.env.REACT_APP_PROD_URL;

    const url = new URL(`/lives/${live.id}`, urlHost);

    try {
      const response = await axios.patch(url, body, {
        headers: {
          AUTHORIZATION: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          accept: "application/json",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      });
      props.getUserAccountData();
      setEditModalIsOpen(false);
    } catch (error) {
      console.log(error);
      console.log(error.message);
      console.log(error.request);
      console.log(error.config);
      console.log(error.stack);
    }
  };

  const handleUpdate = async (e) => {
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
      const accessToken = await getUserAccessToken();
      await updateLive(accessToken);
      // window.location.href = "/user-lives";
    } else {
      setErrors({ ...errors });
      window.scrollTo(0, 0);
    }
  };

  return (
    <EditLiveModal
      editModalIsOpen={editModalIsOpen}
      setEditModalIsOpen={setEditModalIsOpen}
      handleUpdate={handleUpdate}
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
      hashtags={hashtags}
      hashtagsList={hashtagsList}
      setHashtagsList={setHashtagsList}
      removeHashtag={removeHashtag}
      setHashtags={setHashtags}
      addHashtag={addHashtag}
      description={description}
      setDescription={setDescription}
      addDuration={addDuration}
      setAddDuration={setAddDuration}
      errors={errors}
      descMaxLength={descMaxLength}
    />
  );
}

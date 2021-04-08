import React, { useState, useRef, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faEdit,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import useOutsideAlerter from "../../utilities/outside-alerter.js";
import EditLiveModalContainer from "./edit-live-modal.js";
import DeleteLiveModal from "./delete-live.js";
import { PlatformContext } from "../../utilities/platformContext";

function Timer(props) {
  const setIsLiveExpired = props.setIsLiveExpired;
  const endTime = +new Date(props.liveEnd);
  const [timeLeft, setTimeLeft] = useState({});
  const timerComponents = [];

  const calculateTimeLeft = () => {
    const now = +Date.now();
    const difference = endTime - now;
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    } else {
      setIsLiveExpired(true);
      // Send post to set live to expired
    }

    return timeLeft;
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span className="mr-1">
        {timeLeft[interval]} {interval}
      </span>
    );
  });

  return (
    <p className="text-xs text-red-500 font-body">
      {timerComponents.length ? timerComponents : <span>Expired</span>}
    </p>
  );
}

function Live(props) {
  const live = props.live;
  const setQuery = props.setQuery;

  const platformOptions = useContext(PlatformContext);

  const [livePlatform, setLivePlatform] = useState("");
  const [isLiveExpired, setIsLiveExpired] = useState(
    +new Date(live.expires_at) - +Date.now() < 0
  );
  const [hashtags, setHashtags] = useState([]);
  const [isHashtagsOpen, setIsHashtagsOpen] = useState(false);

  const outsideClickRef = useRef(null);
  useOutsideAlerter(outsideClickRef, () => {
    setIsHashtagsOpen(false);
  });

  useEffect(() => {
    if (live) {
      for (const platform of platformOptions) {
        live.platform_id === platform.id && setLivePlatform(platform);
      }
      setHashtags([...live.hashtags]);
    }
    return () => {};
  }, [live]);

  if (live && isLiveExpired) {
    return null;
  } else if (live) {
    return (
      <div className="w-48 md:w-72">
        <div key={live.id} className="flex h-20 place-items-center">
          <div className="relative w-16 h-16">
            {isLiveExpired ? (
              <div
                className={`h-16 w-16 flex justify-center place-items-center rounded-full bg-gray-50 border-4 border-${livePlatform.color}-200 text-gray-800`}
              >
                <FontAwesomeIcon icon={livePlatform.icon} size="2x" />
              </div>
            ) : (
              <a
                href={live.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`h-16 w-16 flex justify-center place-items-center rounded-full bg-gray-50 border-4 border-${livePlatform.color}-200 hover:shadow-md hover:bg-${livePlatform.color}-100 hover:border-${livePlatform.color}-400 transition duration-200 text-gray-800 hover:text-gray-900`}
              >
                <FontAwesomeIcon icon={livePlatform.icon} size="2x" />
              </a>
            )}
            <div
              className={`absolute ${
                live.image ? "block" : "hidden"
              } bg-gray-100 flex justify-center place-items-center right-0 bottom-0 h-5 w-5 text-lg text-gray-800 rounded-full -mb-0.5 -mr-0.5`}
            >
              <FontAwesomeIcon icon={livePlatform.icon} />
            </div>
          </div>
          <div className="ml-2 flex flex-col w-full">
            {live.username ? (
              <p className="font-body">@{live.username}</p>
            ) : (
              <p className="h-3"></p>
            )}
            <p className="flex-grow text-sm font-light font-body leading-none">
              {live.description}
            </p>

            {hashtags.length > 0 ? (
              <div className="flex leading-none">
                <div className="w-40 mr-1 overflow-x-hidden overflow-ellipsis">
                  {hashtags[0] ? (
                    <span
                      onClick={() => {
                        props.setQuery({ search: hashtags[0].name });
                        props.setSearchInput(hashtags[0].name);
                        window.scrollTo(0, 0);
                      }}
                      className="cursor-pointer mr-1 text-xs font-body leading-tight text-gray-600 hover:text-gray-800 hover:underline"
                    >
                      #{hashtags[0].name}
                    </span>
                  ) : (
                    ""
                  )}
                  {hashtags[1] ? (
                    <span
                      onClick={() => {
                        props.setQuery({ search: hashtags[1].name });
                        props.setSearchInput(hashtags[1].name);
                        window.scrollTo(0, 0);
                      }}
                      className="cursor-pointer mr-1 text-xs font-body leading-tight text-gray-600 hover:text-gray-800 hover:underline"
                    >
                      #{hashtags[1].name}
                    </span>
                  ) : (
                    ""
                  )}
                  {hashtags[2] ? (
                    <span
                      onClick={() => {
                        props.setQuery({ search: hashtags[2].name });
                        props.setSearchInput(hashtags[2].name);
                        window.scrollTo(0, 0);
                      }}
                      className="cursor-pointer mr-1 text-xs font-body leading-tight text-gray-600 hover:text-gray-800 hover:underline"
                    >
                      #{hashtags[2].name}
                    </span>
                  ) : (
                    ""
                  )}
                  {hashtags[3] ? (
                    <span
                      onClick={() => {
                        props.setQuery({ search: hashtags[3].name });
                        props.setSearchInput(hashtags[3].name);
                        window.scrollTo(0, 0);
                      }}
                      className="cursor-pointer mr-1 text-xs font-body leading-tight text-gray-600 hover:text-gray-800 hover:underline"
                    >
                      #{hashtags[3].name}
                    </span>
                  ) : (
                    ""
                  )}
                  {hashtags[4] ? (
                    <span
                      onClick={() => {
                        props.setQuery({ search: hashtags[4].name });
                        props.setSearchInput(hashtags[4].name);
                        window.scrollTo(0, 0);
                      }}
                      className="cursor-pointer mr-1 text-xs font-body leading-tight text-gray-600 hover:text-gray-800 hover:underline"
                    >
                      #{hashtags[4].name}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div ref={outsideClickRef}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsHashtagsOpen(!isHashtagsOpen);
                    }}
                    className="text-xs text-left text-gray-700 focus:outline-none"
                  >
                    <span className="mr-1">See All</span>
                    <FontAwesomeIcon icon={faCaretDown} />
                  </button>
                  <div
                    className={`${
                      isHashtagsOpen ? "block" : "hidden"
                    } absolute z-10 w-48 -ml-36 px-2 py-2 flex flex-wrap bg-gray-50 border border-gray-200 rounded-md text-sm font-body leading-tight text-gray-600`}
                  >
                    {hashtags.map((hashtag) => (
                      <div
                        key={hashtag.id}
                        onClick={() => {
                          props.setQuery({ search: hashtags[4].name });
                          props.setSearchInput(hashtags[4].name);
                          window.scrollTo(0, 0);
                        }}
                        className="inline-block cursor-pointer mr-1.5 hover:text-gray-800 hover:underline"
                      >
                        #{hashtag.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {isLiveExpired ? (
              <p className="text-xs text-red-500 font-body">Expired</p>
            ) : (
              <Timer
                setIsLiveExpired={setIsLiveExpired}
                liveEnd={live.expires_at}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div key={live.id} className="flex mx-3 w-64">
        <div className="relative w-16 h-16">
          <div
            className={`h-16 w-16 flex justify-center place-items-center rounded-full border-4 border-gray-300 text-gray-800`}
          ></div>
        </div>
      </div>
    );
  }
}

export default function EditLive(props) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  return (
    <div key={props.live.id} className="relative flex place-items-start">
      <Live live={props.live} />
      <button
        onClick={(e) => {
          e.preventDefault();
          setEditModalIsOpen(true);
        }}
        className="ml-7 text-lg text-gray-500 hover:text-primary-blue focus:outline-none"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsConfirmDeleteOpen(true);
        }}
        className="ml-2 text-lg text-gray-500 hover:text-primary-red focus:outline-none"
      >
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
      <EditLiveModalContainer
        getUserAccountData={props.getUserAccountData}
        live={props.live}
        editModalIsOpen={editModalIsOpen}
        setEditModalIsOpen={setEditModalIsOpen}
      />
      <DeleteLiveModal
        getUserAccountData={props.getUserAccountData}
        live={props.live}
        isConfirmDeleteOpen={isConfirmDeleteOpen}
        setIsConfirmDeleteOpen={setIsConfirmDeleteOpen}
      />
    </div>
  );
}

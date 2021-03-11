import React, { useState, useRef, useEffect } from "react";
import useOutsideAlerter from "../hooks/outside-alerter.js";
import useDataApi from "../hooks/data-api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faSearch,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import FeaturedLive from "./featured-live.js";

function SearchBar() {
  const dropdownCategories = [
    "All Platforms",
    "TikTok",
    "Instagram",
    "Youtube",
    "Facebook",
    "Twitch",
  ];

  const [hashtags, setHashtags] = useState("");
  const [hashtagsList, setHashtagsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    dropdownCategories[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const outsideClickRef = useRef(null);

  useOutsideAlerter(outsideClickRef, () => {
    setIsDropdownOpen(false);
  });

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

    alert(`Search for hashtags: ${[...hashtagsList]}`);
  };

  return (
    <div className="max-w-4xl w-full mt-4 mb-24 shadow-lg">
      <form onSubmit={handleSubmit} className="flex">
        <div className="px-6 flex place-items-center bg-gray-800 rounded-l-md font-body font-semibold text-lg text-gray-200">
          Search
        </div>
        <div className="px-4 py-2 flex-grow flex place-items-center bg-gray-50 border-t border-b border-gray-200 font-body font-semibold text-gray-800 focus:outline-none">
          {hashtagsList.map((hashtag) => (
            <div
              key={hashtag}
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
            className="flex-grow bg-gray-50 focus:outline-none"
          />
        </div>
        <div className="float-right font-body" ref={outsideClickRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="w-44 pr-4 py-2 flex place-items-center bg-gray-50 border-t border-b border-gray-200 font-semibold tracking-wide text-gray-800 focus:outline-none"
          >
            <span className="flex-grow pl-5 py-1 border-l border-gray-500 text-left">
              {selectedCategory}
            </span>
            <span className="float-right ml-2">
              <FontAwesomeIcon icon={faCaretDown} color="#2C363F" />
            </span>
          </button>
          <div
            className={`absolute z-10 w-44 py-1 px-1 flex flex-col ${
              isDropdownOpen ? "block" : "hidden"
            } bg-gray-50 rounded-b-md shadow-inner border border-gray-200`}
          >
            {dropdownCategories.map((category) => (
              <button
                key={category}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category);
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className={`text-left my-px px-4 py-2 ${
                  selectedCategory === category
                    ? "bg-gray-600 text-gray-100"
                    : "text-gray-800"
                } hover:bg-gray-600 hover:text-gray-100 rounded-md font-semibold tracking-wide focus:outline-none`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-3 py-2 bg-red-700 rounded-r-md text-2xl focus:outline-none"
        >
          <FontAwesomeIcon icon={faSearch} color="#F4F4F5" />
        </button>
      </form>
    </div>
  );
}

function FeaturedSection(props) {
  const featuredLives = props.featuredLives;
  // const [featuredIdList, setFeaturedIdList] = useState([]);
  // const [shownFeaturedLiveComponents, setFeaturedLiveComponents] = useState([]);
  const [startingIndex, setStartingIndex] = useState(0);
  const allFeaturedLiveComponents = [];
  const numberOfShownLives = 5;

  featuredLives.forEach((featuredLive) => {
    allFeaturedLiveComponents.push(<FeaturedLive live={featuredLive} />);
  });

  function handleForwardClick(e) {
    e.preventDefault();
    if (startingIndex + numberOfShownLives < allFeaturedLiveComponents.length) {
      setStartingIndex(startingIndex + 1);
    }
  }

  function handleBackwardClick(e) {
    e.preventDefault();
    if (startingIndex > 0) {
      setStartingIndex(startingIndex - 1);
    }
  }

  return (
    <div className="w-full">
      <h1 className="mb-10 uppercase text-center tracking-wide font-semibold font-body text-2xl">
        Featured
      </h1>
      <div className="flex justify-center place-items-center">
        <button
          onClick={handleBackwardClick}
          className="text-gray-400 hover:text-gray-600 text-lg transition duration-100 focus:outline-none"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-3" />
        </button>
        {[
          ...allFeaturedLiveComponents.slice(
            startingIndex,
            startingIndex + numberOfShownLives
          ),
        ]}
        <button
          onClick={handleForwardClick}
          className="text-gray-400 hover:text-gray-600 text-lg transition duration-100 focus:outline-none"
        >
          <FontAwesomeIcon icon={faChevronRight} className="ml-3" />
        </button>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const [querySearchString, setQuerySearchString] = useState("");
  const [lives, setLives] = useState([]);
  const [featuredLives, setFeaturedLives] = useState([]);

  const [state] = useDataApi(`/lives?${querySearchString}`);

  useEffect(() => {
    console.log(state.data);
    let featuredLives = [];

    if (state.data) {
      setLives([...state.data]);

      for (const live of state.data) {
        live.is_featured && featuredLives.push(live);
      }

      setFeaturedLives([...featuredLives]);
    }
    return () => {};
  }, [state, setLives]);

  return (
    <div
      className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-red-100 to-gray-50`}
    >
      <SearchBar />
      <FeaturedSection featuredLives={featuredLives} />
    </div>
  );
}

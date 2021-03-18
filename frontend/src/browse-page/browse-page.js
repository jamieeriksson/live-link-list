import React, { useState, useRef, useEffect } from "react";
import useOutsideAlerter from "../hooks/outside-alerter.js";
import useDataApi from "../hooks/data-api.js";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faSearch,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Live from "./individual-live.js";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faTwitch,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

function SearchBar(props) {
  const dropdownCategories = [
    "All Platforms",
    "TikTok",
    "Instagram",
    "Youtube",
    "Facebook",
    "Twitch",
  ];
  const mobileDropdownCategories = [
    "All",
    <FontAwesomeIcon icon={faTiktok} />,
    <FontAwesomeIcon icon={faInstagram} />,
    <FontAwesomeIcon icon={faYoutube} />,
    <FontAwesomeIcon icon={faFacebook} />,
    <FontAwesomeIcon icon={faTwitch} />,
  ];
  const setQuery = props.setQuery;

  const [hashtags, setHashtags] = useState("");
  const [hashtagsList, setHashtagsList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    window.innerWidth <= 768
      ? mobileDropdownCategories[0]
      : dropdownCategories[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const outsideClickRef = useRef(null);

  useOutsideAlerter(outsideClickRef, () => {
    setIsDropdownOpen(false);
  });

  useEffect(() => {
    const handleResize = () => {
      let categoryIndex = 0;

      if (selectedCategory in dropdownCategories) {
        categoryIndex = dropdownCategories.indexOf(selectedCategory);
      } else {
        categoryIndex = mobileDropdownCategories.indexOf(selectedCategory);
      }

      if (window.innerWidth <= 768) {
        setSelectedCategory(mobileDropdownCategories[categoryIndex]);
      } else {
        setSelectedCategory(dropdownCategories[categoryIndex]);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
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
    let search = searchInput;

    if (searchInput.slice(0, 1) === "@" || searchInput.slice(0, 1) === "#") {
      search = searchInput.slice(1);
    }

    if (selectedCategory !== "All" && selectedCategory !== "All Platforms") {
      setQuery({
        search: search,
        platform: selectedCategory,
      });
    } else {
      setQuery({
        search: search,
      });
    }
  };

  return (
    <div className="max-w-4xl w-full mt-4 mb-24 shadow-lg">
      <form onSubmit={handleSubmit} className="flex">
        <div className="hidden px-6 md:flex place-items-center bg-gray-800 rounded-l-md font-body font-semibold text-lg text-gray-200">
          Search
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="enter a hashtag or username"
          className="px-4 py-2 flex place-items-center flex-grow bg-gray-50 focus:outline-none"
        />

        <div className="float-right font-body" ref={outsideClickRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="md:w-44 h-full pr-4 py-2 flex place-items-center justify-center bg-gray-50 border-t border-b border-gray-200 font-semibold tracking-wide text-gray-800 focus:outline-none"
          >
            <span className="flex-grow h-full flex place-items-center pl-3 md:pl-5 py-1 border-l border-gray-500 text-left">
              {selectedCategory}
            </span>
            <span className="float-right ml-2">
              <FontAwesomeIcon icon={faCaretDown} color="#2C363F" />
            </span>
          </button>
          <div
            className={`absolute hidden z-10 w-44 py-1 px-1 flex-col ${
              isDropdownOpen ? "md:flex" : ""
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
          <div
            className={`absolute md:hidden z-10 py-1 px-1 flex flex-col ${
              isDropdownOpen ? "flex" : "hidden"
            } bg-gray-50 rounded-b-md shadow-inner border border-gray-200`}
          >
            {mobileDropdownCategories.map((category) => (
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
  const [numberOfShownLives, setNumberOfShownLives] = useState(
    window.innerWidth <= 768 ? 1 : 3
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setNumberOfShownLives(1);
      } else if (window.innerWidth > 768 && window.innerWidth <= 1330) {
        setNumberOfShownLives(3);
      } else if (window.innerWidth > 1330 && window.innerWidth <= 1667) {
        setNumberOfShownLives(4);
      } else {
        setNumberOfShownLives(5);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  featuredLives.forEach((featuredLive) => {
    allFeaturedLiveComponents.push(
      <div className="mx-1 md:mx-3">
        <Live live={featuredLive} />
      </div>
    );
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
    <div className="mb-16 pb-16 px-4 border-b border-gray-400">
      <h1 className="mb-8 uppercase text-center tracking-wide font-semibold font-body text-2xl">
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

function LivesSection(props) {
  const lives = props.lives;

  return (
    <div className="max-w-8xl w-full">
      <h1 className="mb-8 uppercase text-center tracking-wide font-semibold font-body text-2xl">
        All Lives
      </h1>
      <div className="flex flex-wrap justify-center place-items-center">
        {lives.map((live) => (
          <div className="mx-8 mb-5 pb-5 border-b border-gray-200">
            <Live live={live} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const [query, setQuery] = useState({});
  const [querySearchString, setQuerySearchString] = useState("");
  const [lives, setLives] = useState([]);
  const [featuredLives, setFeaturedLives] = useState([]);

  const [state] = useDataApi(`/lives?${querySearchString}`);

  useEffect(() => {
    console.log(state.data);
    let featuredLives = [];

    if (state.data && state.data.length > 0) {
      setLives([...state.data]);

      for (const live of state.data) {
        live.is_featured && featuredLives.push(live);
      }

      setFeaturedLives([...featuredLives]);
    }
    return () => {};
  }, [state, setLives]);

  useEffect(() => {
    console.log("[useEffect] SEARCH PAGE: parse url query");
    if (window.location.search) {
      const initialQuery = queryString.parse(window.location.search);
      setQuery(initialQuery);
    }
    return () => {
      console.log("[useEffect] SEARCH PAGE: clean up parse url query");
    };
  }, []);

  useEffect(() => {
    console.log("[useEffect] SEARCH PAGE: set url query");
    const newQuerySearchString = queryString.stringify(query);

    setQuerySearchString(newQuerySearchString);

    const { protocol, pathname, host } = window.location;
    const newUrl = `${protocol}//${host}${pathname}?${newQuerySearchString}`;
    window.history.pushState({}, "", newUrl);

    return () => {
      console.log("[useEffect] SEARCH PAGE: clean up set url query");
    };
  }, [query]);

  return (
    <div
      className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-red-100 via-gray-50 to-gray-50`}
    >
      <SearchBar setQuery={setQuery} />
      <FeaturedSection featuredLives={featuredLives} />
      <LivesSection lives={lives} />
    </div>
  );
}

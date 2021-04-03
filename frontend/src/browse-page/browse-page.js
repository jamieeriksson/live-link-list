import React, { useState, useRef, useEffect } from "react";
import useOutsideAlerter from "../utilities/outside-alerter.js";
import useDataApi from "../utilities/data-api.js";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faSearch,
  faChevronLeft,
  faChevronRight,
  faSpinner,
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
    { name: "All Platforms", mobile: "All" },
    { name: "TikTok", mobile: <FontAwesomeIcon icon={faTiktok} /> },
    { name: "Instagram", mobile: <FontAwesomeIcon icon={faInstagram} /> },
    { name: "Youtube", mobile: <FontAwesomeIcon icon={faYoutube} /> },
    { name: "Facebook", mobile: <FontAwesomeIcon icon={faFacebook} /> },
    { name: "Twitch", mobile: <FontAwesomeIcon icon={faTwitch} /> },
  ];
  const query = props.query;
  const setQuery = props.setQuery;
  const searchInput = props.searchInput;
  const setSearchInput = props.setSearchInput;
  const [selectedCategory, setSelectedCategory] = useState(
    dropdownCategories[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const outsideClickRef = useRef(null);

  useOutsideAlerter(outsideClickRef, () => {
    setIsDropdownOpen(false);
  });

  useEffect(() => {
    if (query.platform) {
      setSelectedCategory(
        dropdownCategories.find((category) => category.name === query.platform)
      );
    }

    return () => {};
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let search = searchInput;

    if (searchInput.slice(0, 1) === "@" || searchInput.slice(0, 1) === "#") {
      search = searchInput.slice(1);
    }

    if (selectedCategory.name !== "All Platforms") {
      setQuery({
        search: search,
        platform: selectedCategory.name,
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
          className="px-4 py-2 flex place-items-center flex-grow bg-gray-50 border-t border-b border-l rounded-l-md border-gray-200 focus:outline-none"
        />

        <div className="float-right font-body" ref={outsideClickRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="md:w-44 h-full pr-4 py-2 flex place-items-center justify-center bg-gray-50 border-t border-b border-gray-200 font-semibold tracking-wide text-gray-800 focus:outline-none"
          >
            <span className="hidden flex-grow h-full md:flex place-items-center pl-3 md:pl-5 py-1 border-l border-gray-500 text-left">
              {selectedCategory.name}
            </span>
            <span className="flex-grow h-full flex md:hidden place-items-center pl-3 md:pl-5 py-1 border-l border-gray-500 text-left">
              {selectedCategory.mobile}
            </span>
            <span className="float-right ml-2">
              <FontAwesomeIcon icon={faCaretDown} color="#2C363F" />
            </span>
          </button>
          <div
            className={`absolute z-10 md:w-44 py-1 px-1 flex-col ${
              isDropdownOpen ? "flex" : "hidden"
            } bg-gray-50 rounded-b-md shadow-inner border border-gray-200`}
          >
            {dropdownCategories.map((category) => (
              <button
                key={category.name}
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
                <span className="hidden md:inline-block">{category.name}</span>
                <span className="inline-block md:hidden">
                  {category.mobile}
                </span>
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
  const query = props.query;

  return (
    <div>
      {props.status === "fetching" ? (
        <FontAwesomeIcon icon={faSpinner} size="2x" spin />
      ) : (
        <div className="max-w-8xl w-full">
          <h1 className="mb-8 uppercase text-center tracking-wide font-semibold font-body text-2xl">
            All Lives
          </h1>
          {lives.length > 0 ? (
            <div className="flex flex-wrap justify-center place-items-center">
              {lives.map((live) => (
                <div
                  key={live.id}
                  className="mx-8 mb-5 pb-5 border-b border-gray-200"
                >
                  <Live
                    setSearchInput={props.setSearchInput}
                    setQuery={props.setQuery}
                    live={live}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="flex flex-wrap justify-center place-items-center">
              No lives are currently posted
              {query.search ? ` for ${query.search}` : ""}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  const [query, setQuery] = useState({});
  const [querySearchString, setQuerySearchString] = useState("");
  const [lives, setLives] = useState([]);
  const [featuredLives, setFeaturedLives] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const [state] = useDataApi(`/lives?${querySearchString}`);

  useEffect(() => {
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

  useEffect(() => {
    if (window.location.search) {
      const initialQuery = queryString.parse(window.location.search);
      setQuery(initialQuery);
    }
    return () => {};
  }, []);

  useEffect(() => {
    const newQuerySearchString = queryString.stringify(query);

    setQuerySearchString(newQuerySearchString);

    const { protocol, pathname, host } = window.location;
    const newUrl = `${protocol}//${host}${pathname}?${newQuerySearchString}`;
    window.history.pushState({}, "", newUrl);

    return () => {};
  }, [query]);

  if (state.status === "error") {
    return (
      <div
        className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-red-100 via-gray-50 to-gray-50`}
      >
        <SearchBar
          query={query}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setQuery={setQuery}
        />
        <p className="mb-16 px-4 text-body text-lg text-center font-semibold tracking-wide">
          So sorry, there was an error retrieving lives.
          <br />
          Please try again.
        </p>
      </div>
    );
  }
  return (
    <div
      className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col place-items-center font-body bg-gradient-to-t from-red-100 via-gray-50 to-gray-50`}
    >
      <div className="px-3">
        <SearchBar
          query={query}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setQuery={setQuery}
        />
      </div>
      {featuredLives.length > 0 ? (
        <FeaturedSection featuredLives={featuredLives} />
      ) : (
        ""
      )}
      <LivesSection
        status={state.status}
        query={query}
        setQuery={setQuery}
        setSearchInput={setSearchInput}
        lives={lives}
      />
    </div>
  );
}

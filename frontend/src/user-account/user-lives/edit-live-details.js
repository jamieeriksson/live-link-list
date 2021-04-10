import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import useOutsideAlerter from "../../utilities/outside-alerter";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const durationOptions = [
  {
    duration: "0 minutes",
    postDuration: "00:00:00",
    cost: 0,
  },
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

export default function LiveDetails(props) {
  const hashtags = props.hashtags;
  const hashtagsList = props.hashtagsList;
  const setHashtagsList = props.setHashtagsList;
  const removeHashtag = props.removeHashtag;
  const setHashtags = props.setHashtags;
  const addHashtag = props.addHashtag;
  const description = props.description;
  const setDescription = props.setDescription;
  const addDuration = props.addDuration;
  const setAddDuration = props.setAddDuration;
  const descMaxLength = props.descMaxLength;

  const [isLinkDurationOpen, setIsLinkDurationOpen] = useState(false);
  const [descriptionChars, setDescriptionChars] = useState(description.length);

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
        <p className="mt-1 text-right text-sm font-body text-red-500">
          {props.errors.hashtags}
        </p>
      </div>

      <div className="w-full mt-8 flex flex-col">
        <span className="mb-1">
          <span className="uppercase text-xl">Description</span>
          <span
            className={`ml-3 ${
              descriptionChars > descMaxLength ? "text-red-500" : ""
            }`}
          >
            {descriptionChars}/100
          </span>
        </span>
        <textarea
          placeholder="enter short description for your live"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionChars(e.target.value.length);
          }}
          className="w-full h-24 px-2 py-1 ring-1 ring-gray-200 rounded-md shadow-sm bg-white focus:outline-none"
        />
        <p className="mt-1 text-right text-sm font-body text-red-500">
          {props.errors.description}
        </p>
      </div>

      <div className="mt-8 flex justify-center place-items-center">
        <span className="mr-4 mb-1 text-xl uppercase">Add Time to link:</span>
        <div ref={outsideClickDurationRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLinkDurationOpen(!isLinkDurationOpen);
            }}
            className="w-48 px-3 py-1 flex place-items-center ring-1 ring-gray-200 rounded-md shadow-sm bg-white focus:outline-none"
          >
            <span className="flex-grow text-left text-lg">
              {addDuration.duration}
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
                  setAddDuration(option);
                  setIsLinkDurationOpen(!isLinkDurationOpen);
                }}
                className="w-48 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-gray-100 focus:outline-none"
              >
                <span className="float-left text-xl font-light">
                  {option.duration}
                </span>
                <span className="float-right text-xl font-medium">
                  {option.cost === 0 ? "Free" : "$" + option.cost}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { PlatformContext } from "../utilities/platformContext";

export default function LinkInput(props) {
  const [isPlatformSelectOpen, setIsPlatformSelectOpen] = useState(false);

  const platformOptions = useContext(PlatformContext);
  const selectedPlatform = props.selectedPlatform;
  const setSelectedPlatform = props.setSelectedPlatform;
  const urlInput = props.urlInput;
  const setUrlInput = props.setUrlInput;
  const handleUrlChange = props.handleUrlChange;

  const username = props.username;
  const setUsername = props.setUsername;
  const user = props.user;

  useEffect(() => {
    checkPaste();

    return () => {};
  }, []);

  useEffect(() => {
    if (user.user) {
      console.log(user.user[`${selectedPlatform.name.toLowerCase()}_username`]);
      setUsername(user.user[`${selectedPlatform.name.toLowerCase()}_username`]);
    }

    return () => {};
  }, [user]);

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    setIsPlatformSelectOpen(!isPlatformSelectOpen);
    setUrlInput("");
    if (user.user) {
      console.log(user.user[`${platform.name.toLowerCase()}_username`]);
      setUsername(user.user[`${platform.name.toLowerCase()}_username`]);
    }
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
    <div className="w-full px-3 flex flex-col justify-center place-items-center">
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
      <p className="max-w-xl w-full mt-1 mr-6 text-right text-sm font-body text-red-500">
        {props.errors.urlInput}
      </p>

      <div className="mt-8 max-w-sm w-full flex">
        <span className="mr-3 text-xl uppercase">Username</span>
        <div className="flex-grow inline px-2 py-1 rounded-md ring-1 ring-gray-200 shadow-sm bg-white">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="optional"
            className="w-full bg-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

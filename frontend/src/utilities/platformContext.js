import React, { createContext, useEffect, useState } from "react";
import useDataApi from "./data-api.js";
import {
  faInstagram,
  faTiktok,
  faFacebook,
  faYoutube,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";

export const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [platformOptions, setPlatformOptions] = useState([
    {
      name: "TikTok",
      icon: faTiktok,
      urlStart: "https://vm.tiktok.com/",
      urlStartDesktop: "https://www.tiktok.com/",
      placeholder: "xxxxxxxxx",
      placeholderDesktop: "@username/live",
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
      urlStart: "https://youtu.be/",
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
  ]);
  const [state] = useDataApi("platforms");

  useEffect(() => {
    let platforms = [...platformOptions];

    if (state.status === "success") {
      for (const platform of state.data) {
        for (const option of platforms) {
          if (option.name === platform.name) {
            option.id = platform.id;
          }
        }
      }
    }

    setPlatformOptions([...platforms]);

    return () => {};
  }, [state]);

  return (
    <PlatformContext.Provider value={platformOptions}>
      {children}
    </PlatformContext.Provider>
  );
};

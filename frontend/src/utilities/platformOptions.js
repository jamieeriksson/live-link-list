import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faTiktok,
  faFacebook,
  faYoutube,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";

export const platformOptions = [
  {
    id: "ea04def8-bdd6-4703-ad90-6274cc74c382",
    name: "TikTok",
    icon: faTiktok,
    urlStart: "https://vm.tiktok.com/",
    urlStartDesktop: "https://www.tiktok.com/",
    placeholder: "xxxxxxxxx",
    placeholderDesktop: "@username/live",
    color: "indigo",
  },
  {
    id: "2dafddf1-a189-42a2-96ca-d826576aec70",
    name: "Instagram",
    icon: faInstagram,
    urlStart: "https://www.instagram.com/",
    placeholder: "username/live",
    color: "pink",
  },
  {
    id: "c2ab523a-02c9-44da-a203-cf2e3e5b94ef",
    name: "Youtube",
    icon: faYoutube,
    urlStart: "https://youtu.be/",
    placeholder: "5qap5aO4i9A",
    color: "red",
  },
  {
    id: "f9d6ded9-0c36-4fbd-8c72-0890e4038e87",
    name: "Facebook",
    icon: faFacebook,
    urlStart: "https://fb.watch/",
    placeholder: "3WERq5mV2x",
    color: "blue",
  },
  {
    id: "e020e299-47a6-4be6-a3b2-daa605a930a8",
    name: "Twitch",
    icon: faTwitch,
    urlStart: "https://www.twitch.tv/",
    placeholder: "username",
    color: "purple",
  },
];

import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./userContext";
import axios from "axios";

export default function RegisterPage() {
  let user = useContext(UserContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tikTok, setTikTok] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitch, setTwitch] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});

  const history = useHistory();

  const createUser = async () => {
    console.log("creating user");
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const createUserUrl = new URL("/users", urlHost);

    try {
      const response = await axios.post(createUserUrl, {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        email: email,
        password: password,
        tiktok_username: tikTok,
        instagram_username: instagram,
        youtube_username: youtube,
        facebook_username: facebook,
        twitch_username: twitch,
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const loginUser = async () => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const loginUrl = new URL("/log-in", urlHost);

    try {
      const response = await axios.post(loginUrl, {
        email: email,
        password: password,
      });

      console.log(response);

      const date = Date.now();
      const expiration = new Date(date);
      expiration.setDate(expiration.getDate() + 14);

      user.setUser(response.data["user"].id);
      localStorage.setItem("refresh_token", response.data["refresh"]);
      localStorage.setItem("access_token", response.data["access"]);
      localStorage.setItem("user", response.data["user"].id);
      localStorage.setItem("expiration", expiration);
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrors({});
    let errors = {};

    if (!firstName) {
      errors = {
        firstName: "Enter a first name.",
        ...errors,
      };
    }

    if (!lastName) {
      errors = {
        lastName: "Enter a last name.",
        ...errors,
      };
    }

    if (!email) {
      errors = {
        email: "Enter an email.",
        ...errors,
      };
    }

    if (!password) {
      errors = {
        password: "Enter a password.",
        ...errors,
      };
    }

    if (!passwordConfirm) {
      errors = {
        passwordConfirm: "Confirm your password.",
        ...errors,
      };
    } else if (password !== passwordConfirm)
      errors = {
        passwordConfirm: "Passwords do not match.",
        ...errors,
      };

    console.log(errors);
    if (Object.keys(errors).length === 0) {
      await createUser();
      loginUser();
    } else {
      setErrors({ ...errors });
      window.scrollTo(0, 0);
    }
  };

  if (user.user) {
    return (
      <div
        className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
      >
        <div
          className={`max-w-xl w-full mx-3 my-3 pb-14 pt-14 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
        >
          <h1 className="w-full mb-14 text-center font-title tracking-wider text-2xl md:text-3xl">
            {user.name} is logged in
          </h1>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`max-w-screen w-full h-screen md:mt-5 px-1 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
      >
        <div
          className={`max-w-xl w-full mx-3 my-3 pb-14 pt-14 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
        >
          <h1 className="w-full mb-14 text-center font-title tracking-wider text-2xl md:text-3xl">
            Sign Up
          </h1>
          <form className="max-w-md w-full">
            <div className="mb-5">
              <div className="flex place-items-center">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  First Name
                  <span className="ml-0.5 text-primary-red text-base">*</span>
                </p>
                <input
                  type="text"
                  placeholder="first"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
              </div>
              <p className="mt-1 text-right text-sm font-body text-red-500">
                {errors.firstName}
              </p>
            </div>
            <div className="mb-5">
              <div className="flex place-items-center">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Last Name
                  <span className="ml-0.5 text-primary-red text-base">*</span>
                </p>
                <input
                  type="text"
                  placeholder="last"
                  onChange={(e) => setLastName(e.target.value)}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
                <p className="mt-1 text-right text-sm font-body text-red-500">
                  {errors.lastName}
                </p>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex place-items-center">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Email
                  <span className="ml-0.5 text-primary-red text-base">*</span>
                </p>
                <input
                  type="text"
                  placeholder="email@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
                <p className="mt-1 text-right text-sm font-body text-red-500">
                  {errors.email}
                </p>
              </div>
            </div>
            <div className="flex place-items-center mb-5">
              <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                Phone Number
              </p>
              <input
                type="text"
                placeholder="123-456-7890"
                onChange={(e) => setPhone(e.target.value)}
                className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
              />
            </div>

            <div className="flex flex-col my-7 pt-5 pb-3 border-t border-b border-gray-300">
              <h2 className="mb-5 text-lg text-center tracking-wide">
                Social Media Usernames
              </h2>
              <div className="flex place-items-center mb-5">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  TikTok
                </p>
                <input
                  type="text"
                  placeholder="username"
                  onChange={(e) => {
                    if (e.target.value.slice(0, 1) === "@") {
                      setTikTok(e.target.value.slice(1));
                    } else {
                      setTikTok(e.target.value);
                    }
                  }}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
              </div>
              <div className="flex place-items-center mb-5">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Instagram
                </p>
                <input
                  type="text"
                  placeholder="username"
                  onChange={(e) => {
                    if (e.target.value.slice(0, 1) === "@") {
                      setInstagram(e.target.value.slice(1));
                    } else {
                      setInstagram(e.target.value);
                    }
                  }}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
              </div>
              <div className="flex place-items-center mb-5">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Youtube
                </p>
                <input
                  type="text"
                  placeholder="username"
                  onChange={(e) => {
                    if (e.target.value.slice(0, 1) === "@") {
                      setYoutube(e.target.value.slice(1));
                    } else {
                      setYoutube(e.target.value);
                    }
                  }}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
              </div>
              <div className="flex place-items-center mb-5">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Facebook
                </p>
                <input
                  type="text"
                  placeholder="username"
                  onChange={(e) => {
                    if (e.target.value.slice(0, 1) === "@") {
                      setFacebook(e.target.value.slice(1));
                    } else {
                      setFacebook(e.target.value);
                    }
                  }}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
              </div>
              <div className="flex place-items-center mb-5">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Twitch
                </p>
                <input
                  type="text"
                  placeholder="username"
                  onChange={(e) => {
                    if (e.target.value.slice(0, 1) === "@") {
                      setTwitch(e.target.value.slice(1));
                    } else {
                      setTwitch(e.target.value);
                    }
                  }}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-5">
              <div className="flex place-items-center">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Password
                  <span className="ml-0.5 text-primary-red text-base">*</span>
                </p>
                <input
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
                <p className="mt-1 text-right text-sm font-body text-red-500">
                  {errors.password}
                </p>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex place-items-center">
                <p className="w-32 mr-5 font-title font-light tracking-wider text-lg text-right whitespace-nowrap">
                  Confirm Password
                  <span className="ml-0.5 text-primary-red text-base">*</span>
                </p>
                <input
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
                />
                <p className="mt-1 text-right text-sm font-body text-red-500">
                  {errors.passwordConfirm}
                </p>
              </div>
            </div>
          </form>
          <button
            type="submit"
            onClick={handleLogin}
            className="mt-10 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
          >
            <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
              Register Account
            </span>
          </button>
        </div>
      </div>
    );
  }
}

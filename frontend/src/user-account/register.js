import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { getUserAccountData, UserContext } from "../utilities/userContext";
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
    } catch (error) {
      if (error.response.data) {
        let errorObj = {};

        for (const [key, value] of Object.entries(error.response.data)) {
          if (
            key === "email" &&
            value[0] === "user with this email already exists."
          ) {
            errorObj.register =
              "A user account with this email already exists.";
          } else {
            errorObj[key] = value[0];
          }
        }
        setErrors({ ...errorObj });
        window.scrollTo(0, 0);
      }

      console.log(error.response.data);
      console.log(error.response.data["detail"]);
      console.log(error.response.data.detail);
      console.log(error);
      console.log(error.message);
      console.log(error.request);
      console.log(error.config);
      console.log(error.stack);
    }
  };

  const sendConfirmEmail = async () => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const url = new URL("/send-confirm-email", urlHost);

    try {
      const response = await axios.post(url, {
        email: email,
      });
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.data["detail"]);
      console.log(error.response.data.detail);
      console.log(error);
      console.log(error.message);
      console.log(error.request);
      console.log(error.config);
      console.log(error.stack);
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

      const date = Date.now();
      const expiration = new Date(date);
      expiration.setDate(expiration.getDate() + 14);

      localStorage.setItem("refresh_token", response.data["refresh"]);
      localStorage.setItem("access_token", response.data["access"]);
      localStorage.setItem("user", response.data["user"].id);
      localStorage.setItem("expiration", expiration);

      const userData = await getUserAccountData();
      userData["logged_in"] = true;
      user.setUser({ ...userData });

      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    let newErrors = {};

    if (!firstName) {
      newErrors = {
        firstName: "Enter a first name.",
        ...newErrors,
      };
    }

    if (!lastName) {
      newErrors = {
        lastName: "Enter a last name.",
        ...newErrors,
      };
    }

    if (!email) {
      newErrors = {
        email: "Enter an email.",
        ...newErrors,
      };
    }

    if (!password) {
      newErrors = {
        password: "Enter a password.",
        ...newErrors,
      };
    }

    if (!passwordConfirm) {
      newErrors = {
        passwordConfirm: "Confirm your password.",
        ...newErrors,
      };
    } else if (password !== passwordConfirm) {
      newErrors = {
        passwordConfirm: "Passwords do not match.",
        ...newErrors,
      };
    }

    console.log(newErrors);
    setErrors({ ...newErrors });

    if (Object.keys(newErrors).length === 0) {
      await createUser();
      await sendConfirmEmail();
      loginUser();
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const url = new URL("/log-out", urlHost);

    try {
      const response = await axios.post(url, {
        refresh: localStorage.getItem("refresh_token"),
      });

      user.setUser();
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };

  if (user.user && user.user["logged_in"]) {
    return (
      <div
        className={`max-w-screen w-full min-h-screen h-full md:mt-5 px-1 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
      >
        <div className="h-36 w-full"></div>
        <div
          className={`max-w-xl w-full mx-3 my-3 pb-14 pt-14 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
        >
          <h1 className="w-full text-center font-title tracking-wider text-2xl md:text-3xl">
            You are already logged in.
          </h1>
          <p
            onClick={handleLogout}
            className="mt-5 cursor-pointer text-primary-blue hover:underline"
          >
            Logout to switch accounts
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`max-w-screen w-full min-h-screen md:mt-5 px-1 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
      >
        <div className="h-36 w-full"></div>
        <div
          className={`max-w-xl w-full mx-3 my-3 pb-14 pt-14 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
        >
          <h1 className="w-full mb-14 text-center font-title tracking-wider text-2xl md:text-3xl">
            Sign Up
          </h1>
          <form className="max-w-md w-full">
            {"register" in errors ? (
              <p className="mb-14 px-5 py-4 self-center border border-red-300 shadow-md rounded-md bg-red-100 text-center font-body">
                {errors.register}
                <a
                  href="/login"
                  className="mt-1 block text-blue-800 hover:text-blue-700 hover:underline"
                >
                  Login here
                </a>
              </p>
            ) : (
              ""
            )}
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
              </div>
              <p className="mt-1 text-right text-sm font-body text-red-500">
                {errors.lastName}
              </p>
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
              </div>
              <p className="mt-1 text-right text-sm font-body text-red-500">
                {errors.email}
              </p>
            </div>
            <div className="mb-5">
              <div className="flex place-items-center">
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
              <p className="mt-1 text-right text-sm font-body text-red-500">
                {errors.phone_number}
              </p>
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
              </div>
              <p className="mt-1 text-right text-sm font-body text-red-500">
                {errors.password}
              </p>
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
              </div>
              <p className="mt-1 text-right text-sm font-body text-red-500">
                {errors.passwordConfirm}
              </p>
            </div>
          </form>

          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              setErrors({});

              handleLogin();
            }}
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

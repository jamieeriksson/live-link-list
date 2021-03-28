import { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { UserContext } from "../utilities/userContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let user = useContext(UserContext);

  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();

    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const url = new URL("/log-in", urlHost);

    try {
      const response = await axios.post(url, {
        email: email,
        password: password,
      });

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

  if (user.user) {
    return (
      <div
        className={`max-w-screen w-full h-screen md:mt-5 px-1 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
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
          className={`max-w-lg w-full mx-3 my-3 pb-14 pt-14 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
        >
          <h1 className="w-full mb-10 text-center font-title tracking-wider text-2xl md:text-3xl">
            Login
          </h1>
          <form className="max-w-xs w-full flex flex-col">
            <div className="flex place-items-center mb-5">
              <input
                type="text"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
              />
            </div>
            <div className="flex place-items-center">
              <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                className="py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
              />
            </div>
            <button
              type="submit"
              onClick={handleLogin}
              className="mt-10 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
                Login
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

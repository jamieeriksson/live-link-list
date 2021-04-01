import { useState, useContext } from "react";
import { UserContext } from "../utilities/userContext";
import axios from "axios";

export default function ForgotPassword() {
  let user = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const sendEmail = async () => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const url = new URL("/password-reset", urlHost);

    try {
      const response = await axios.post(url, {
        email: email,
      });
      alert("Email sent!");
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

  const handleReset = async (e) => {
    e.preventDefault();

    setErrors({});
    let newErrors = {};

    if (!email) {
      newErrors = {
        email: "You must enter an email.",
        ...newErrors,
      };
    }

    if (Object.keys(newErrors).length === 0) {
      await sendEmail();
    } else {
      setErrors({ ...newErrors });
      window.scrollTo(0, 0);
    }
  };

  if (user.user) {
    return (
      <div
        className={`max-w-screen w-full min-h-screen md:mt-5 px-1 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
      >
        {/* <div className="h-36 w-full"></div> */}

        <div
          className={`max-w-xl w-full mx-3 my-3 pb-14 pt-14 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
        >
          <h1 className="w-full text-center font-title tracking-wider text-2xl md:text-3xl">
            You are already logged in.
          </h1>
          <p className="mt-5 cursor-pointer text-primary-blue hover:underline">
            <a href="/account">View account details</a>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`max-w-screen w-full min-h-screen md:mt-5 px-1 pb-20 flex flex-col justify-center place-items-center font-body bg-gradient-to-t from-red-100 via-red-100 to-gray-50`}
      >
        {/* <div className="h-36 w-full"></div> */}

        <div
          className={`max-w-lg w-full mx-3 my-3 pb-14 pt-14 md:-mt-44 flex flex-col justify-center place-items-center border-transparent rounded-lg md:rounded-2xl bg-gray-100 shadow-lg border border-gray-200`}
        >
          <h1 className="w-full mb-10 text-center font-title tracking-wider text-2xl md:text-3xl">
            Forgot Password
          </h1>
          <form className="max-w-xs w-full flex flex-col">
            <div className="mb-5 flex flex-col">
              <p>Account Email:</p>
              <input
                type="text"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 px-3 shadow-inner border border-gray-200 flex-grow rounded-md focus:outline-none"
              />
              {"email" in errors ? (
                <p className="ml-2 mt-1 text-sm font-body text-red-500">
                  {errors.email}
                </p>
              ) : (
                ""
              )}
            </div>

            {"detail" in errors ? (
              <p className="self-center text-center text-sm font-body text-red-500">
                {errors.detail}
              </p>
            ) : (
              ""
            )}

            <button
              type="submit"
              onClick={handleReset}
              className="mt-5 px-5 py-2 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none"
            >
              <span className="uppercase font-semibold font-title tracking-widest text-lg text-gray-100">
                Send Email Link
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

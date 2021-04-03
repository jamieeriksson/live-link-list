import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../utilities/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export default function IsEmailConfirmed() {
  let user = useContext(UserContext);

  const sendConfirmEmail = async () => {
    let urlHost = "";

    if (process.env.NODE_ENV === "development") {
      urlHost = "http://localhost:8000/";
    }

    if (process.env.NODE_ENV === "production") {
      urlHost = "";
    }

    const url = new URL("/send-confirm-email", urlHost);

    console.log(user);
    console.log(user.user);
    console.log(user.user.email);

    try {
      const response = await axios.post(url, {
        email: user.user.email,
      });

      alert("New confirmation email sent!");
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

  if (user.user && user.user["logged_in"] && !user.user.email_confirmed) {
    return (
      <div className="w-full flex place-items-center justify-center">
        <div className="mx-6 px-4 py-2 bg-red-300 border border-red-400 rounded-lg text-sm">
          <p className="text-center leading-tight">
            <span className="mr-2 text-red-900">
              <FontAwesomeIcon icon={faExclamationCircle} />
            </span>
            Your email has not yet been confirmed{" "}
            <button
              onClick={async (e) => {
                e.preventDefault();
                sendConfirmEmail();
              }}
              className="ml-1 underline text-primary-blue focus:outline-none"
            >
              Resend confirmation email
            </button>
          </p>
        </div>
      </div>
    );
  }
  return "";
}

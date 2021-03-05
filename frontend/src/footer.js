import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="max-w-screen w-full px-8 py-8 flex justify-center place-items-center bg-gray-800 text-green-50 font-nunito">
      <div className="max-w-2xl w-full flex justify-center place-items-center">
        <ul>
          <li className="my-2 opacity-80 hover:opacity-100">
            <Link to="/">About Us</Link>
          </li>
          <li className="my-2 opacity-80 hover:opacity-100">
            <Link to="/">Feedback</Link>
          </li>
          <li className="my-2 opacity-80 hover:opacity-100">
            <Link to="/">Help &amp; Support</Link>
          </li>
          <li className="my-2 opacity-80 hover:opacity-100">
            <Link to="/">About Us</Link>
          </li>
        </ul>
        <div className="flex-grow"></div>
        <ul>
          <li className="my-2 opacity-80 hover:opacity-100">
            <Link to="/">Terms of Service</Link>
          </li>
          <li className="my-2 opacity-80 hover:opacity-100">
            <Link to="/">Privacy Policy</Link>
          </li>
          <li className="my-2 opacity-80 hover:opacity-100">
            <Link to="/">Cookie Policy</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

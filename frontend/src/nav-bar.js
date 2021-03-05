import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "./assets/logo.png";

export default function NavBar() {
  const { pathname } = useLocation();

  return (
    <div className="z-50 max-w-screen w-full h-32 px-10 pt-2 pb-8 flex flex-col justify-center place-items-center">
      <div className="h-12 self-center md:self-start">
        <img src={logo} alt="live link list logo" className="" />
      </div>
      <div className="flex uppercase font-body text-gray-500 text-lg">
        <Link
          to="/"
          className={`mx-4 md:mx-8 my-1 border-b border-transparent text-center ${
            pathname === "/"
              ? "font-semibold text-gray-900 border-gray-800"
              : ""
          }`}
        >
          Post a live
        </Link>
        <Link
          to="/browse"
          className={`mx-4 md:mx-8 my-1 border-b border-transparent text-center ${
            pathname === "/browse"
              ? "font-semibold text-gray-900 border-gray-800"
              : ""
          }`}
        >
          Browse Lives
        </Link>
      </div>
    </div>
  );
}

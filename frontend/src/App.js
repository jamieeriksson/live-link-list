import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PostingPage from "./post-page/post-page.js";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="max-w-screen w-full min-h-screen h-full overflow-x-hidden bg-gradient-to-b from-gray-200 to-red-100">
      <Router>
        <ScrollToTop />
        <Route path="/" exact component={PostingPage} />
      </Router>
    </div>
  );
}

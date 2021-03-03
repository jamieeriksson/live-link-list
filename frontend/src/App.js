import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PostingPage from "./portfolio.js";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="max-w-screen w-full min-h-screen h-full overflow-x-hidden bg-dark-brown">
      <Router>
        <ScrollToTop />
        <Route path="/" exact component={PostingPage} />
      </Router>
    </div>
  );
}

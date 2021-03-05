import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PostingPage from "./post-page/post-page.js";
import BrowsePage from "./browse-page/browse-page.js";
import Footer from "./footer.js";
import Nav from "./nav-bar.js";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="relative max-w-screen w-full min-h-screen h-full flex flex-col overflow-x-hidden bg-gray-50">
      <Router>
        <ScrollToTop />
        <Nav />
        <Route path="/" exact component={PostingPage} />
        <Route path="/browse" component={BrowsePage} />
        <Footer />
      </Router>
    </div>
  );
}

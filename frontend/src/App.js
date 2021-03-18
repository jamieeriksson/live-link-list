import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PostingPage from "./post-page/post-page.js";
import BrowsePage from "./browse-page/browse-page.js";
import Footer from "./footer.js";
import Nav from "./nav-bar.js";
import LoginPage from "./user-account/login.js";
import RegisterPage from "./user-account/register.js";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="relative max-w-screen w-full overflow-x-hidden bg-gray-50">
      <Router>
        <ScrollToTop />
        <Nav />
        <Route path="/" exact component={PostingPage} />
        <Route path="/browse" component={BrowsePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Footer />
      </Router>
    </div>
  );
}

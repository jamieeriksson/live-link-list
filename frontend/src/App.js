import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PostingPage from "./post-page/post-page.js";
import BrowsePage from "./browse-page/browse-page.js";
import Footer from "./footer.js";
import Nav from "./nav-bar.js";
import LoginPage from "./user-account/login.js";
import ForgotPassword from "./user-account/forgot-password.js";
import PasswordResetConfirmed from "./user-account/password-reset-confirmed.js";
import RegisterPage from "./user-account/register.js";
import UserAccountPage from "./user-account/account.js";
import UserLivesPage from "./user-account/user-lives/user-lives.js";
import useDataApi from "./utilities/data-api.js";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [state] = useDataApi("platforms");

  return (
    <div className="relative max-w-screen w-full overflow-x-hidden bg-gray-50">
      <Router>
        <ScrollToTop />
        <Nav />
        <Route path="/" exact component={PostingPage} />
        <Route path="/browse" component={BrowsePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route
          path="/password-reset-confirmed"
          component={PasswordResetConfirmed}
        />
        <Route path="/register" component={RegisterPage} />
        <Route path="/account" component={UserAccountPage} />
        <Route path="/user-lives" component={UserLivesPage} />
        <Footer />
      </Router>
    </div>
  );
}

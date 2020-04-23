import React, { Fragment, useState } from "react";
import LoginModal from "./LoginModal";
import { withUser } from "../UserContext";
import PicturesModal from "./PicturesModal";

const Footer = ({ user }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [picturesModalIsOpen, setPicturesModalIsOpen] = useState(false);

  const LoggedIn = () => (
    <Fragment>
      <button
        className="loginLink"
        onClick={() => setPicturesModalIsOpen(true)}
      >
        Manage pictures
      </button>
      <PicturesModal
        isOpen={picturesModalIsOpen}
        onRequestClose={() => setPicturesModalIsOpen(false)}
      />
      <button className="loginLink" onClick={() => user.signOut()}>
        Log out
      </button>
    </Fragment>
  );

  const LoggedOut = () => (
    <Fragment>
      <button className="loginLink" onClick={() => setLoginOpen(true)}>
        Login
      </button>
      <LoginModal
        isOpen={loginOpen}
        onRequestClose={() => setLoginOpen(false)}
      />
    </Fragment>
  );

  let Guts = LoggedOut;

  if (user) Guts = LoggedIn;

  return (
    <footer className="siteFooter">
      <Guts />
    </footer>
  );
};

export default withUser(Footer);

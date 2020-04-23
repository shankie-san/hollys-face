import React, { useState } from "react";
import { withUser } from "../UserContext";
import IntroModal from "./IntroModal";

const Header = ({ user }) => {
  const [introModalIsOpen, setIntroModalIsOpen] = useState(true);

  return (
    <footer className="siteFooter">
      <IntroModal
        isOpen={introModalIsOpen}
        onRequestClose={() => setIntroModalIsOpen(false)}
      />
    </footer>
  );
};

export default withUser(Header);

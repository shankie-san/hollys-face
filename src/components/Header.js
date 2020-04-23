import React, { useState } from "react";
import { withUser } from "../UserContext";
import IntroModal from "./IntroModal";

const Header = ({ user }) => {
  const [introModalIsOpen, setIntroModalIsOpen] = useState(true);

  return (
    <IntroModal
      isOpen={introModalIsOpen}
      onRequestClose={() => setIntroModalIsOpen(false)}
    />
  );
};

export default withUser(Header);

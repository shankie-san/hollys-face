import React, { useEffect } from "react";
import Modal from "react-modal";

import Cross from "./icons/Cross";

const IntroModal = ({ isOpen, onRequestClose }) => {
  useEffect(() => {
    Modal.setAppElement("body");
  }, []);
  return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="modal"
        overlayClassName="modal-wrapper"
      >
        <header className="modal-header">
          <div className="modal-closer" onClick={onRequestClose}>
            <Cross className="modal-closer-icon" />
          </div>
        </header>
        <div className="modal-content">
          <h1 className="splash">Holly's Face</h1>
          <div className="puzzle-instructions">Solve the puzzle to fire Tamsin!</div>
          <div className="getStarted-wrapper">
            <button className="button-getStarted" onClick={onRequestClose}>Let's go!</button>
          </div>
          
        </div>
      </Modal>
  );
};

export default IntroModal;

import React, { useState, useEffect } from 'react';
import Cross from "./icons/Cross";
import Modal from "react-modal";
import { firestore} from "../fire";
import ImageUploader from './ImageUploader';

const deleteItem = (docID) => {
  firestore
    .collection("faces")
    .doc(docID)
    .delete()
    .catch(error => {
      console.log("Error deleting face");
      console.log(error);
    });
}

const PicturesModal = ({isOpen, onRequestClose}) => {
  const [faces, setFaces] = useState([]);

  useEffect(() => {

    Modal.setAppElement("body");

    const unsubscribe = firestore
      .collection("faces")
      .onSnapshot(snap => {
        setFaces(snap.docs.map(doc => ({id: doc.id, data: doc.data()})));
      });

    return () => {
      unsubscribe();
    }; // Return a function to be run on cleanup - akin to componentwillunmount
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-wrapper"
    >
      <header className="modal-header">
        <h2>Manage pictures</h2>
        <div className="modal-closer" onClick={onRequestClose}>
          <Cross className="modal-closer-icon" />
        </div>
      </header>
      <div className="modal-content">
        <ul className="faceList">
        {faces.map(face => 
          <li className="faceList-item" key={face.id}>
            <div className="faceList-item-nuker" onClick={() => deleteItem(face.id)}>
              <Cross className="faceList-item-nuker-icon" />
            </div>
            <img className="faceList-face" src={face.data.imageURL} alt="" />
          </li>
        )}
        </ul>
        <ImageUploader />
      </div>
    </Modal>
  );
};

export default PicturesModal;
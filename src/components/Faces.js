import React, { useState, useEffect } from "react";
import { firestore } from "../fire";

const Faces = () => {
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firestore
      .collection("faces")
      .get()
      .then(snap => {
        setFaces(snap.docs);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {faces.map(face => (
        <img key={face.id}src={face.get("imageURL")} alt="" />
      ))}
    </div>
  );
};

export default Faces;

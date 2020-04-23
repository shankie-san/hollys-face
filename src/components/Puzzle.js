import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../fire";
import { DragDropContext } from "react-dnd";
import Puzzle from "../react-image-puzzle";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import RetroHitCounter from "react-retro-hit-counter";
const superagent = require("superagent");

// https://europe-west1-hollies-face.cloudfunctions.net/fireTamsin

function is_touch_device() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

const Faces = () => {
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [random, setRandom] = useState(Math.random());
  const [firings, setFirings] = useState(0);

  const puzzleRef = useRef(null);

  useEffect(() => {
    // Detect if a touch device
    if (is_touch_device()) {
      puzzleRef.current = DragDropContext(TouchBackend)(Puzzle);
    } else {
      puzzleRef.current = DragDropContext(HTML5Backend)(Puzzle);
    }

    const unsubscribe = firestore
      .collection("settings")
      .doc("settings")
      .onSnapshot(snap => {
        setFirings(snap.data().firings);
      });

    return () => {
      unsubscribe();
    }; // Return a function to be run on cleanup - akin to componentwillunmount
  }, []);

  const faceIndex = Math.floor(random * faces.length);
  console.log(faceIndex);

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

  const PuzzleWithHandler = puzzleRef.current;

  return (
    <div className="puzzle-wrapper">
      <PuzzleWithHandler
        image={faces[faceIndex].get("imageURL")}
        onDone={() => {
          alert("Tamsin has been fired!");
          superagent
            .get(
              "https://europe-west1-hollies-face.cloudfunctions.net/fireTamsin"
            )
            .end((err, response) => {
              if (err) {
                console.log(err);
              }
              console.log("done");
            });
        }}
        level={3}
      />
      <button
        className="button-faceNew"
        onClick={() => setRandom(Math.random())}
      >
        This face sucks. Give me a new one
      </button>
      <div className="firing-wrapper">
        <h4>Tamsin's firings to date:</h4>
        <RetroHitCounter
          hits={firings}
          /* The following are all default values: */
          withBorder={true}
          withGlow={false}
          minLength={4}
          size={40}
          padding={4}
          digitSpacing={3}
          segmentThickness={4}
          segmentSpacing={0.5}
          segmentActiveColor="#76FF03"
          segmentInactiveColor="#315324"
          backgroundColor="#222222"
          borderThickness={7}
          glowStrength={0.5}
        />
      </div>
    </div>
  );
};

export default Faces;

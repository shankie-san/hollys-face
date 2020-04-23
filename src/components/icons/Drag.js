import React from "react";

const Drag = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 126 126"
    >
      <title>Drag</title>
      <polygon points="90 90 63 126 36 90 90 90" />
      <polygon points="36 36 63 0 90 36 36 36" />
      <rect y="54" width="126" height="18" />
    </svg>
  );
};

export default Drag;

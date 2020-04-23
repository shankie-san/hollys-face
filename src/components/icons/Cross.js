import React from "react";

const Cross = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 100 100">
      <path
        d="M5 5, 95 95"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M95 5, 5 95"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default Cross;

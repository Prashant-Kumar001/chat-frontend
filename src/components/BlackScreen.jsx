import React from "react";

const BlackScreen = ({ top = 53, height = "100" }) => {
  return (
    <div
      className="absolute left-0 w-full bg-black opacity-50 z-50 transition-all duration-300"
      style={{ top: `${top}px`, height: `${height}vh` }}
    ></div>
  );
};

export default BlackScreen;

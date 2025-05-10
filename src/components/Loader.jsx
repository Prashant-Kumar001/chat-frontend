import React from "react";
import { Grid2, Skeleton } from "@mui/material";

const Loader = () => {
  return (
    <Grid2
      container
      className="flex-1 overflow-hidden"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "350px 1fr",
          md: "350px 1fr 300px",
        },
        gap: 1,
        p: 1,
        height: "100vh",
      }}
    >
      <Grid2
        sx={{
          display: { xs: "none", sm: "block" },
          borderRadius: 2,
          overflow: "hidden",
          height: "100%",
          border: "1px solid rgba(214, 212, 237,0.8)",
        }}
        className="bg-gray-300 rounded-lg animate-pulse"
      ></Grid2>
      <Grid2 className="grid grid-rows-11 gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="w-full h-8  bg-gray-300 rounded-md animate-pulse"
          ></div>
        ))}
      </Grid2>
      <Grid2
        sx={{
          display: { xs: "none", md: "block" },
          borderRadius: 2,
          border: "1px solid rgba(214, 212, 237,0.8)",
          p: 2,
          overflow: "hidden",
        }}
        className=" bg-gray-300 rounded-lg animate-pulse"
      ></Grid2>
    </Grid2>
  );
};

export default Loader;

const TypingIndicator = ({ username }) => {
  return (
    <div className="items-center px-4 flex gap-2">
      {username && (
        <span className="text-gray-700 text-sm font-semibold">
          {username} is typing...
        </span>
      )}
      {!username && <span className="text-gray-700 text-sm">Typing...</span>}
      <div className="dot-flashing"></div>
      <div className="dot-flashing"></div>
      <div className="dot-flashing"></div>
    </div>
  );
};



export { TypingIndicator };

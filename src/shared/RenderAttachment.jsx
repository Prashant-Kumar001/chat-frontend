import React from "react";
import { transformFile } from "../lib/features.js";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;

    case "image":
      return (
        <img
          src={transformFile(url, 200)}
          alt="Attachment"
          style={{
            objectFit: "contain",
            width: "200px",
            height: "150px",
          }}
        />
      );

    case "audio":
      return <audio
        style={{
          objectFit: "contain",
          width: "200px",
        }} src={url} preload="none" controls />;

    case "document":
      return url.endsWith(".pdf") ? (
        <iframe
          src={url}
          width="200px"
          height="150px"
          className="rounded-lg shadow-md"
        />
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700 flex items-center gap-2"
        >
          <FileOpenIcon /> Open File
        </a>
      );

    default:
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700 flex items-center gap-2"
        >
          <FileOpenIcon /> Download File
        </a>
      );
  }
};

export default RenderAttachment;

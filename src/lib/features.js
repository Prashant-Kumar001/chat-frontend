import moment from "moment";

const fileFormat = (url = "") => {
  const ext = url.split(".").pop().toLowerCase();

  const videoFormats = ["mp4", "webm", "ogg"];
  const imageFormats = ["jpg", "jpeg", "png", "gif", "webp"];
  const audioFormats = ["wav", "mp3"];
  const documentFormats = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "txt",
    "ppt",
    "pptx",
  ];

  if (videoFormats.includes(ext)) return "video";
  if (imageFormats.includes(ext)) return "image";
  if (audioFormats.includes(ext)) return "audio";
  if (documentFormats.includes(ext)) return "document";

  return "file";
};

export default fileFormat;

const transformFile = (url = "", width = 100) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);

  return newUrl;
};

const getLast7Days = () => {
  const today = moment();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    last7Days.push(today.clone().subtract(i, "days").format("dddd"));
  }

  return last7Days;
};

const animations = {
  zoomIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  zoomOut: {
    initial: { scale: 1 },
    whileInView: { scale: 0.5 },
    transition: { duration: 0.5 },
  },

  statsAnimation: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  },
  div: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

export {
  fileFormat,
  transformFile,
  getLast7Days,
  animations,
  getOrSaveFromStorage,
};

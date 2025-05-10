import { motion } from "framer-motion";

const NewLoader = () => {
  return (
    <div className="flex justify-center absolute top-0  right-0 left-0 items-center h-screen">
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default NewLoader;

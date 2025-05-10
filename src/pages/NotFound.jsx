import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-6"
    >
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mb-6">
        The page you are looking for might have been removed or does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        Go Home
      </Link>
    </motion.div>
  );
};

export default NotFound;

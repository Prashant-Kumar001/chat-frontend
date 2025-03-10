import { motion } from "framer-motion";

const AdminWelcome = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg text-center"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          🎉 Welcome to the Admin Panel! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Manage your dashboard, users, and messages efficiently.
        </p>
        <p className="text-md text-gray-500">
          Use the sidebar to navigate through different sections.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AdminWelcome;

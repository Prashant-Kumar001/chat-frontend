import React from "react";
import AppLayout from "../layout/AppLayout";
import { motion } from "framer-motion";
const Home = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-3xl  font-semibold text-center">
      <h1 className="text-2xl font-semibold text-center">
        Please
        select a chat to start messaging
      </h1>
    </div>
  );
};

export default AppLayout()(Home);

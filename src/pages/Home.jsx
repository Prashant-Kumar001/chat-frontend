import React from "react";
import AppLayout from "../layout/AppLayout";
const Home = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center md:text-3xl text-xl font-semibold text-center">
      <h1 className=" font-semibold text-center">
        Please
        select a chat to start messaging
      </h1>
    </div>
  );
};

export default AppLayout()(Home);

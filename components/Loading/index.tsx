import React from "react";

const Loading = ({ text }) => {
  return (
    <>
      <div className="flex items-center justify-center mt-[50px]">
        <div className="w-24 h-24 border-l-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
      <p className="text-center font-ptmono mt-5">{text}</p>
    </>
  );
};

export default Loading;

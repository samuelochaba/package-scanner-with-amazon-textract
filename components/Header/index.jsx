/* eslint-disable @next/next/no-img-element */
import React from "react";

const Header = ({ text }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <img className="" src="/doormat-logo.png" alt="dorrmat logo" />
      <h2 className="text-center font-rubik">{text}</h2>
    </div>
  );
};

export default Header;

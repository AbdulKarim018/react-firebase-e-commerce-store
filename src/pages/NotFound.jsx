import React from "react";
import NotFoundIcon from "../assets/404.svg";

export default function NotFound() {
  return (
    <div className="flex justify-center">
      <img
        src={NotFoundIcon}
        alt="Page Not Found"
        className="w-[25vw] max-md:w-[50vw]"
      />
    </div>
  );
}

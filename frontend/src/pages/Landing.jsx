import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo2.png";

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-sky-600 to-sky-900 relative overflow-hidden"
      onClick={() => navigate("/AuthPage")}
    >
      <img
        src={logo}
        alt="HIRIZE Logo"
        className="w-90 h-90 mb-4"
      />
      <p className="mt-01 text-3xl text-gray-400">
        Click o continue
      </p>
    </div>
  );
}

export default Landing;

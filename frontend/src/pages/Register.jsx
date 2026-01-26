import React from "react";
import { useNavigate } from "react-router-dom";


function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="w-full max-w-md p-8 bg-blue-50 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-sky-700">Register</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded"/>
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded"/>
          <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded"/>
          <button type="submit" className="w-full bg-sky-700 text-white py-2 rounded hover:bg-sky-900">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register

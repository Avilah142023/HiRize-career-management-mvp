import React from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
            <div className="w-full max-w-md p-8 bg-blue-50 rounded shadow-md">
      <h2 className="bg-blue-50 text-2xl font-bold text-center text-sky-700">Login</h2>
      
      <form className="space-y-4 mt-6">
        <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded hover:border-sky-700"/>
        <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded"/>
        <button type="submit" className="w-full bg-sky-700 text-white py-2 rounded hover:bg-sky-900">
          Login
        </button>
      </form>
      </div>
    </div>
  );
}

export default Login;

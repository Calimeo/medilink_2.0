import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "react-lottie";
import animationData from "../../lottie-animation/loginAnimation.json";
import API from "@/axios/axios.js";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await API.post(
        "/api/v1/user/login",
        { email, password, role: "Patient" },
        { withCredentials: true }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful");
        navigate("/homepage");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-teal-100 to-white px-4">
      {/* Animation Section */}
      <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
        <Lottie options={defaultOptions} height={300} width={300} />
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-teal-800 mb-2">Welcome</h1>
        <p className="text-center text-gray-600 mb-6">Login to your account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm text-teal-700">
          <Link to="/signup" className="hover:underline">Create Account</Link>
          <Link to="/" className="hover:underline">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

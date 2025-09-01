import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from '@lottiefiles/react-lottie-player';
import API from "@/axios/axios.js";
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserPlusIcon,
  KeyIcon
} from "@heroicons/react/24/outline";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post(
        "/api/v1/user/login",
        { email, password, role: "Patient" },
        { withCredentials: true }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        toast.success("🎉 Login successful! Welcome back!");
        setTimeout(() => navigate("/homepage"), 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4 py-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white">
        
        {/* Illustration Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-teal-500 to-blue-600 p-8 flex flex-col justify-center items-center text-white">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Bienvenue!</h1>
            <p className="text-blue-100 text-lg">Connectez-vous pour accéder à votre compte médical et gérer votre parcours de santé</p>
          </div>
          
          <div className="w-full max-w-md">
            <Player
              autoplay
              loop
              src="https://assets1.lottiefiles.com/packages/lf20_kmj6e0wh.json"
              style={{ height: '300px', width: '100%' }}
            />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🏥</span>
              </div>
              <span className="text-sm">Hopital</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">📅</span>
              </div>
              <span className="text-sm">Rendez-vous</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">💊</span>
              </div>
              <span className="text-sm">Pharmacie</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyIcon className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Se Connecter</h2>
            <p className="text-gray-600">Entrez vos identifiants pour accéder à votre compte</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                />
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                <LockClosedIcon className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                />
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-2"
                />
                Remember me
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="w-5 h-5 mr-2">📱</span>
                Google
              </button>
              <button className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="w-5 h-5 mr-2">📘</span>
                Facebook
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors flex items-center justify-center"
              >
                <UserPlusIcon className="w-4 h-4 mr-1" />
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
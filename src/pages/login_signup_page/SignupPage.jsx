import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Lottie from "react-lottie";
import animationData from "../../lottie-animation/loginAnimation.json";
import "react-toastify/dist/ReactToastify.css";
import API from "@/axios/axios.js";

function SignupPage() {
  const navigate = useNavigate();
  const [strength, setStrength] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", dob: "", nic: "", phone: "",
    email: "", gender: "", password: "", confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const res = await API.post(
        "/api/v1/user/patient/register",
        formData,
        { withCredentials: true }
      );
      toast.success("Signup successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  useEffect(() => {
    checkStrength(formData.password);
  }, [formData.password]);

  const checkStrength = (password) => {
    let strength = 0;
    if (password.match(/[a-z].*[A-Z]|[A-Z].*[a-z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[!@#$%^&*]/)) strength++;
    if (password.length > 7) strength++;
    setStrength(strength);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-teal-100 to-white px-4">
      <Helmet>
        <script src="https://www.google.com/recaptcha/api.js" />
      </Helmet>

      {/* Animation */}
      <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
        <Lottie options={defaultOptions} height={300} width={300} />
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-4">
          Create Your Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
            <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
            <Input label="NIC" name="nic" value={formData.nic} onChange={handleInputChange} />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <div className="flex flex-col">
              <label htmlFor="gender" className="text-sm text-gray-600 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} />
            <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />
          </div>

          {/* Password Strength Indicator */}
          <div className="mt-2">
            <div className="h-2 rounded-full transition-all bg-gray-200">
              <div
                className={`h-2 rounded-full transition-all`}
                style={{
                  width: `${strength * 25}%`,
                  backgroundColor:
                    strength === 1
                      ? "red"
                      : strength === 2
                      ? "orange"
                      : strength === 3
                      ? "gold"
                      : strength === 4
                      ? "green"
                      : "transparent",
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password Strength: {["Weak", "Fair", "Good", "Strong"][strength - 1] || "Very Weak"}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 mt-4"
          >
            Create New Account
          </button>

          <p className="text-center mt-3 text-sm text-teal-700">
            Already have an account?{" "}
            <Link to="/login" className="underline hover:text-teal-900">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// 🔁 Petite abstraction pour les inputs
const Input = ({ label, name, type = "text", value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      placeholder={label}
    />
  </div>
);

export default SignupPage;

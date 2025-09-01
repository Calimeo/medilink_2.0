import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Player } from '@lottiefiles/react-lottie-player';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";
import API from "@/axios/axios.js";

function SignupPage() {
  const navigate = useNavigate();
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    const { password, confirmPassword, email, firstName, lastName } = formData;
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (strength < 2) {
      toast.error("Please choose a stronger password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.post(
        "/api/v1/user/patient/register",
        formData,
        { withCredentials: true }
      );
      
      toast.success("🎉 Account created successfully! Welcome to Medilink!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
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

  const strengthColors = [
    "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"
  ];

  const strengthLabels = ["Very Weak", "Weak", "Good", "Strong"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4 py-8">
      <Helmet>
        <script src="https://www.google.com/recaptcha/api.js" />
      </Helmet>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white">
        
        {/* Illustration Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-teal-500 to-blue-600 p-8 flex flex-col justify-center items-center text-white">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Rejoignez Medilink aujourd'hui !</h1>
            <p className="text-blue-100 text-lg">Créez votre compte et commencez votre parcours de santé avec nous</p>
          </div>
          
          <div className="w-full max-w-md">
            <Player
              autoplay
              loop
              src="https://assets8.lottiefiles.com/packages/lf20_6aYlCg.json"
              style={{ height: '280px', width: '100%' }}
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <CheckBadgeIcon className="w-6 h-6" />
              </div>
              <span className="text-sm">Secure Platform</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <UserIcon className="w-6 h-6" />
              </div>
              <span className="text-sm">Personalized Care</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlusIcon className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="First Name" 
                name="firstName" 
                type="text"
                icon={<UserIcon className="w-5 h-5" />}
                value={formData.firstName} 
                onChange={handleInputChange}
                required
              />
              <InputField 
                label="Last Name" 
                name="lastName" 
                type="text"
                icon={<UserIcon className="w-5 h-5" />}
                value={formData.lastName} 
                onChange={handleInputChange}
                required
              />
              <InputField 
                label="Date of Birth" 
                name="dob" 
                type="date"
                icon={<CalendarDaysIcon className="w-5 h-5" />}
                value={formData.dob} 
                onChange={handleInputChange}
                required
              />
              <InputField 
                label="NIC/ID Number" 
                name="nic" 
                type="text"
                icon={<IdentificationIcon className="w-5 h-5" />}
                value={formData.nic} 
                onChange={handleInputChange}
                required
              />
              <InputField 
                label="Phone Number" 
                name="phone" 
                type="tel"
                icon={<PhoneIcon className="w-5 h-5" />}
                value={formData.phone} 
                onChange={handleInputChange}
                required
              />
              <InputField 
                label="Email Address" 
                name="email" 
                type="email"
                icon={<EnvelopeIcon className="w-5 h-5" />}
                value={formData.email} 
                onChange={handleInputChange}
                required
              />
              
              {/* Gender Field */}
              <div className="flex flex-col">
                <label htmlFor="gender" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="border border-gray-200 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <PasswordField 
                label="Password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                strength={strength}
                required
              />
              <PasswordField 
                label="Confirm Password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
                required
              />
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Password Strength</span>
                  <span className={`text-sm font-semibold ${
                    strength === 0 ? 'text-red-600' :
                    strength === 1 ? 'text-orange-600' :
                    strength === 2 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {strengthLabels[strength] || 'Very Weak'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strength] || 'bg-red-500'}`}
                    style={{ width: `${(strength + 1) * 25}%` }}
                  ></div>
                </div>
                <ul className="text-xs text-gray-500 space-y-1 mt-2">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                    • At least 8 characters
                  </li>
                  <li className={formData.password.match(/[a-z].*[A-Z]|[A-Z].*[a-z]/) ? 'text-green-600' : ''}>
                    • Both uppercase and lowercase letters
                  </li>
                  <li className={formData.password.match(/[0-9]/) ? 'text-green-600' : ''}>
                    • At least one number
                  </li>
                  <li className={formData.password.match(/[!@#$%^&*]/) ? 'text-green-600' : ''}>
                    • At least one special character
                  </li>
                </ul>
              </div>
            )}

            {/* Terms and Conditions */}
            <label className="flex items-start space-x-3 text-sm text-gray-600">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span>
                I agree to the <Link to="/terms" className="text-teal-600 hover:text-teal-700">Terms of Service</Link> and <Link to="/privacy" className="text-teal-600 hover:text-teal-700">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// Input Field Component
const InputField = ({ label, name, type, icon, value, onChange, required }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
        placeholder={label}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    </div>
  </div>
);

// Password Field Component
const PasswordField = ({ label, name, value, onChange, showPassword, setShowPassword, strength, required }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-2 flex items-center">
      <LockClosedIcon className="w-4 h-4 mr-2" />
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
        placeholder={label}
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
);

export default SignupPage;
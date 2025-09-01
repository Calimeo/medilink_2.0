import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaDiscord,
  FaGithub,
  FaLinkedinIn,
  FaBars,
  FaTimes,
  FaRegCalendarCheck,
  FaRegHeart,
  FaUserCircle,
  FaChevronDown,
  FaSearch,
  FaBriefcaseMedical,
  FaStethoscope,
  FaCalendarAlt,
  FaEnvelope,
  FaHospital,
} from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { LuBox } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { AuthContext } from "../Context/Context";
import logo from "/logo.png";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  const navItems = [
    { to: "/search/hospital", label: "Hôpital", icon: FaHospital },
    { to: "/pharmacy", label: "Pharmacie", icon: FaStethoscope },
    { to: "/doctor/search", label: "Recherche", icon: FaSearch },
    { to: "/message", label: "Messages", icon: FaEnvelope },
  ];

  const dropdownMenus = [
    { to: "/profile", label: "Profil", icon: FaUserCircle },
    { to: "/appointments", label: "Mes rendez-vous", icon: FaRegCalendarCheck },
    { to: "/doctor/follow", label: "Docteurs suivis", icon: FaRegHeart },
    { to: "/medicines/order_history", label: "Commandes", icon: LuBox },
    { to: "#", label: "Déconnexion", icon: IoIosLogOut },
  ];

  const socialLinks = [
    { to: "#", icon: FaGithub },
    { to: "#", icon: FaLinkedinIn },
    { to: "#", icon: FaDiscord },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
      isActive
        ? "text-cyan-700 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-sm"
        : "text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 hover:scale-105"
    }`;

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleCartClick = () => navigate("/medicines/cart");

  const handleHospitalSearch = () => {
    navigate("/search/hospital");
    setMobileOpen(false);
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <>
      {/* Navbar principale */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          
          {/* Logo et bouton menu mobile */}
          <div className="flex items-center space-x-4">
            {/* Bouton menu mobile */}
            <button
              onClick={() => setMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileOpen ? (
                <FaTimes size={20} className="text-gray-700" />
              ) : (
                <FaBars size={20} className="text-gray-700" />
              )}
            </button>

            {/* Logo */}
            <NavLink to="/homepage" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 transform group-hover:scale-105">
                <img
                  src={logo}
                  alt="Logo de l'application"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-transparent">
                MediLink
              </h1>
            </NavLink>
          </div>

          {/* Bouton Hôpital pour mobile */}
          <div className="lg:hidden flex-1 mx-4">
            <button
              onClick={handleHospitalSearch}
              className="w-full py-2 px-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg text-cyan-700 font-medium flex items-center justify-center gap-2 hover:from-cyan-100 hover:to-blue-100 transition-all duration-200"
            >
              <FaHospital className="text-cyan-600" />
              <span>Hôpitaux</span>
            </button>
          </div>

          {/* Actions mobiles (Panier) */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Panier mobile */}
            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <IoCartOutline className="text-xl text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, i) => (
              <li key={i}>
                <NavLink to={item.to} className={navLinkClass}>
                  <item.icon className="text-lg" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <IoCartOutline className="text-xl text-gray-600 group-hover:text-cyan-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  if (!isAuthenticated) navigate("/login");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaUserCircle className="text-lg" />
                <span className="font-medium">Menu</span>
                {isAuthenticated && <FaChevronDown className="text-xs" />}
              </button>

              {isAuthenticated && isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {dropdownMenus.map((menu, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (menu.label === "Déconnexion") handleLogOut();
                        else navigate(menu.to);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 cursor-pointer text-gray-700 hover:text-cyan-700 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                    >
                      <menu.icon
                        className={`text-lg ${
                          menu.label === "Déconnexion"
                            ? "text-red-500"
                            : "text-cyan-600"
                        }`}
                      />
                      <span className="font-medium">{menu.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-cyan-600 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-110"
                >
                  <link.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Mobile Overlay */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Menu Mobile */}
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300">
            {/* Header du menu mobile */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800">Menu MediLink</h2>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <FaTimes size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Contenu du menu mobile */}
            <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
              {/* Navigation Items avec icônes */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                  Navigation
                </h3>
                {navItems.map((item, i) => (
                  <NavLink
                    key={i}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-medium ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <item.icon className="text-lg text-cyan-600" />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>

              {/* User Menu Items */}
              {isAuthenticated && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                    Mon Compte
                  </h3>
                  {dropdownMenus.map((menu, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setMobileOpen(false);
                        if (menu.label === "Déconnexion") handleLogOut();
                        else navigate(menu.to);
                      }}
                      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm ${
                        menu.label === "Déconnexion"
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <menu.icon
                        className={`text-lg ${
                          menu.label === "Déconnexion"
                            ? "text-red-500"
                            : "text-cyan-600"
                        }`}
                      />
                      <span className="font-medium">{menu.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Login button pour utilisateurs non connectés */}
              {!isAuthenticated && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/login");
                    }}
                    className="w-full p-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 text-sm"
                  >
                    Se connecter
                  </button>
                </div>
              )}

              {/* Social Links */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Suivez-nous
                </h3>
                <div className="flex justify-center space-x-3">
                  {socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 text-gray-600 hover:text-cyan-600 rounded-lg hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200"
                    >
                      <link.icon className="text-base" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
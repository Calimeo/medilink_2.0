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
} from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { LuBox } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { AuthContext } from "../Context/Context.jsx";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  const navItems = [
    { to: "/specialities", label: "Spécialités" },
    { to: "/pharmacy", label: "Pharmacie" },
    { to: "/doctor/search", label: "Recherche" },
    { to: "/message", label: "Messages" },
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
    `text-sm font-medium px-2 py-1 transition-colors duration-200 hover:text-cyan-700 relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-cyan-600 before:transition-all hover:before:w-full ${
      isActive ? "text-cyan-700" : "text-gray-700"
    }`;

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleCartClick = () => navigate("/medicines/cart");

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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/homepage">
          <h1 className="text-2xl font-bold text-cyan-700">MediLink</h1>
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-6">
          {navItems.map((item, i) => (
            <li key={i}>
              <NavLink to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}

          <li
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              onClick={() => {
                if (!isAuthenticated) navigate("/login");
              }}
              className="flex items-center gap-2 px-3 py-1 border border-cyan-600 text-cyan-700 rounded hover:bg-cyan-50"
            >
              <FaUserCircle />
              Menu
            </button>

            {isAuthenticated && isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border rounded shadow-lg z-40">
                {dropdownMenus.map((menu, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (menu.label === "Déconnexion") handleLogOut();
                      else navigate(menu.to);
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    <menu.icon className="text-cyan-600" />
                    {menu.label}
                  </div>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Cart & Social */}
        <div className="hidden lg:flex items-center gap-4">
          <div onClick={handleCartClick} className="relative cursor-pointer">
            <IoCartOutline className="text-2xl text-cyan-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          {socialLinks.map((link, i) => (
            <a key={i} href={link.to} target="_blank" rel="noopener noreferrer">
              <link.icon className="text-gray-600 hover:text-cyan-600 transition" />
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!isMobileOpen)}
          className="lg:hidden text-cyan-700"
        >
          {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white px-4 py-4 space-y-4 border-t">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="block text-gray-700 text-sm font-medium border-b pb-2"
            >
              {item.label}
            </NavLink>
          ))}

          <div className="pt-2 border-t">
            {dropdownMenus.map((menu, i) => (
              <div
                key={i}
                onClick={() => {
                  setMobileOpen(false);
                  if (menu.label === "Déconnexion") handleLogOut();
                  else navigate(menu.to);
                }}
                className="flex items-center gap-2 py-2 text-gray-700 border-b"
              >
                <menu.icon className="text-cyan-600" />
                {menu.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

// Icons
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

function Footer() {
  const navLinks = [
    { path: "/", display: "Accueil" },
    { path: "/aboutus", display: "À propos" },
    { path: "/privacypolicy", display: "Politique de confidentialité" },
    { path: "/termsandconditions", display: "Conditions d’utilisation" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-700 mb-3">MediLink</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            MediLink est une plateforme numérique moderne dédiée à la santé.
            Gérez vos rendez-vous, dossiers médicaux et conversations avec vos médecins depuis un seul espace.
          </p>
          <div className="flex gap-4 mt-5">
            <a href="#" className="hover:text-cyan-600">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-cyan-600">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="hover:text-cyan-600">
              <FaXTwitter size={20} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Liens rapides</h3>
          <ul className="space-y-2 text-sm">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className="hover:text-cyan-600 transition duration-200"
                >
                  {link.display}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nous contacter</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message envoyé !");
            }}
            className="space-y-3"
          >
            <input
              type="email"
              placeholder="Votre email"
              className="w-full px-4 py-2 border rounded text-sm"
              required
            />
            <textarea
              rows="3"
              placeholder="Votre message"
              className="w-full px-4 py-2 border rounded text-sm"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded w-full text-sm"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-sm py-4 border-t border-gray-100">
        © {new Date().getFullYear()} Wilderson Louis — Tous droits réservés.
      </div>
    </footer>
  );
}

export default Footer;

// frontend/src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger panier depuis localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Sauvegarder à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage")); // Pour mettre à jour d'autres composants (ex: Navbar)
  }, [cart]);

  const updateQuantity = (productId, qty) => {
    const quantity = parseInt(qty);
    if (isNaN(quantity) || quantity < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vous devez être connecté.");
      return;
    }

    if (cart.length === 0) {
      toast.warning("Votre panier est vide.");
      return;
    }

    setLoading(true);
    try {
      // Envoi des achats un par un
      for (const item of cart) {
        await API.post(
          "/api/v1/buy",
          {
            productId: item._id,
            quantity: item.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("Achat(s) effectué(s) avec succès !");
      setCart([]);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage")); // Sync global
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de l'achat"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">Mon Panier</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Votre panier est vide.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border p-4 rounded-md shadow"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, e.target.value)}
                  className="w-16 border rounded px-2 py-1"
                />
                <p className="text-emerald-600 font-semibold">
                  ${item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 font-bold text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-bold">
              Total : <span className="text-emerald-700">${totalAmount}</span>
            </p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Traitement..." : "Valider l'achat"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

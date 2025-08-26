// frontend/src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: ""
  });
  const [bankDetails, setBankDetails] = useState({
    iban: "",
    bic: "",
    accountHolder: ""
  });

  // Charger panier depuis localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Sauvegarder à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
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

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    if (name === 'expiryDate') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'iban') {
      const formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setBankDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Numéro de carte invalide (16 chiffres requis)');
      return false;
    }
    if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      toast.error('Date d\'expiration invalide (format MM/AA)');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      toast.error('CVV invalide (3 chiffres requis)');
      return false;
    }
    if (!cardDetails.cardHolder) {
      toast.error('Nom du titulaire de la carte requis');
      return false;
    }
    return true;
  };

  const validateBankDetails = () => {
    if (!bankDetails.iban || bankDetails.iban.replace(/\s/g, '').length < 15) {
      toast.error('IBAN invalide');
      return false;
    }
    if (!bankDetails.bic || bankDetails.bic.length < 8) {
      toast.error('BIC invalide');
      return false;
    }
    if (!bankDetails.accountHolder) {
      toast.error('Nom du titulaire du compte requis');
      return false;
    }
    return true;
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vous devez être connecté.");
      return;
    }

    if (cart.length === 0) {
      toast.warning("Votre panier est vide.");
      return;
    }

    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    if (!paymentMethod) {
      toast.error('Veuillez sélectionner un moyen de paiement');
      return;
    }

    let isValid = true;
    
    if (paymentMethod === 'credit-card') {
      isValid = validateCardDetails();
    } else if (paymentMethod === 'bank-transfer') {
      isValid = validateBankDetails();
    }

    if (!isValid) return;

    setLoading(true);
    try {
      // Envoi des achats un par un
      for (const item of cart) {
        await API.post(
          "/api/v1/buy",
          {
            productId: item._id,
            quantity: item.quantity,
            paymentMethod: paymentMethod,
            paymentDetails: paymentMethod === 'credit-card' ? cardDetails : 
                           paymentMethod === 'bank-transfer' ? bankDetails : {}
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(`Paiement de ${totalAmount}€ effectué avec succès !`);
      setCart([]);
      localStorage.removeItem("cart");
      setShowPaymentModal(false);
      setPaymentMethod("");
      setCardDetails({ cardNumber: "", expiryDate: "", cvv: "", cardHolder: "" });
      setBankDetails({ iban: "", bic: "", accountHolder: "" });
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors du paiement"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = () => {
    switch(paymentMethod) {
      case 'credit-card': return 'carte de crédit';
      case 'paypal': return 'PayPal';
      case 'bank-transfer': return 'virement bancaire';
      case 'on-delivery': return 'paiement à la livraison';
      default: return '';
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
              <div className="flex-1">
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
                  className="text-red-500 font-bold text-xl hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold">
              Total : <span className="text-emerald-700">${totalAmount}</span>
            </p>
            <button
              onClick={handleCheckout}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-8 rounded-lg font-semibold transition duration-200"
            >
              Procéder au paiement
            </button>
          </div>
        </div>
      )}

      {/* Modal de paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Paiement de votre commande</h2>
            <p className="mb-4 text-lg font-semibold text-emerald-600">
              Total à payer : ${totalAmount}
            </p>
            
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Méthode de paiement :</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="credit-card" 
                    checked={paymentMethod === 'credit-card'}
                    onChange={() => setPaymentMethod('credit-card')}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">💳 Carte de crédit</span>
                    <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="paypal" 
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">📱 PayPal</span>
                    <p className="text-sm text-gray-500">Paiement sécurisé via PayPal</p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank-transfer" 
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={() => setPaymentMethod('bank-transfer')}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">🏦 Virement bancaire</span>
                    <p className="text-sm text-gray-500">Transfert bancaire sécurisé</p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="on-delivery" 
                    checked={paymentMethod === 'on-delivery'}
                    onChange={() => setPaymentMethod('on-delivery')}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">📦 Paiement à la livraison</span>
                    <p className="text-sm text-gray-500">Payez à la réception</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Formulaire carte de crédit */}
            {paymentMethod === 'credit-card' && (
              <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-3">Informations de la carte</h3>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Numéro de carte</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date d'expiration</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/AA"
                      maxLength="5"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      maxLength="3"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Titulaire de la carte</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={cardDetails.cardHolder}
                    onChange={handleCardInputChange}
                    placeholder="Nom complet"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Formulaire virement bancaire */}
            {paymentMethod === 'bank-transfer' && (
              <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-3">Coordonnées bancaires</h3>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">IBAN</label>
                  <input
                    type="text"
                    name="iban"
                    value={bankDetails.iban}
                    onChange={handleBankInputChange}
                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">BIC/SWIFT</label>
                  <input
                    type="text"
                    name="bic"
                    value={bankDetails.bic}
                    onChange={handleBankInputChange}
                    placeholder="ABCDEFGHXXX"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Titulaire du compte</label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={bankDetails.accountHolder}
                    onChange={handleBankInputChange}
                    placeholder="Nom complet"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Messages informatifs */}
            {paymentMethod === 'paypal' && (
              <div className="mb-4 p-4 border rounded-lg bg-yellow-50">
                <p className="text-sm text-yellow-700">
                  Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
                </p>
              </div>
            )}

            {paymentMethod === 'on-delivery' && (
              <div className="mb-4 p-4 border rounded-lg bg-blue-50">
                <p className="text-sm text-blue-700">
                  Vous paierez en espèces ou par carte bancaire lorsque vous recevrez votre commande.
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMethod("");
                  setCardDetails({ cardNumber: "", expiryDate: "", cvv: "", cardHolder: "" });
                  setBankDetails({ iban: "", bic: "", accountHolder: "" });
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                disabled={loading}
              >
                Annuler
              </button>
              <button 
                onClick={confirmPayment}
                disabled={loading}
                className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? "Traitement..." : `Payer ${totalAmount}€`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
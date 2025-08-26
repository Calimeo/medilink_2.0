import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { CardStore, GetStore } from '../../helper/Medcinefuncations'

function MedicineCard({ products }) { 
    const navigate = useNavigate()
    const [CartId, setCartId] = useState(GetStore())
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('')
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
    })
    const [bankDetails, setBankDetails] = useState({
        iban: '',
        bic: '',
        accountHolder: ''
    })
    const location = useLocation().pathname.replace("/shop-by-category/", " ").trim()

    const handleCart = (medi) => {
        const response = CardStore(medi);
        if (Array.isArray(response)) {
          setCartId(response);
        }
        if (typeof response === 'object' && response !== null && !Array.isArray(response)) {
          setCartId(prevCartId => [...prevCartId, { medicineId: response.medicineId, CartId: response._id }]);
        }
    }

    const handlePurchase = (product) => {
        setSelectedProduct(product)
        setShowPaymentModal(true)
    }

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        
        // Formatage automatique pour le numéro de carte
        if (name === 'cardNumber') {
            const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            setCardDetails(prev => ({
                ...prev,
                [name]: formattedValue
            }));
            return;
        }
        
        // Formatage automatique pour la date d'expiration
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
    }

    const handleBankInputChange = (e) => {
        const { name, value } = e.target;
        
        // Formatage automatique pour l'IBAN
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
    }

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
    }

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
    }

    const confirmPayment = () => {
        if (!paymentMethod) {
            toast.error('Veuillez sélectionner un moyen de paiement');
            return;
        }

        let isValid = true;
        
        // Validation selon la méthode de paiement
        if (paymentMethod === 'credit-card') {
            isValid = validateCardDetails();
        } else if (paymentMethod === 'bank-transfer') {
            isValid = validateBankDetails();
        }

        if (!isValid) return;

        // Simulation de traitement du paiement
        toast.success(`Paiement de ${selectedProduct.price}€ effectué avec ${getPaymentMethodLabel()} !`);
        
        // Ajouter le produit au panier après paiement réussi
        handleCart(selectedProduct);
        
        // Réinitialiser et fermer la modal
        setShowPaymentModal(false);
        setPaymentMethod('');
        setCardDetails({ cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' });
        setBankDetails({ iban: '', bic: '', accountHolder: '' });
    }

    const getPaymentMethodLabel = () => {
        switch(paymentMethod) {
            case 'credit-card': return 'carte de crédit';
            case 'paypal': return 'PayPal';
            case 'bank-transfer': return 'virement bancaire';
            case 'on-delivery': return 'paiement à la livraison';
            default: return '';
        }
    }

    useEffect(() => {
        setCartId(GetStore());
    }, []);

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 md:justify-items-start justify-items-center'>
                {products?.map((medi, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden w-64">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{medi.name}</h3>
                            <p className="text-gray-600">Prix: {medi.price} €</p>
                            <div className="mt-4 flex justify-between">
                                <button 
                                    onClick={() => handleCart(medi)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                >
                                    Ajouter au panier
                                </button>
                                <button 
                                    onClick={() => handlePurchase(medi)}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                >
                                    Acheter maintenant
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de paiement */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Paiement pour {selectedProduct?.name}</h2>
                        <p className="mb-4 text-lg font-semibold text-green-600">Montant: {selectedProduct?.price} €</p>
                        
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">Méthode de paiement:</label>
                            <div className="space-y-2">
                                <label className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="credit-card" 
                                        checked={paymentMethod === 'credit-card'}
                                        onChange={() => setPaymentMethod('credit-card')}
                                        className="mr-3"
                                    />
                                    <div>
                                        <span className="font-medium">Carte de crédit</span>
                                        <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="paypal" 
                                        checked={paymentMethod === 'paypal'}
                                        onChange={() => setPaymentMethod('paypal')}
                                        className="mr-3"
                                    />
                                    <div>
                                        <span className="font-medium">PayPal</span>
                                        <p className="text-sm text-gray-500">Paiement sécurisé via PayPal</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="bank-transfer" 
                                        checked={paymentMethod === 'bank-transfer'}
                                        onChange={() => setPaymentMethod('bank-transfer')}
                                        className="mr-3"
                                    />
                                    <div>
                                        <span className="font-medium">Virement bancaire</span>
                                        <p className="text-sm text-gray-500">Transfert bancaire sécurisé</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="on-delivery" 
                                        checked={paymentMethod === 'on-delivery'}
                                        onChange={() => setPaymentMethod('on-delivery')}
                                        className="mr-3"
                                    />
                                    <div>
                                        <span className="font-medium">Paiement à la livraison</span>
                                        <p className="text-sm text-gray-500">Payez lorsque vous recevez votre commande</p>
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

                        {/* Message pour PayPal */}
                        {paymentMethod === 'paypal' && (
                            <div className="mb-4 p-4 border rounded-lg bg-yellow-50">
                                <p className="text-sm text-yellow-700">
                                    Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
                                </p>
                            </div>
                        )}

                        {/* Message pour paiement à la livraison */}
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
                                    setShowPaymentModal(false)
                                    setPaymentMethod('')
                                    setCardDetails({ cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' })
                                    setBankDetails({ iban: '', bic: '', accountHolder: '' })
                                }}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={confirmPayment}
                                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold"
                            >
                                Payer maintenant
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    )
}

export default MedicineCard
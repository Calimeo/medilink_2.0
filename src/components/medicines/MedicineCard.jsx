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

    const confirmPayment = () => {
        if (!paymentMethod) {
            toast.error('Veuillez sélectionner un moyen de paiement')
            return
        }
        
        // Ici vous pouvez ajouter la logique pour traiter le paiement
        toast.success(`Paiement effectué avec ${paymentMethod} pour ${selectedProduct.name}`)
        
        // Ajouter le produit au panier après paiement
        handleCart(selectedProduct)
        
        // Fermer la modal
        setShowPaymentModal(false)
        setPaymentMethod('')
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
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Ajouter au panier
                                </button>
                                <button 
                                    onClick={() => handlePurchase(medi)}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
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
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Paiement pour {selectedProduct?.name}</h2>
                        <p className="mb-4">Montant: {selectedProduct?.price} €</p>
                        
                        <div className="mb-4">
                            <label className="block mb-2">Méthode de paiement:</label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="credit-card" 
                                        checked={paymentMethod === 'credit-card'}
                                        onChange={() => setPaymentMethod('credit-card')}
                                        className="mr-2"
                                    />
                                    Carte de crédit
                                </label>
                                <label className="flex items-center">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="paypal" 
                                        checked={paymentMethod === 'paypal'}
                                        onChange={() => setPaymentMethod('paypal')}
                                        className="mr-2"
                                    />
                                    PayPal
                                </label>
                                <label className="flex items-center">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="bank-transfer" 
                                        checked={paymentMethod === 'bank-transfer'}
                                        onChange={() => setPaymentMethod('bank-transfer')}
                                        className="mr-2"
                                    />
                                    Virement bancaire
                                </label>
                                <label className="flex items-center">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="on-delivery" 
                                        checked={paymentMethod === 'on-delivery'}
                                        onChange={() => setPaymentMethod('on-delivery')}
                                        className="mr-2"
                                    />
                                    Paiement à la livraison
                                </label>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => {
                                    setShowPaymentModal(false)
                                    setPaymentMethod('')
                                }}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={confirmPayment}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Confirmer le paiement
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
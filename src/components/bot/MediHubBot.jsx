import React, { useState, useEffect } from "react";

function MediHubBot() {
    // État pour la liste des messages, l'entrée utilisateur et l'état de chargement
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Clé API Gemini
    // REMPLACEZ 'YOUR_GEMINI_API_KEY' par votre clé API Gemini réelle.
    const apiKey = "AIzaSyBbu_RjKgoJxDyh40zepQ-4m-hVQ0wh36E";

    // Fonction pour envoyer un message à l'API Gemini
    const sendMessageToGemini = async (userMessage) => {
        setIsLoading(true);
        setError(null);

        // Vérifier si la clé API est configurée
        if (apiKey === "AIzaSyBbu_RjKgoJxDyh40zepQ-4m-hVQ0wh36E") {
            setIsLoading(false);
            setError("Veuillez configurer votre clé API Gemini.");
            return;
        }

        // Construire l'historique de conversation pour l'API Gemini
        const chatHistory = [
            {
                role: "system",
                parts: [{
                    text: `Tu es MediHub Bot, un assistant médical. 
                    Si la question est informelle comme "salut" ou "bonjour", réponds de manière informelle et salue l'utilisateur. 
                    Sinon, tu dois :
                    - Identifier des maladies basées sur les symptômes fournis par l'utilisateur.
                    - Lister des médicaments pour ces maladies.
                    - Si l'utilisateur a des questions médicales générales sur un médicament, fournis les détails.
                    - Ne pas utiliser d'astérisques (*).
                    - Générer la réponse sous forme de points clairs sur une nouvelle ligne.`,
                }],
            },
            ...messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
        ];

        // Construire le corps de la requête pour l'API Gemini
        const payload = {
            contents: chatHistory,
            // Paramètres de génération optionnels
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 2048,
            },
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-0520:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                throw new Error(`Erreur API: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content) {
                const botResponse = result.candidates[0].content.parts[0].text;
                addMessage({ sender: 'bot', text: botResponse });
            } else {
                console.error("Réponse inattendue de l'API:", result);
                addMessage({ sender: 'bot', text: "Désolé, je n'ai pas pu générer de réponse." });
            }
        } catch (err) {
            console.error('Erreur lors de la requête à l\'API Gemini:', err);
            setError("Oups! Il y a eu une erreur de connexion. Veuillez vérifier votre clé API ou réessayer plus tard.");
        } finally {
            setIsLoading(false);
        }
    };

    // Gère l'envoi de message par l'utilisateur
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim() !== '') {
            addMessage({ sender: 'user', text: input });
            sendMessageToGemini(input);
            setInput('');
        }
    };

    // Ajoute un message à la liste des messages
    const addMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    // Gère la touche "Enter"
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !isLoading) {
            e.preventDefault();
            handleSendMessage({ preventDefault: () => {} });
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto border border-gray-300 rounded-xl overflow-hidden font-sans shadow-lg bg-gray-50">
            <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-4">
                <div className="flex flex-col">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex max-w-[80%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
                            <div className={`p-3 rounded-2xl break-words whitespace-pre-wrap shadow-sm leading-tight
                                ${msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-md' 
                                    : 'bg-gray-200 text-gray-800 rounded-bl-md'}`
                                }>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex self-start max-w-[80%]">
                            <div className="p-3 rounded-2xl break-words whitespace-pre-wrap shadow-sm leading-tight bg-gray-200 text-gray-800 rounded-bl-md animate-pulse">
                                <span>...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 m-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex p-4 bg-white border-t border-gray-200">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Tapez votre message..."
                    disabled={isLoading}
                    className="flex-grow border border-gray-300 rounded-full px-4 py-2 mr-3 text-base focus:outline-none focus:border-blue-500"
                />
                <button type="submit" disabled={isLoading} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-full text-base transition-colors hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                    Envoyer
                </button>
            </form>
        </div>
    );
}

export default MediHubBot;

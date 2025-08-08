// src/Context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AppContext = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);

      // Facultatif : ici tu peux aussi récupérer les infos de l'utilisateur via une requête API
      // Exemple :
      // fetch("/api/user", { headers: { Authorization: `Bearer ${token}` } })
      //   .then(res => res.json())
      //   .then(data => setUser(data));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AppContext;

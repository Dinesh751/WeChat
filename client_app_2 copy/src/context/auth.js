import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null); // Added default value

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    useEffect(() => {
        try {
            const storedAuth = localStorage.getItem("auth");
            if (storedAuth) {
                const data = JSON.parse(storedAuth);
                setAuth({
                    user: data?.user || null,
                    token: data?.token || ""
                });
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage:", error);
        }
    }, []);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { useAuth, AuthProvider };
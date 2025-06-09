"use client"; // Necessário para usar Context API no App Router

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importe de 'next/navigation' para App Router

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Pode armazenar o objeto de usuário completo

    useEffect(() => {
        // Tenta carregar o usuário do localStorage ao iniciar
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Erro ao parsear user do localStorage:", e);
                localStorage.removeItem('user'); // Limpa dados corrompidos
            }
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const isAuthenticated = !!user?.token; // Verifica se o token existe no objeto user

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
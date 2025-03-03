"use client"; // Marca o componente como Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa o hook useRouter do Next.js

const Header = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Inicializa o hook useRouter

  const handleLogin = async () => {
    try {
      const response = await fetch('https://biomob-api.com:3202/user-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      const data = await response.json();
      
      // Persistir dados no localStorage
      localStorage.setItem('user', JSON.stringify(data));

      console.log('Login bem-sucedido:', data);
      
      // Navegar para a página "Home" após o login bem-sucedido
      router.push('/home'); // Redireciona para a página inicial (Home)
    } catch (error) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
      console.error('Erro:', error);
    }
  };

  return (
    <div className="bg-[#00295B] py-4 px-8 flex justify-around items-center shadow-md w-full">
      {/* Logo */}
      <div className="flex items-center">
     
      </div>
      
      {/* Banner */}
      <div className="flex-grow mx-4 flex justify-start">
        <div className="flex-col justify-center w-full items-center">
        <p>     eYe</p>
        <p>Monitoramento</p>
        </div>
        {/* <img src="/assets/sauron.gif" alt="Banner" className="w-40 h-20" /> */}
      </div>

      {/* Login Form */}
      {/* <div className="flex flex-col items-start">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <label className="text-sm text-gray-100">E-Mail:</label>
        <input
          type="email"
          className="border rounded p-1 mb-2 w-full text-black"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <label className="text-sm text-gray-100">Senha:</label>
        <input
          type="password"
          className="border rounded p-1 mb-2 w-full text-black"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button 
          className="bg-gray-500 text-white rounded py-1 px-4 w-full"
          onClick={handleLogin}
        >
          Entrar
        </button>
        <a href="/esqueceu-senha" className="text-xs text-gray-500 mt-2">Esqueceu a senha?</a>
      </div> */}
    </div>
  );
};

export default Header;

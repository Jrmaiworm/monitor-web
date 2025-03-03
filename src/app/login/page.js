"use client"; // Marca o componente como Client Component


import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const Login = () => {



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
    <div className='w-full flex justify-center'>
    

      
      <div className='w-1/2 justify-center flex mt-8'>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-4/5 m-2">
          <h1 className="text-2xl font-bold text-red-700 mb-4 text-center">Bem-vindo ao Site Monitor</h1>

          <div className="flex flex-col items-center w-full justify-center py-4">
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
          className="bg-gray-500 text-white rounded py-1 px-4 w-full mt-10"
          onClick={handleLogin}
        >
          Entrar
        </button>
        <a href="/esqueceu-senha" className="text-xs text-gray-500 mt-2">Esqueceu a senha?</a>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

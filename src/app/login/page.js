"use client"; // Marca o componente como Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(''); // Para distinguir tipo de erro
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatarDataExpiracao = (dataString) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dataString;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setErrorType('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://biomob-api.com:3202/user-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.senha 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Verificar se é erro de conta expirada
        if (response.status === 403) {
          setErrorType('expired');
          const dataExpiracao = data.data_expiracao ? 
            `Sua conta expirou em ${formatarDataExpiracao(data.data_expiracao)}.` : 
            'Sua conta expirou.';
          setError(`${dataExpiracao} Acesse a área de planos para renovar sua assinatura.`);
        } else {
          setErrorType('general');
          setError(data.error || data.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
        }
        return;
      }
      
      // Persistir dados no localStorage
      localStorage.setItem('user', JSON.stringify(data));

      console.log('Login bem-sucedido:', data);
      
      // Verificar se a conta está próxima do vencimento (30 dias)
      if (data.data_expiracao) {
        const dataExpiracao = new Date(data.data_expiracao);
        const dataAtual = new Date();
        const diasRestantes = Math.ceil((dataExpiracao - dataAtual) / (1000 * 60 * 60 * 24));
        
        if (diasRestantes <= 30 && diasRestantes > 0) {
          // Armazenar aviso de vencimento para mostrar no dashboard
          localStorage.setItem('avisoVencimento', JSON.stringify({
            diasRestantes,
            dataExpiracao: data.data_expiracao
          }));
        }
      }
      
      // Garantir o redirecionamento usando window.location como backup
      try {
        router.push('/home');
      } catch (err) {
        window.location.href = '/home';
      }
    } catch (error) {
      setErrorType('general');
      setError('Falha ao fazer login. Verifique sua conexão e tente novamente.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Login | eYe Monitor</title>
        <meta name="description" content="Faça login no eYe Monitor para acessar seu painel de monitoramento" />
      </Head>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200">
            <FaArrowLeft className="mr-2" /> Voltar para a página inicial
          </Link>
        </div>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Login eYe Monitor
            </h1>
            <p className="text-lg text-white opacity-90 mb-4 max-w-3xl mx-auto">
              Acesse sua conta e monitore seus sites <strong>24 horas por dia, 7 dias por semana</strong>.
            </p>
          </div>
        </div>
        
        {/* Form Section */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesse sua conta</h2>
              <p className="text-gray-600">Digite suas credenciais para entrar</p>
            </div>
            
            {error && (
              <div className={`mb-6 p-4 rounded-lg border ${
                errorType === 'expired' 
                  ? 'bg-orange-50 text-orange-800 border-orange-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <p className="flex items-start">
                  {errorType === 'expired' ? (
                    <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{error}</span>
                </p>
                {errorType === 'expired' && (
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <p className="text-sm mb-3">
                      <strong>Para renovar sua conta:</strong>
                    </p>
                    <Link 
                      href="/planos-de-assinatura" 
                      className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Renovar Plano de Assinatura
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input 
                    id="email"
                    name="email"
                    type="email" 
                    className="text-gray-500 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="senha">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input 
                    id="senha"
                    name="senha"
                    type={mostrarSenha ? "text" : "password"}
                    className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite sua senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? 
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" /> : 
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    }
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="lembrar"
                    name="lembrar"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="lembrar" className="ml-2 block text-sm text-gray-700">
                    Lembrar de mim
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/esqueci-senha" className="text-blue-600 hover:text-blue-800">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Entrando...
                    </>
                  ) : 'Entrar'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Não possui uma conta? 
              <Link href="/crie-sua-conta" className="ml-1 text-blue-600 hover:text-blue-800 transition">
                Cadastre-se agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
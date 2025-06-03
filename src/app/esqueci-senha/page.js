"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { FaEnvelope, FaArrowLeft, FaExclamationCircle, FaCheckCircle, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';

const EsqueciSenha = () => {
  const [step, setStep] = useState(1); // 1: Solicitar email, 2: Inserir código e nova senha
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmSenha, setMostrarConfirmSenha] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://biomob-api.com:3202/user-request-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: formData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao solicitar recuperação de senha. Tente novamente.');
        return;
      }

      setSuccess('Código de verificação enviado para seu e-mail!');
      setStep(2);
      
    } catch (error) {
      setError('Falha ao solicitar recuperação de senha. Verifique sua conexão e tente novamente.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar se as senhas coincidem
    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem. Verifique os campos de senha.');
      return;
    }

    // Validar força da senha
    if (formData.newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://biomob-api.com:3202/user-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token: formData.token,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao redefinir senha. Verifique o código e tente novamente.');
        return;
      }

      setSuccess('Senha redefinida com sucesso! Redirecionando para o login...');
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error) {
      setError('Falha ao redefinir senha. Verifique sua conexão e tente novamente.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      email: '',
      token: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Esqueci Senha | eYe Monitor</title>
        <meta name="description" content="Recupere sua senha do eYe Monitor" />
      </Head>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/login" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200">
            <FaArrowLeft className="mr-2" /> Voltar para o login
          </Link>
        </div>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Recuperar Senha
            </h1>
            <p className="text-lg text-white opacity-90 mb-4 max-w-3xl mx-auto">
              {step === 1 
                ? 'Digite seu e-mail para receber o código de recuperação' 
                : 'Digite o código recebido e sua nova senha'
              }
            </p>
          </div>
        </div>
        
        {/* Form Section */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {step === 1 ? 'Solicitar Recuperação' : 'Redefinir Senha'}
              </h2>
              <p className="text-gray-600">
                {step === 1 
                  ? 'Enviaremos um código de verificação para seu e-mail' 
                  : 'Digite o código de 6 dígitos e sua nova senha'
                }
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 rounded-lg border bg-red-50 text-red-700 border-red-200">
                <p className="flex items-start">
                  <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-lg border bg-green-50 text-green-700 border-green-200">
                <p className="flex items-start">
                  <FaCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{success}</span>
                </p>
              </div>
            )}
            
            {step === 1 ? (
              // Formulário para solicitar código
              <form onSubmit={handleRequestReset} className="space-y-6">
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
                        Enviando...
                      </>
                    ) : 'Enviar Código'}
                  </button>
                </div>
              </form>
            ) : (
              // Formulário para redefinir senha
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="token">
                    Código de Verificação
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="text-gray-400" />
                    </div>
                    <input 
                      id="token"
                      name="token"
                      type="text" 
                      className="text-gray-500 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite o código de 6 dígitos"
                      value={formData.token}
                      onChange={handleChange}
                      maxLength="6"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Código enviado para: {formData.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPassword">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="text-gray-400" />
                    </div>
                    <input 
                      id="newPassword"
                      name="newPassword"
                      type={mostrarSenha ? "text" : "password"}
                      className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite sua nova senha"
                      value={formData.newPassword}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="text-gray-400" />
                    </div>
                    <input 
                      id="confirmPassword"
                      name="confirmPassword"
                      type={mostrarConfirmSenha ? "text" : "password"}
                      className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirme sua nova senha"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setMostrarConfirmSenha(!mostrarConfirmSenha)}
                    >
                      {mostrarConfirmSenha ? 
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600" /> : 
                        <FaEye className="text-gray-400 hover:text-gray-600" />
                      }
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium transition duration-200"
                  >
                    Voltar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Redefinindo...
                      </>
                    ) : 'Redefinir Senha'}
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Lembrou da senha? 
              <Link href="/login" className="ml-1 text-blue-600 hover:text-blue-800 transition">
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsqueciSenha;
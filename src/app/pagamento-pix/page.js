// PagamentoPix.js
"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FaArrowLeft, FaCheck, FaCrown, FaEnvelope, FaExclamationCircle, FaTimes, FaUser, FaCalendarAlt, FaCreditCard, FaCopy } from 'react-icons/fa'; 

import { usePayment } from '../contexts/PaymentContext';

const PagamentoPix = () => {
  const router = useRouter();
  const { paymentData } = usePayment();

  const [userData, setUserData] = useState(null);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
console.log('planoSelecionado', planoSelecionado)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    documento: '',
    email: ''
  });

  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [pixData, setPixData] = useState(null); 
  const [error, setError] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

  useEffect(() => {
    if (paymentData.userData && paymentData.planoSelecionado) {
      setUserData(paymentData.userData);

      // Directly use the planoSelecionado from paymentData as it already contains the chosen period's value (valorFinal)
      const selectedPlanFromContext = paymentData.planoSelecionado;

      // Format the valorFinal for display
      const formattedPrice = `R$ ${selectedPlanFromContext.valorFinal.toFixed(2).replace('.', ',')}`;

      setPlanoSelecionado({
        ...selectedPlanFromContext,
        precoFormatado: formattedPrice, // Add the formatted price for display
        // Ensure 'preco' property is correctly valorFinal if it's used elsewhere for calculations
        preco: selectedPlanFromContext.valorFinal // Ensure this is the numeric value for transaction
      });
      
      setFormData(prev => ({
        ...prev,
        email: paymentData.userData.email || '',
        first_name: paymentData.userData.nome?.split(' ')[0] || '',
        last_name: paymentData.userData.nome?.split(' ').slice(1).join(' ') || '',
        documento: paymentData.userData.documento || ''
      }));
    } else {
      router.push('/planos-de-assinatura'); // Redirect if no plan data is available
    }
  }, [paymentData, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatarDocumento = (documento) => {
    const numeros = documento.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }
    return numeros;
  };

  const handleDocumentoChange = (e) => {
    const valor = e.target.value;
    const documentoFormatado = formatarDocumento(valor);
    setFormData(prev => ({
      ...prev,
      documento: documentoFormatado
    }));
  };

  const validarFormulario = () => {
    if (!formData.first_name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    if (!formData.documento.trim()) {
      setError('Documento é obrigatório');
      return false;
    }

    const documentoNumeros = formData.documento.replace(/\D/g, '');
    if (documentoNumeros.length !== 11) { 
      setError('CPF deve ter 11 dígitos');
      return false;
    }

    return true;
  };

  const handleGerarPix = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) {
      return;
    }

    if (!planoSelecionado) {
      setError('Plano não selecionado. Por favor, retorne e selecione um plano.');
      return;
    }

    setIsGeneratingPix(true);

    try {
      const requestBody = {
        email: formData.email,
        description: `Pagamento ${planoSelecionado.nome} - ${planoSelecionado.periodoSelecionado.charAt(0).toUpperCase() + planoSelecionado.periodoSelecionado.slice(1)} - eYe Monitor`,
        transaction_amount: planoSelecionado.valorFinal, // Use valorFinal from context
        first_name: formData.first_name,
        documento: formData.documento.replace(/\D/g, ''), 
        last_name: formData.last_name,
        tipo_plano: planoSelecionado.id,
        periodo: planoSelecionado.periodoSelecionado // Pass the selected period
      };

      

      const response = await fetch('https://biomob-api.com:3202/payment-create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      console.log('Resposta do pagamento PIX:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar PIX');
      }

      setPixData(data); 

    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      setError(error.message || 'Erro ao gerar PIX. Tente novamente.');
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const copyPixCode = async () => {
    const pixCode = pixData?.point_of_interaction?.transaction_data?.qr_code;
    if (pixCode) {
      try {
        await navigator.clipboard.writeText(pixCode);
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 3000);
      } catch (error) {
        console.error('Erro ao copiar código PIX:', error);
        setError('Falha ao copiar código PIX. Tente manualmente.');
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Pagamento PIX | eYe Monitor</title>
        <meta name="description" content="Finalize seu pagamento via PIX" />
      </Head>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/planos-de-assinatura" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200">
            <FaArrowLeft className="mr-2" /> Voltar para planos
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <FaCreditCard className="text-6xl text-white mx-auto mb-4" /> 
            <p className="text-4xl font-bold text-white mb-4">
              Pagamento via PIX
            </p>
            <p className="text-lg text-white opacity-90">
              Finalize sua assinatura de forma rápida e segura
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Dados para Pagamento
            </h2>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                <p className="flex items-center">
                  <FaExclamationCircle className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleGerarPix} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                    disabled
                      type="text"
                      name="first_name"
                      className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Seu nome"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

          
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    disabled
                    type="email"
                    name="email"
                    className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCreditCard className="text-gray-400" /> 
                  </div>
                  <input
                    disabled
                    type="text"
                    name="documento"
                    className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="000.000.000-00"
                    value={formData.documento}
                    onChange={handleDocumentoChange}
                    maxLength="14"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
                  disabled={isGeneratingPix}
                >
                  {isGeneratingPix ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gerando PIX...
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="mr-2" /> 
                      Gerar PIX
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            {userData && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Dados da Conta</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaUser className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium text-gray-800">{userData.nome}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaEnvelope className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCrown className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Plano Atual</p>
                      <p className="font-medium text-gray-800">{userData.plano || 'Nenhum'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {planoSelecionado && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plano selecionado:</span>
                    <span className="font-medium text-gray-800">{planoSelecionado?.nome}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Período:</span>
                    <span className="font-medium text-gray-800">{planoSelecionado.periodoSelecionado.charAt(0).toUpperCase() + planoSelecionado.periodoSelecionado.slice(1)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-green-600">{planoSelecionado.precoFormatado}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pixData?.point_of_interaction?.transaction_data?.qr_code_base64 && pixData.point_of_interaction.transaction_data.qr_code && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaCreditCard className="text-green-500 mr-2" /> 
                  PIX Gerado
                </h3>

                <div className="text-center mb-4">
                  <img
                    src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`}
                    alt="QR Code PIX"
                    className="mx-auto border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código PIX (Copia e Cola):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pixData.point_of_interaction.transaction_data.qr_code}
                      readOnly
                      className="flex-1 text-gray-700 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={copyPixCode}
                      className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                        pixCopied
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {pixCopied ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                  {pixCopied && (
                    <p className="text-sm text-green-600 mt-1">Código copiado!</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Instruções:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Abra o app do seu banco</li>
                    <li>• Escaneie o QR Code ou cole o código PIX</li>
                    <li>• Confirme o pagamento</li>
                    <li>• Sua assinatura será ativada automaticamente</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagamentoPix;
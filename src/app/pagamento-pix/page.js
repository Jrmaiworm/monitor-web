// PagamentoPix.js
"use client";

import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import Head from 'next/head'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FaArrowLeft, FaCheck, FaCrown, FaEnvelope, FaExclamationCircle, FaTimes, FaUser, FaCalendarAlt, FaCreditCard, FaCopy, FaTag } from 'react-icons/fa'; // Adicionado FaTag para o ícone do cupom

import { usePayment } from '../contexts/PaymentContext';

const PagamentoPix = () => {
  const router = useRouter();
  const { paymentData } = usePayment();

  const [userData, setUserData] = useState(null);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
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

  // --- Novos estados para o Cupom ---
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Armazena os dados do cupom aplicado
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0); // Valor do desconto calculado
  const [finalPrice, setFinalPrice] = useState(0); // Preço final após o desconto
  // --- Fim dos novos estados ---

  // Função para formatar documento (mantida)
  const formatarDocumento = (documento) => {
    const numeros = documento.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }
    return numeros;
  };

  // Calcula o preço final com base no plano selecionado e no cupom
  const calculateFinalPrice = useCallback(() => {
    if (!planoSelecionado) return;

    let price = planoSelecionado.valorFinal;
    let currentDiscount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        currentDiscount = price * (appliedCoupon.value / 100);
      } else if (appliedCoupon.type === 'fixed') {
        currentDiscount = appliedCoupon.value;
      }
    }

    const newFinalPrice = Math.max(0, price - currentDiscount); // Garante que o preço não seja negativo
    setDiscountAmount(currentDiscount);
    setFinalPrice(newFinalPrice);
  }, [planoSelecionado, appliedCoupon]);

  useEffect(() => {
    if (paymentData.userData && paymentData.planoSelecionado) {
      setUserData(paymentData.userData);
      const selectedPlanFromContext = paymentData.planoSelecionado;

      setPlanoSelecionado({
        ...selectedPlanFromContext,
        preco: selectedPlanFromContext.valorFinal // O valor numérico original do plano
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

  // Use useEffect para chamar calculateFinalPrice quando planoSelecionado ou appliedCoupon mudar
  useEffect(() => {
    calculateFinalPrice();
  }, [planoSelecionado, appliedCoupon, calculateFinalPrice]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    // ... (sua validação existente)
    if (!formData.first_name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }

    // if (!formData.last_name.trim()) { // Removido: last_name pode ser vazio se for só 1 nome
    //   setError('Sobrenome é obrigatório');
    //   return false;
    // }

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
      setError('CPF deve ter 11 dígitos.'); // Assumindo apenas CPF neste formulário
      return false;
    }

    setError(''); // Limpa erros se a validação passar
    return true;
  };

  // --- Nova função para aplicar o cupom ---
  const handleApplyCoupon = async () => {
    setCouponError('');
    setAppliedCoupon(null); // Resetar cupom aplicado
    setDiscountAmount(0); // Resetar desconto
    
    if (!couponCode.trim()) {
      setCouponError('Por favor, digite um código de cupom.');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const response = await fetch('https://biomob-api.com:3202/validate-coupon', { // Sua nova rota de API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
          planoId: planoSelecionado?.id // Enviar ID do plano pode ser útil
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponError('');
        // calculateFinalPrice será chamado via useEffect devido à mudança em appliedCoupon
      } else {
        setCouponError(data.message || 'Erro ao aplicar cupom.');
      }
    } catch (error) {
      console.error('Erro na validação do cupom:', error);
      setCouponError('Não foi possível validar o cupom. Tente novamente.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  // --- Fim da nova função ---

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
        transaction_amount: parseFloat(finalPrice.toFixed(2)), // Envia o preço final com desconto
        first_name: formData.first_name,
        documento: formData.documento.replace(/\D/g, ''), 
        last_name: formData.last_name,
        tipo_plano: planoSelecionado.id,
        periodo: planoSelecionado.periodoSelecionado, // Pass the selected period
        // Adicionar informações do cupom ao payload, se houver
        coupon_applied: appliedCoupon ? {
          code: couponCode.trim(),
          type: appliedCoupon.type,
          value: appliedCoupon.value
        } : undefined
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
                    // Alterado para disabled para evitar edição se já vier do contexto
                    disabled
                      type="text"
                      name="first_name"
                      className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      placeholder="Seu nome"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                {/* Adicionado o campo de sobrenome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sobrenome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      disabled
                      type="text"
                      name="last_name"
                      className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      placeholder="Seu sobrenome"
                      value={formData.last_name}
                      onChange={handleInputChange}
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
                    className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
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
                    className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    placeholder="000.000.000-00"
                    value={formData.documento}
                    onChange={handleDocumentoChange}
                    maxLength="14" // MaxLength para CPF formatado
                    required
                  />
                </div>
              </div>

              {/* --- Campo de Cupom --- */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cupom de Desconto
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTag className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="coupon"
                      className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Insira seu cupom"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={isApplyingCoupon || appliedCoupon} // Desabilita se estiver aplicando ou já aplicado
                    />
                  </div>
                  {!appliedCoupon ? ( // Mostra botão "Aplicar" se não houver cupom aplicado
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 flex items-center justify-center disabled:opacity-50"
                      disabled={isApplyingCoupon || !couponCode.trim()}
                    >
                      {isApplyingCoupon ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Aplicar'
                      )}
                    </button>
                  ) : ( // Mostra botão "Remover" se houver cupom aplicado
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode('');
                        setCouponError('');
                        setDiscountAmount(0);
                        // calculateFinalPrice será chamado via useEffect
                      }}
                      className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition duration-200 flex items-center justify-center"
                    >
                      <FaTimes className="mr-2" /> Remover
                    </button>
                  )}
                </div>
                {couponError && <p className="mt-2 text-sm text-red-600 flex items-center"><FaExclamationCircle className="mr-1" /> {couponError}</p>}
                {appliedCoupon && !couponError && (
                  <p className="mt-2 text-sm text-green-600 flex items-center"><FaCheck className="mr-1" /> Cupom "{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `R$ ${appliedCoupon.value.toFixed(2).replace('.', ',')}`} de desconto" aplicado!</p>
                )}
              </div>
              {/* --- Fim do Campo de Cupom --- */}

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
                      <p className="text-sm text-gray-600">Nome Completo</p>
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valor Original:</span>
                    <span className="font-medium text-gray-800 line-through">
                      {`R$ ${planoSelecionado.preco.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600 font-bold">
                      <span className="text-green-600">Desconto do Cupom:</span>
                      <span className="text-lg">
                        {`- R$ ${discountAmount.toFixed(2).replace('.', ',')}`}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total a Pagar:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {`R$ ${finalPrice.toFixed(2).replace('.', ',')}`}
                      </span>
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
                  <Image
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
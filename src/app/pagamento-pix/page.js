// PagamentoPix.js
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react'; // Adicionado useRef
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { FaArrowLeft, FaCheck, FaCrown, FaEnvelope, FaExclamationCircle, FaTimes, FaUser, FaCreditCard, FaCopy, FaTag } from 'react-icons/fa';

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
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    // --- Fim dos novos estados ---

    // --- Novos estados para o status do pagamento ---
    const [paymentStatus, setPaymentStatus] = useState('inputting_data'); // 'inputting_data', 'pending', 'approved', 'rejected'
    const intervalRef = useRef(null); // Para armazenar o ID do intervalo do polling
    // --- Fim dos novos estados de status ---

    const formatarDocumento = (documento) => {
        const numeros = documento.replace(/\D/g, '');
        if (numeros.length <= 11) {
            return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        }
        return numeros;
    };

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

        const newFinalPrice = Math.max(0, price - currentDiscount);
        setDiscountAmount(currentDiscount);
        setFinalPrice(newFinalPrice);
    }, [planoSelecionado, appliedCoupon]);

    useEffect(() => {
        if (paymentData.userData && paymentData.planoSelecionado) {
            setUserData(paymentData.userData);
            const selectedPlanFromContext = paymentData.planoSelecionado;

            setPlanoSelecionado({
                ...selectedPlanFromContext,
                preco: selectedPlanFromContext.valorFinal
            });

            setFormData(prev => ({
                ...prev,
                email: paymentData.userData.email || '',
                first_name: paymentData.userData.nome?.split(' ')[0] || '',
                last_name: paymentData.userData.nome?.split(' ').slice(1).join(' ') || '',
                documento: paymentData.userData.documento || ''
            }));
        } else {
            router.push('/planos-de-assinatura');
        }
    }, [paymentData, router]);

    useEffect(() => {
        calculateFinalPrice();
    }, [planoSelecionado, appliedCoupon, calculateFinalPrice]);

    // --- Lógica para o Polling do Status do Pagamento ---
    useEffect(() => {
        // Se pixData existe e tem um ID de transação, inicie o polling
        if (pixData && pixData.id) {
            // Limpa qualquer polling anterior para evitar duplicação
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            setPaymentStatus('pending'); // Define o status inicial como pendente

            intervalRef.current = setInterval(async () => {
                try {
                    const response = await fetch(`https://biomob-api.com:3202/payment-status/${pixData.id}`);
                    const data = await response.json();

                    if (response.ok && data.status) {
                        setPaymentStatus(data.status); // Atualiza o status
                        // Se o pagamento for aprovado ou rejeitado, pare o polling
                        if (data.status === 'approved' || data.status === 'rejected') {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null; // Limpa a referência
                        }
                    } else {
                        // Se houver um erro na resposta da API de status, pare o polling
                        console.error('Erro ao verificar status:', data.message || 'Erro desconhecido');
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        setError(data.message || 'Não foi possível verificar o status do pagamento.');
                    }
                } catch (err) {
                    console.error('Erro de rede ao verificar status:', err);
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setError('Falha de comunicação ao verificar status do pagamento.');
                }
            }, 5000); // Consulta a cada 5 segundos

            // Função de limpeza para parar o polling quando o componente for desmontado
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [pixData]); // Dependência: A lógica roda quando pixData é definido

    // --- Fim da Lógica de Polling ---


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
            setError('CPF deve ter 11 dígitos.');
            return false;
        }

        setError('');
        return true;
    };

    const handleApplyCoupon = async () => {
        setCouponError('');
        setAppliedCoupon(null);
        setDiscountAmount(0);

        if (!couponCode.trim()) {
            setCouponError('Por favor, digite um código de cupom.');
            return;
        }

        setIsApplyingCoupon(true);
        try {
            const response = await fetch('https://biomob-api.com:3202/validate-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    couponCode: couponCode.trim(),
                    planoId: planoSelecionado?.id
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setAppliedCoupon(data.coupon);
                setCouponError('');
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
                transaction_amount: parseFloat(finalPrice.toFixed(2)),
                first_name: formData.first_name,
                documento: formData.documento.replace(/\D/g, ''),
                last_name: formData.last_name,
                tipo_plano: planoSelecionado.id,
                periodo: planoSelecionado.periodoSelecionado,
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
            setPaymentStatus('pending'); // Define o status como pendente após gerar o PIX

        } catch (error) {
            console.error('Erro ao gerar PIX:', error);
            setError(error.message || 'Erro ao gerar PIX. Tente novamente.');
            setPaymentStatus('inputting_data'); // Retorna ao status inicial se houver erro
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
                <meta name="description" content="Finalize sua pagamento via PIX" />
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

                        {/* O formulário só aparece se o pagamento não estiver pendente ou finalizado */}
                        {paymentStatus === 'inputting_data' && (
                            <form onSubmit={handleGerarPix} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nome *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="text-gray-400" />
                                            </div>
                                            <input
                                                disabled
                                                type="text"
                                                id="first_name"
                                                name="first_name"
                                                className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                                placeholder="Seu nome"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Sobrenome
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="text-gray-400" />
                                            </div>
                                            <input
                                                disabled
                                                type="text"
                                                id="last_name"
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
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        E-mail *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-400" />
                                        </div>
                                        <input
                                            disabled
                                            type="email"
                                            id="email"
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
                                    <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
                                        CPF *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaCreditCard className="text-gray-400" />
                                        </div>
                                        <input
                                            disabled
                                            type="text"
                                            id="documento"
                                            name="documento"
                                            className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                            placeholder="000.000.000-00"
                                            value={formData.documento}
                                            onChange={handleDocumentoChange}
                                            maxLength="14"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                                        Cupom de Desconto
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaTag className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="coupon"
                                                name="coupon"
                                                className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Insira seu cupom"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                disabled={isApplyingCoupon || appliedCoupon}
                                            />
                                        </div>
                                        {!appliedCoupon ? (
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
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAppliedCoupon(null);
                                                    setCouponCode('');
                                                    setCouponError('');
                                                    setDiscountAmount(0);
                                                }}
                                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition duration-200 flex items-center justify-center"
                                            >
                                                <FaTimes className="mr-2" /> Remover
                                            </button>
                                        )}
                                    </div>
                                    {couponError && <p className="mt-2 text-sm text-red-600 flex items-center"><FaExclamationCircle className="mr-1" /> {couponError}</p>}
                                    {appliedCoupon && !couponError && (
                                        <p className="mt-2 text-sm text-green-600 flex items-center">
                                            <FaCheck className="mr-1" /> Cupom &quot;{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `R$ ${appliedCoupon.value.toFixed(2).replace('.', ',')}`}&quot; de desconto aplicado!
                                        </p>
                                    )}
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
                        )}
                        {/* Mensagens de status fora do formulário */}
                        {paymentStatus === 'pending' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6 text-center">
                                <p className="text-yellow-800 text-lg font-medium flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Aguardando Confirmação do Pagamento PIX...
                                </p>
                                <p className="text-yellow-700 text-sm mt-2">
                                    Por favor, finalize o pagamento no seu aplicativo bancário.
                                </p>
                            </div>
                        )}

                        {paymentStatus === 'approved' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6 text-center">
                                <p className="text-green-800 text-lg font-medium flex items-center justify-center">
                                    <FaCheck className="mr-2 text-2xl" />
                                    Pagamento Aprovado!
                                </p>
                                <p className="text-green-700 text-sm mt-2">
                                    Sua assinatura está ativa e você será redirecionado em breve.
                                </p>
                                {/* Redirecionamento pode ser feito aqui ou com um setTimeout */}
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Ir para o Dashboard
                                </button>
                            </div>
                        )}

                        {paymentStatus === 'rejected' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6 text-center">
                                <p className="text-red-800 text-lg font-medium flex items-center justify-center">
                                    <FaTimes className="mr-2 text-2xl" />
                                    Pagamento Recusado!
                                </p>
                                <p className="text-red-700 text-sm mt-2">
                                    Não foi possível processar o pagamento. Por favor, tente novamente ou entre em contato com o suporte.
                                </p>
                                <button
                                    onClick={() => {
                                        setPaymentStatus('inputting_data'); // Volta para o formulário
                                        setPixData(null); // Limpa os dados do PIX
                                        setError(''); // Limpa erros
                                    }}
                                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        )}
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

                        {/* O QR Code e o Copia e Cola só aparecem se o status for 'pending' */}
                        {pixData?.point_of_interaction?.transaction_data?.qr_code_base64 && pixData.point_of_interaction.transaction_data.qr_code && paymentStatus === 'pending' && (
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaCreditCard className="text-green-500 mr-2" />
                                    PIX Gerado
                                </h3>

                                <div className="text-center mb-4">
                                    <Image
                                        src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`}
                                        alt="QR Code PIX"
                                        width={200}
                                        height={200}
                                        className="mx-auto border border-gray-200 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="pixCode" className="block text-sm font-medium text-gray-700 mb-2">
                                        Código PIX (Copia e Cola):
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="pixCode"
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
                                        <li>&bull; Abra o app do seu banco</li>
                                        <li>&bull; Escaneie o QR Code ou cole o código PIX</li>
                                        <li>&bull; Confirme o pagamento</li>
                                        <li>&bull; Sua assinatura será ativada automaticamente</li>
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
// PlanosAssinatura.js
"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheck, FaCrown, FaEnvelope, FaExclamationCircle, FaTimes, FaUser, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';
import { usePayment } from '../contexts/PaymentContext';

const PlanosAssinatura = () => {
  const router = useRouter();
  const { setPaymentData } = usePayment();

  const [possuiConta, setPossuiConta] = useState(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [periodoSelecionado, setPeriodoSelecionado] = useState({
    basico: 'mensal',
    avancado: 'mensal', 
    super: 'mensal'
  });

  const planos = [
    {
      id: 'basico',
      nome: 'Plano Básico',
      precos: {
        mensal: { valor: 2.90, economia: null },
        semestral: { valor: 14.90, economia: '14%', valorMensal: 2.48 },
        anual: { valor: 29.90, economia: '14%', valorMensal: 2.49 }
      },
      descricao: 'Ideal para pequenos projetos',
      recursos: [
        'Até 5 sites monitorados',
        'Verificação a cada 30 minutos',
        'Alertas por email e whatsapp',
        'Dashboard básico',
        'Suporte por email'
      ],
      popular: false
    },
    {
      id: 'avancado',
      nome: 'Plano Premium',
      precos: {
        mensal: { valor: 4.90, economia: null },
        semestral: { valor: 24.90, economia: '15%', valorMensal: 4.15 },
        anual: { valor: 49.90, economia: '15%', valorMensal: 4.16 }
      },
      descricao: 'Perfeito para empresas em crescimento',
      recursos: [
        'Até 10 sites monitorados',
        'Verificação a cada 5 minutos',
        'Alertas por email e whatsapp',
        'Dashboard avançado',
        'Relatórios detalhados',
        'Suporte prioritário'
      ],
      popular: true
    },
    {
      id: 'super',
      nome: 'Plano Enterprise',
      precos: {
        mensal: { valor: 9.90, economia: null },
        semestral: { valor: 49.90, economia: '16%', valorMensal: 8.32 },
        anual: { valor: 99.90, economia: '16%', valorMensal: 8.33 }
      },
      descricao: 'Para grandes empresas',
      recursos: [
        'Até 20 sites monitorados',
        'Verificação a cada 1 minuto',
         'Alertas por email e whatsapp',
        'Dashboard personalizado',
        'API completa',
        'Suporte 24/7',
        'Gerente de conta dedicado'
      ],
      popular: false
    }
  ];

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

  const calcularDiasRestantes = (dataExpiracao) => {
    if (!dataExpiracao) return null;
    
    try {
      const hoje = new Date();
      const dataExp = new Date(dataExpiracao);
      const diferencaTempo = dataExp.getTime() - hoje.getTime();
      const diasRestantes = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
      
      return diasRestantes;
    } catch (error) {
      return null;
    }
  };

  const isPlanoExpirado = (dataExpiracao) => {
    if (!dataExpiracao) return true;
    
    const diasRestantes = calcularDiasRestantes(dataExpiracao);
    return diasRestantes !== null && diasRestantes <= 0;
  };

  const getStatusPlano = (userData) => {
    if (!userData || !userData.plano || userData.plano === 'Nenhum') {
      return { status: 'sem_plano', mensagem: 'Nenhum plano ativo' };
    }

    const diasRestantes = calcularDiasRestantes(userData.data_expiracao);
    
    if (diasRestantes === null) {
      return { status: 'sem_data', mensagem: 'Data de expiração não definida' };
    }

    if (diasRestantes <= 0) {
      return { status: 'expirado', mensagem: 'Plano expirado' };
    }

    return { 
      status: 'ativo', 
      mensagem: `${diasRestantes} dia${diasRestantes === 1 ? '' : 's'} restante${diasRestantes === 1 ? '' : 's'}` 
    };
  };

  const handleEmailCheck = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://biomob-api.com:3202/user-check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError('Email não encontrado. Você precisa criar uma conta primeiro.');
        } else {
          setError(data.error || 'Erro ao verificar email.');
        }
        return;
      }

      setUserData(data);
      setEmailVerificado(true);
      setShowModal(true);
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodoChange = (planoId, periodo) => {
    setPeriodoSelecionado(prev => ({
      ...prev,
      [planoId]: periodo
    }));
  };

  const getPrecoFormatado = (plano) => {
    const periodo = periodoSelecionado[plano.id];
    const precoInfo = plano.precos[periodo];
    
    if (periodo === 'mensal') {
      return {
        preco: `R$ ${precoInfo.valor.toFixed(2).replace('.', ',')}`,
        periodo: '/mês',
        economia: null
      };
    } else {
      const totalFormatado = `R$ ${precoInfo.valor.toFixed(2).replace('.', ',')}`;
      const mensalFormatado = `R$ ${precoInfo.valorMensal.toFixed(2).replace('.', ',')}`;
      return {
        preco: totalFormatado,
        periodo: periodo === 'semestral' ? '/6 meses' : '/ano',
        precoMensal: `${mensalFormatado}/mês`,
        economia: precoInfo.economia
      };
    }
  };

  const handleGerarPagamento = (planoId) => {
    if (userData) {
      const plano = planos.find(p => p.id === planoId);
      const periodo = periodoSelecionado[planoId];
      const precoInfo = plano.precos[periodo];
      
      if (plano) {
        setPaymentData({
          userData: userData,
          planoSelecionado: { 
            id: planoId, 
            ...plano,
            periodoSelecionado: periodo,
            valorFinal: precoInfo.valor,
            descricaoCompleta: `${plano.nome} - ${periodo.charAt(0).toUpperCase() + periodo.slice(1)}`
          }
        });
        router.push('/pagamento-pix');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const resetForm = () => {
    setPossuiConta(null);
    setEmail('');
    setError('');
    setUserData(null);
    setEmailVerificado(false);
    setShowModal(false);
  };

  // Obter status do plano para exibição
  const statusPlano = userData ? getStatusPlano(userData) : null;

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Planos de Assinatura | eYe Monitor</title>
        <meta name="description" content="Escolha o melhor plano para monitorar seus sites 24/7" />
      </Head>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200">
            <FaArrowLeft className="mr-2" /> Voltar para a página inicial
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg p-8 mb-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Planos de Assinatura
            </h1>
            <p className="text-lg text-white opacity-90 mb-4 max-w-3xl mx-auto">
              Escolha o plano ideal para suas necessidades e mantenha seus sites monitorados <strong>24 horas por dia</strong>.
            </p>
          </div>
        </div>

        {/* Verificação de Conta */}
        {possuiConta === null && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Você já possui uma conta?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setPossuiConta(false)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200"
                >
                  Não, quero criar uma conta
                </button>
                <button
                  onClick={() => setPossuiConta(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
                >
                  Sim, já tenho conta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulário para usuários existentes */}
        {possuiConta === true && !emailVerificado && (
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Informe seu email cadastrado
              </h3>

              {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  <p className="flex items-center">
                    <FaExclamationCircle className="mr-2" />
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleEmailCheck} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 flex items-center justify-center disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verificando...
                      </>
                    ) : 'Verificar Email'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Voltar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Informações da conta verificada */}
        {emailVerificado && userData && (
          <div className="max-w-md mx-auto mb-8">
            <div className={`border rounded-lg p-6 ${
              statusPlano?.status === 'expirado' || statusPlano?.status === 'sem_plano' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center mb-4">
                <FaCheck className={`mr-3 ${
                  statusPlano?.status === 'expirado' || statusPlano?.status === 'sem_plano' 
                    ? 'text-red-500' 
                    : 'text-green-500'
                }`} />
                <h3 className={`text-lg font-semibold ${
                  statusPlano?.status === 'expirado' || statusPlano?.status === 'sem_plano' 
                    ? 'text-red-800' 
                    : 'text-green-800'
                }`}>
                  Email verificado com sucesso!
                </h3>
              </div>
              <div className={`space-y-2 text-sm ${
                statusPlano?.status === 'expirado' || statusPlano?.status === 'sem_plano' 
                  ? 'text-red-700' 
                  : 'text-green-700'
              }`}>
                <p><strong>Nome:</strong> {userData.nome}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Plano Atual:</strong> {userData.plano || 'Nenhum'}</p>
                {statusPlano && (
                  <p><strong>Status:</strong> {statusPlano.mensagem}</p>
                )}
                {userData.data_expiracao && (
                  <p><strong>Data de Expiração:</strong> {formatarDataExpiracao(userData.data_expiracao)}</p>
                )}
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
                >
                  {statusPlano?.status === 'expirado' || statusPlano?.status === 'sem_plano' || statusPlano?.status === 'sem_data'
                    ? 'Escolher Plano'
                    : 'Atualizar Plano'
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Botão para criar conta */}
        {possuiConta === false && (
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Crie sua conta 
              </h3>
              <p className="text-gray-600 mb-6">
                Primeiro você precisa criar uma conta para depois escolher seu plano.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/crie-sua-conta"
                  className="flex-1 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition duration-200 text-center"
                >
                  Criar Conta 
                </Link>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Planos - Visíveis sempre, mas habilitados apenas quando necessário */}
        {(possuiConta === null || possuiConta === false || emailVerificado) && (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {planos.map((plano) => {
              const precoInfo = getPrecoFormatado(plano);
              
              return (
                <div
                  key={plano.id}
                  className={`relative bg-white rounded-xl shadow-lg border-2 ${plano.popular ? 'border-blue-500' : 'border-gray-200'} overflow-hidden
                             transition-all duration-300 hover:shadow-xl hover:scale-[1.01]`}
                >
                  {plano.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                      <FaCrown className="inline mr-1" /> Mais Popular
                    </div>
                  )}

                  <div className={`p-8 ${plano.popular ? 'pt-16' : ''}`}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plano.nome}</h3>
                    <p className="text-gray-600 mb-6">{plano.descricao}</p>

                    {/* Seletor de Período */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Escolha o período:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['mensal', 'semestral', 'anual'].map((periodo) => (
                          <button
                            key={periodo}
                            onClick={() => handlePeriodoChange(plano.id, periodo)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all duration-200 ${
                              periodoSelecionado[plano.id] === periodo
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
                            {plano.precos[periodo].economia && (
                              <div className="text-green-600 text-xs font-bold">
                                -{plano.precos[periodo].economia}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="mb-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {precoInfo.preco}
                        <span className="text-lg text-gray-500">{precoInfo.periodo}</span>
                      </div>
                      {precoInfo.precoMensal && (
                        <div className="text-sm text-gray-600">
                          Equivale a {precoInfo.precoMensal}
                        </div>
                      )}
                      {precoInfo.economia && (
                        <div className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          Economia de {precoInfo.economia}
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plano.recursos.map((recurso, index) => (
                        <li key={index} className="flex items-start">
                          <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{recurso}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        if (possuiConta === false) {
                          router.push('/crie-sua-conta');
                        } else if (emailVerificado && userData) {
                          handleGerarPagamento(plano.id);
                        }
                      }}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition duration-200 ${
                        plano.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } ${(!emailVerificado && possuiConta !== false) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!emailVerificado && possuiConta !== false}
                    >
                      {possuiConta === false
                        ? 'Criar Conta e Escolher Plano'
                        : emailVerificado
                          ? (statusPlano?.status === 'expirado' || statusPlano?.status === 'sem_plano' || statusPlano?.status === 'sem_data'
                              ? 'Escolher Plano'
                              : 'Atualizar Plano')
                          : 'Verifique seu email primeiro'
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de dados do usuário */}
        {showModal && userData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 text-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Dados da Conta</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaUser className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium">{userData.nome}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaEnvelope className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCrown className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Plano Atual</p>
                      <p className="font-medium">{userData.plano || 'Nenhum'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Data de Expiração</p>
                      <p className="font-medium">
                        {userData.data_expiracao ? formatarDataExpiracao(userData.data_expiracao) : 'Não definida'}
                      </p>
                    </div>
                  </div>

                  {statusPlano && (
                    <div className={`p-3 rounded-lg ${
                      statusPlano.status === 'expirado' || statusPlano.status === 'sem_plano' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      <p className="font-medium text-center">
                        Status: {statusPlano.mensagem}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    {statusPlano?.status === 'expirado' || statusPlano?.status === 'sem_plano' || statusPlano?.status === 'sem_data'
                      ? 'Escolha um plano para continuar usando nossos serviços.'
                      : 'Você pode atualizar seu plano a qualquer momento.'
                    }
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={closeModal}
                      className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
                    >
                      {statusPlano?.status === 'expirado' || statusPlano?.status === 'sem_plano' || statusPlano?.status === 'sem_data'
                        ? 'Escolher Plano'
                        : 'Atualizar Plano'
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanosAssinatura;
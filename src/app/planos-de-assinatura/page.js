"use client"; // Marca o componente como Client Component

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaArrowLeft, FaCheck, FaTimes, FaCrown, FaRocket, FaStar } from 'react-icons/fa';

const PlanosDeAssinatura = () => {
  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Planos de Assinatura | eYe Monitor</title>
        <meta name="description" content="Conheça os planos de assinatura do eYe Monitor para monitoramento de websites 24/7" />
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
              Planos de Assinatura
            </h1>
            <p className="text-lg text-white opacity-90 mb-4 max-w-3xl mx-auto">
              O eYe Monitor vigia seu site <strong>24 horas por dia, 7 dias por semana</strong>, 
              alertando você imediatamente quando algo não estiver funcionando corretamente.
            </p>
          </div>
        </div>
        
        {/* Descrição dos Planos */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Escolha o plano ideal para suas necessidades</h2>
          <p className="text-gray-600">
            Oferecemos diferentes opções para atender desde pequenos sites até grandes plataformas empresariais.
            Todos os planos incluem monitoramento 24/7 e alertas em tempo real.
          </p>
        </div>
        
        {/* Cards de Preços em vez de tabela */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Plano Básico */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:transform hover:scale-105">
            <div className="bg-blue-50 p-6 text-center border-b border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <FaStar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Básico</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">Grátis</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Perfeito para começar</p>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>1</strong> site monitorado</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Intervalos de <strong>30/60 min.</strong></span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Relatórios online</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Relatórios mensais por e-mail</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>1</strong> contato para alertas</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Protocolos <strong>HTTP/HTTPS</strong></span>
                </li>
              </ul>
              
              <div className="mt-8">
                <button className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200">
                  Começar Agora
                </button>
              </div>
            </div>
          </div>
          
          {/* Plano Avançado */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200 transition-transform hover:transform hover:scale-105 relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <div className="bg-blue-50 p-6 text-center border-b border-blue-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <FaRocket className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Avançado</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">R$ 4,90</span>
                <span className="text-gray-500 ml-1">/mês</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Para sites profissionais</p>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>3</strong> sites monitorados</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Intervalos de <strong>30/60 min.</strong></span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Relatórios online completos</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Relatórios mensais por e-mail</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>3</strong> contatos para alertas</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Protocolos <strong>HTTP/SMTP/POP3/FTP/HTTPS</strong></span>
                </li>
              </ul>
              
              <div className="mt-8">
                <button className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200">
                  Assinar Agora
                </button>
              </div>
            </div>
          </div>
          
          {/* Plano Super */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:transform hover:scale-105">
            <div className="bg-blue-50 p-6 text-center border-b border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <FaCrown className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Super</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">R$ 9,90</span>
                <span className="text-gray-500 ml-1">/mês</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Para múltiplos sites</p>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>10</strong> sites monitorados</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Intervalos de <strong>5/15 min.</strong></span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Relatórios online detalhados</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Relatórios mensais por e-mail</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>5</strong> contatos para alertas</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Protocolos <strong>HTTP/SMTP/POP3/FTP/HTTPS/DNS</strong></span>
                </li>
              </ul>
              
              <div className="mt-8">
                <button className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200">
                  Assinar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabela de Comparação - Mobile Friendly */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
          <h3 className="bg-blue-50 p-4 text-lg font-bold text-blue-800 border-b border-gray-200">
            Comparativo de Planos
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recursos</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Básico</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Avançado</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Super</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sites monitorados</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">3</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">10</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Intervalos de monitoramento</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">30/60 min.</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">30/60 min.</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">5/15 min.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Relatórios online</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    <FaCheck className="text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    <FaCheck className="text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    <FaCheck className="text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Relatórios por e-mail</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">Mensal</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">Mensal</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">Mensal</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Contatos para alertas</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">3</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">5</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Protocolos suportados</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">HTTP/HTTPS</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">HTTP/SMTP/POP3/FTP/HTTPS</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">HTTP/SMTP/POP3/FTP/HTTPS/DNS</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800">Preço</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700 text-center">Grátis</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700 text-center">R$ 4,90 /mês</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700 text-center">R$ 9,90 /mês</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* FAQ ou Informações Adicionais */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Tem dúvidas sobre nossos planos?</h2>
          <p className="text-lg text-blue-700 mb-6">
            Nossa equipe está pronta para ajudar você a escolher o plano mais adequado às suas necessidades.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/fale-conosco" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Fale Conosco
            </Link>
            <Link href="/faq" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Perguntas Frequentes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanosDeAssinatura;
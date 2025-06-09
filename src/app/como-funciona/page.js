"use client";

import React from 'react';
import Link from 'next/link';
import { FaClock, FaServer, FaChartLine, FaBell, FaEnvelope, FaFileAlt, FaCheckCircle, FaGlobe } from 'react-icons/fa';

const ComoFunciona = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título e Introdução */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-4 text-center">Como Funciona o eYe Monitor</h1>
          <p className="text-lg opacity-90 text-center max-w-4xl mx-auto">
            Entenda como nosso sistema trabalha 24 horas por dia para garantir que seu site esteja sempre disponível para seus clientes.
          </p>
        </div>

        {/* Serviços de monitoramento */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaServer className="text-blue-600 mr-2" /> Serviços Monitorados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <FaGlobe className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-blue-800">Sites Web</h3>
              </div>
              <p className="text-gray-700">
                Monitoramento completo de servidores HTTP e HTTPS para garantir que seus sites estejam sempre disponíveis.
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <FaEnvelope className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-blue-800">Servidores de Email</h3>
              </div>
              <p className="text-gray-700">
                Monitoramento de servidores POP3 e SMTP para garantir que sua comunicação por email funcione sem interrupções.
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <FaServer className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-blue-800">Servidores FTP</h3>
              </div>
              <p className="text-gray-700">
                Monitoramento de servidores FTP para garantir que a transferência de arquivos ocorra sem problemas.
              </p>
            </div>
          </div>
        </div>

        {/* Como Funciona o Monitoramento */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaClock className="text-blue-600 mr-2" /> O Processo de Monitoramento
          </h2>

          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  1
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Verificações Periódicas</h3>
                <p className="mt-2 text-gray-600">
                  O eYe Monitor testa seu site em intervalos de 5, 10, 15 ou 30 minutos, dependendo do seu plano.
                  Estas verificações garantem que qualquer problema seja detectado rapidamente.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  2
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Alertas Instantâneos</h3>
                <p className="mt-2 text-gray-600">
                  Caso seu site não esteja disponível, um email de alerta é enviado imediatamente para você.
                  Você também receberá outro alerta quando o serviço voltar ao normal.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  3
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Relatórios Detalhados</h3>
                <p className="mt-2 text-gray-600">
                  Nossa plataforma gera relatórios que informam o percentual de tempo em que seu site ficou no ar,
                  bem como detalhes dos momentos em que houve falhas, permitindo análises aprofundadas.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  4
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Monitoramento 24/7/365</h3>
                <p className="mt-2 text-gray-600">
                  O eYe Monitor funciona 24 horas por dia, 7 dias por semana, 365 dias por ano, sem interrupções.
                  Mesmo durante feriados e fins de semana, seu site estará sendo monitorado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefícios */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaCheckCircle className="text-blue-600 mr-2" /> Benefícios do eYe Monitor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex">
              <FaBell className="text-blue-600 text-xl flex-shrink-0 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Alertas Rápidos</h3>
                <p className="text-gray-600">
                  Seja notificado imediatamente quando seu site apresentar problemas, permitindo uma resposta rápida.
                </p>
              </div>
            </div>

            <div className="flex">
              <FaChartLine className="text-blue-600 text-xl flex-shrink-0 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Relatórios Completos</h3>
                <p className="text-gray-600">
                  Acesse relatórios detalhados sobre o desempenho do seu site, com dados sobre disponibilidade e tempo de resposta.
                </p>
              </div>
            </div>

            <div className="flex">
              <FaFileAlt className="text-blue-600 text-xl flex-shrink-0 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Histórico de Incidentes</h3>
                <p className="text-gray-600">
                  Mantenha um registro completo de todos os incidentes ocorridos, facilitando a análise e prevenção de problemas futuros.
                </p>
              </div>
            </div>

            <div className="flex">
              <FaServer className="text-blue-600 text-xl flex-shrink-0 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Monitoramento Diversificado</h3>
                <p className="text-gray-600">
                  Além de sites, monitore também servidores de email e FTP com a mesma plataforma integrada.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final  */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Comece a monitorar seu site agora mesmo!
          </h2>
          <p className="text-lg text-blue-700 mb-6">
            Cadastre-se já e tenha todas as informações sobre o funcionamento do seu site.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/crie-sua-conta" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Cadastre-se Grátis
            </Link>
            <Link href="/fale-conosco" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Fale Conosco
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Dúvidas? Entre em contato pelo email <a href="mailto:contato@mwmsoftware.com" className="text-blue-600 hover:underline">contato@mwmsoftware.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComoFunciona;
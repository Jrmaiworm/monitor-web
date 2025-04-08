"use client"; // Marca o componente como Client Component

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCommentAlt, FaPaperPlane, FaCheck, FaExclamationCircle } from 'react-icons/fa';

export default function FaleConosco() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    // Validação de nome
    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }
    
    // Validação de email
    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = 'Formato de email inválido';
    }
    
    // Validação de mensagem
    if (!formData.mensagem.trim()) {
      novosErros.mensagem = 'Mensagem é obrigatória';
    } else if (formData.mensagem.trim().length < 10) {
      novosErros.mensagem = 'Mensagem deve ter pelo menos 10 caracteres';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Aqui você implementaria a lógica para enviar o email
      // Exemplo de simulação de envio:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulação de sucesso
      setMensagemStatus({
        tipo: 'sucesso',
        texto: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
      });
      
      // Limpar formulário após envio
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
      
      // Em um ambiente real, você faria uma requisição para seu backend:
      /*
      const response = await fetch('/api/enviar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          assunto: formData.assunto || 'Contato do site',
          mensagem: formData.mensagem,
          destinatario: 'contato@mwmsoftware.com'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }
      */
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMensagemStatus({
        tipo: 'erro',
        texto: 'Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato diretamente pelo email contato@mwmsoftware.com.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Fale Conosco | eYe Monitor</title>
        <meta name="description" content="Entre em contato com a equipe do eYe Monitor" />
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
              Fale Conosco
            </h1>
            <p className="text-lg text-white opacity-90 mb-4 max-w-3xl mx-auto">
              Entre em contato com nossa equipe para dúvidas, sugestões ou suporte técnico.
            </p>
          </div>
        </div>
        
        {/* Conteúdo Principal */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Envie sua mensagem</h2>
                <p className="text-gray-600">Preencha o formulário abaixo e entraremos em contato o mais breve possível.</p>
              </div>
              
              {mensagemStatus.texto && (
                <div className={`mb-6 p-4 rounded-lg ${
                  mensagemStatus.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border border-green-200' : 
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <p className="flex items-center">
                    {mensagemStatus.tipo === 'sucesso' ? <FaCheck className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
                    {mensagemStatus.texto}
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nome">
                    Nome completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input 
                      id="nome"
                      name="nome"
                      type="text" 
                      className={`text-gray-500 w-full pl-10 pr-3 py-2 border ${errors.nome ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Seu nome completo"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    E-mail*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      className={`text-gray-500 w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="telefone">
                    Telefone (opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input 
                      id="telefone"
                      name="telefone"
                      type="tel" 
                      className="text-gray-500 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assunto">
                    Assunto
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCommentAlt className="text-gray-400" />
                    </div>
                    <select
                      id="assunto"
                      name="assunto"
                      className="text-gray-500 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.assunto}
                      onChange={handleChange}
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="Dúvidas">Dúvidas</option>
                      <option value="Suporte Técnico">Suporte Técnico</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Parcerias">Parcerias</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mensagem">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={5}
                    className={`text-gray-500 w-full p-3 border ${errors.mensagem ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Digite sua mensagem aqui..."
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                  />
                  {errors.mensagem && <p className="mt-1 text-sm text-red-600">{errors.mensagem}</p>}
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" /> Enviar Mensagem
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Informações de Contato */}
          <div className="bg-blue-50 rounded-lg p-8 border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Outras formas de contato</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-blue-700">Email</h4>
                <p className="text-blue-600">contato@mwmsoftware.com</p>
              </div>

              <div>
                <h4 className="text-lg font-medium text-blue-700">Telefone</h4>
                <p className="text-blue-600">+55 (24) 99265-7238</p>
              </div>

              <div>
                <h4 className="text-lg font-medium text-blue-700">Horário de Atendimento</h4>
                <p className="text-blue-600">Segunda a Sexta, das 8h às 18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { FaUserPlus, FaEnvelope, FaLock, FaIdCard, FaCheck, FaArrowLeft, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const CriarConta = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    documento: '',
    aceitarTermos: false
  });
  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    senha: '',
    documento: ''
  });
  const [mostrarTermos, setMostrarTermos] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [forcaSenha, setForcaSenha] = useState({ 
    porcentagem: 0, 
    texto: '', 
    cor: 'bg-gray-200' 
  });

  // Validação de CPF (mantida como estava)
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) 
      soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) 
      soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  };

  // Validação de CNPJ (mantida como estava)
  const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    
    return true;
  };

  // Função que retorna um feedback mais detalhado sobre a validação do documento
  const validarDocumento = (doc) => {
    const documento = doc.replace(/[^\d]+/g, '');
    
    if (documento.length === 0) {
      return { valido: false, mensagem: 'Documento é obrigatório' };
    } else if (documento.length === 11) {
      if (validarCPF(documento)) {
        return { valido: true, mensagem: '' };
      } else {
        return { valido: false, mensagem: 'CPF inválido' };
      }
    } else if (documento.length === 14) {
      if (validarCNPJ(documento)) {
        return { valido: true, mensagem: '' };
      } else {
        return { valido: false, mensagem: 'CNPJ inválido' };
      }
    } else {
      return { 
        valido: false, 
        mensagem: documento.length < 11 ? 'CPF incompleto' : 
                  documento.length > 11 && documento.length < 14 ? 'CNPJ incompleto' : 
                  'Formato de documento inválido'
      };
    }
  };

  // Formatação do documento (mantida como estava)
  const formatarDocumento = (doc) => {
    const documento = doc.replace(/[^\d]+/g, '');
    
    if (documento.length <= 11) {
      // Formatar como CPF: 000.000.000-00
      return documento
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formatar como CNPJ: 00.000.000/0000-00
      return documento
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  // Função para calcular a força da senha
  const calcularForcaSenha = (senha) => {
    let pontos = 0;
    
    // Verificar comprimento
    if (senha.length >= 8) pontos += 25;
    
    // Verificar letras maiúsculas e minúsculas
    if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos += 25;
    else if (/[a-z]/.test(senha) || /[A-Z]/.test(senha)) pontos += 10;
    
    // Verificar números
    if (/\d/.test(senha)) pontos += 25;
    
    // Verificar caracteres especiais
    if (/[!@#$%^&*(),.?":{}|<>]/.test(senha)) pontos += 25;
    
    // Determinar nível de força
    let nivel = '';
    let cor = '';
    
    if (pontos <= 25) {
      nivel = 'Fraca';
      cor = 'bg-red-500';
    } else if (pontos <= 50) {
      nivel = 'Média';
      cor = 'bg-yellow-500';
    } else if (pontos <= 75) {
      nivel = 'Boa';
      cor = 'bg-blue-500';
    } else {
      nivel = 'Forte';
      cor = 'bg-green-500';
    }
    
    return {
      porcentagem: pontos,
      texto: nivel,
      cor: cor
    };
  };

  // Handler para alteração do campo documento
  const handleDocumentoChange = (e) => {
    const { value } = e.target;
    const documento = value.replace(/[^\d.-/]/g, '');
    
    // Atualiza o estado mantendo apenas números e formatando
    setFormData({
      ...formData,
      documento: formatarDocumento(documento)
    });
    
    // Validação em tempo real do documento
    const resultadoValidacao = validarDocumento(documento);
    if (!resultadoValidacao.valido && documento.length > 0) {
      setErrors({
        ...errors,
        documento: resultadoValidacao.mensagem
      });
    } else {
      setErrors({
        ...errors,
        documento: ''
      });
    }
  };

  // Handler para os campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Para documento, usamos a função específica
    if (name === 'documento') {
      return handleDocumentoChange(e);
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Validações em tempo real
    if (name === 'senha') {
      // Calcular e atualizar força da senha
      setForcaSenha(calcularForcaSenha(value));
      
      // Validação em tempo real da senha
      const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (value.length > 0 && !senhaRegex.test(value)) {
        setErrors({
          ...errors,
          senha: 'Senha deve ter pelo menos 8 caracteres, incluindo letras e números'
        });
      } else {
        setErrors({
          ...errors,
          senha: ''
        });
      }
    }
    
    if (name === 'email' && value.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          email: 'Email inválido'
        });
      } else {
        setErrors({
          ...errors,
          email: ''
        });
      }
    }
  };

  // Validação completa do formulário
  const validarForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validação de nome
    if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
      valid = false;
    } else {
      newErrors.nome = '';
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    } else {
      newErrors.email = '';
    }
    
    // Validação de senha
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!senhaRegex.test(formData.senha)) {
      newErrors.senha = 'Senha deve ter pelo menos 8 caracteres, incluindo letras e números';
      valid = false;
    } else {
      newErrors.senha = '';
    }
    
    // Validação de documento
    const resultadoValidacao = validarDocumento(formData.documento);
    if (!resultadoValidacao.valido) {
      newErrors.documento = resultadoValidacao.mensagem;
      valid = false;
    } else {
      newErrors.documento = '';
    }
    
    // Validação dos termos
    if (!formData.aceitarTermos) {
      valid = false;
      // Não definimos uma mensagem de erro porque o HTML5 já mostra uma
    }
    
    setErrors(newErrors);
    return valid;
  };

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('https://biomob-api.com:3202/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          nome: formData.nome,
          password: formData.senha,
          documento: formData.documento.replace(/[^\d]+/g, '') // Remove formatação
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ 
          texto: 'Conta criada com sucesso! Redirecionando...', 
          tipo: 'sucesso' 
        });
        
        // Salvar dados do usuário no localStorage (opcional)
        localStorage.setItem('user', JSON.stringify({
          nome: formData.nome,
          email: formData.email
        }));
        
        // Limpar formulário
        setFormData({
          nome: '',
          email: '',
          senha: '',
          documento: '',
          aceitarTermos: false
        });
        
        // Garantir o redirecionamento usando window.location como backup
        setTimeout(() => {
          try {
            router.push('/login');
          } catch (err) {
            window.location.href = '/login';
          }
        }, 2000);
      } else {
        const errorMessage = data.message || 'Ocorreu um erro desconhecido.';
        setMensagem({ 
          texto: `Erro: ${errorMessage}`, 
          tipo: 'erro' 
        });
      }
    } catch (error) {
      setMensagem({ 
        texto: `Erro ao tentar criar a conta: ${error.message}`, 
        tipo: 'erro' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const termosTexto = `
    1. Relação com o eYe Monitor:
       - O uso dos serviços do eYe Monitor é regido por estes Termos de Uso, que constituem um contrato legal entre o usuário e o eYe Monitor.

    2. Aceitação dos Termos:
       - Ao usar os serviços, o usuário aceita estes Termos.

    3. Alterações nos Termos:
       - O eYe Monitor pode alterar os Termos periodicamente, e o uso continuado dos serviços indica aceitação das mudanças.

    4. Uso dos Serviços:
       - O usuário deve fornecer informações precisas e utilizar os serviços apenas conforme permitido por lei.

    5. Segurança da Conta:
       - O usuário é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram na sua conta.

    6. Privacidade:
       - O eYe Monitor protege as informações pessoais do usuário conforme a Política de Privacidade.

    7. Limitação de Responsabilidade:
       - O eYe Monitor não se responsabiliza por danos indiretos, incidentais ou consequenciais resultantes do uso dos serviços.
  `;

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Criar Conta | eYe Monitor</title>
        <meta name="description" content="Cadastre-se no eYe Monitor para começar a monitorar seus sites" />
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
              Crie sua conta no eYe Monitor
            </h1>
            <p className="text-lg text-white opacity-90 mb-4 max-w-3xl mx-auto">
              Cadastre-se agora e comece a monitorar seus sites <strong>24 horas por dia, 7 dias por semana</strong>.
            </p>
          </div>
        </div>
        
        {/* Form Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Formulário de Cadastro</h2>
              <p className="text-gray-600">Preencha seus dados para criar sua conta</p>
            </div>
            
            {mensagem.texto && (
              <div className={`mb-6 p-4 rounded-lg ${
                mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border border-green-200' : 
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <p className="flex items-center">
                  {mensagem.tipo === 'sucesso' ? <FaCheck className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
                  {mensagem.texto}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nome">
                  Nome/Razão Social*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserPlus className="text-gray-400" />
                  </div>
                  <input 
                    id="nome"
                    name="nome"
                    type="text" 
                    className={`text-gray-500 w-full pl-10 pr-3 py-2 border ${errors.nome ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Ex: Empresa XYZ Ltda."
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  E-mail *
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
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="senha">
                  Senha *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input 
                    id="senha"
                    name="senha"
                    type={mostrarSenha ? "text" : "password"}
                    className={`text-gray-500 w-full pl-10 pr-10 py-2 border ${errors.senha ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                    minLength={8}
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
                
                {/* Indicador de força da senha */}
                {formData.senha.length > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${forcaSenha.cor}`} 
                        style={{ width: `${forcaSenha.porcentagem}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Força da senha: <span className="font-medium">{forcaSenha.texto}</span>
                    </p>
                  </div>
                )}
                
                {errors.senha ? (
                  <p className="mt-1 text-sm text-red-600">{errors.senha}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Use pelo menos 8 caracteres com letras e números</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="documento">
                  CNPJ/CPF *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaIdCard className="text-gray-400" />
                  </div>
                  <input 
                    id="documento"
                    name="documento"
                    type="text"
                    className={`text-gray-500 w-full pl-10 pr-3 py-2 border ${errors.documento ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Digite o CPF ou CNPJ"
                    value={formData.documento}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.documento ? (
                  <p className="mt-1 text-sm text-red-600">{errors.documento}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Digite apenas números ou use o formato com pontos e traços</p>
                )}
              </div>
              
              <div className="pt-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="aceitarTermos"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.aceitarTermos}
                    onChange={handleChange}
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Eu li e aceito os 
                    <button 
                      type="button" 
                      onClick={() => setMostrarTermos(!mostrarTermos)}
                      className="ml-1 text-blue-600 hover:text-blue-800 underline focus:outline-none transition"
                    >
                      Termos de Serviço
                    </button>
                  </span>
                </label>
              </div>
              
              {mostrarTermos && (
                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                  <h3 className="font-medium mb-2 text-blue-700">Termos de Serviço</h3>
                  <pre className="text-gray-700 text-sm whitespace-pre-wrap">{termosTexto}</pre>
                </div>
              )}
              
              <div className="pt-2">
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
                      Processando...
                    </>
                  ) : 'Criar minha conta'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Já possui uma conta? 
              <Link href="/login" className="ml-1 text-blue-600 hover:text-blue-800 transition">
                Entrar agora
              </Link>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center mt-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Pronto para garantir a disponibilidade do seu site?</h2>
          <p className="text-lg text-blue-700 mb-6">
            Comece a monitorar seu site agora e nunca mais seja pego de surpresa por problemas de disponibilidade.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/fale-conosco" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Fale Conosco
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriarConta;
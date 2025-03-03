"use client"; // Marca o componente como Client Component

import Head from 'next/head';
import React, { useState } from 'react';
import Header from '../components/Header';
import NavBar from '../components/Navbar';

const CriarConta = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [documento, setDocumento] = useState('');
  const [aceitarTermos, setAceitarTermos] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [mensagemClasse, setMensagemClasse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://biomob-api.com:3202/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          nome: nome,
          password: senha,
          documento: documento
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso na criação da conta
        setMensagem('Conta criada com sucesso!');
        setMensagemClasse('text-green-500'); // Define a classe da mensagem de sucesso
        setNome('');
        setEmail('');
        setSenha('');
        setDocumento('');
        setAceitarTermos(false);
      } else {
        // Tratamento de erros
        const errorMessage = data.message || 'Ocorreu um erro desconhecido.';
        setMensagem(`Erro: ${errorMessage}`);
        setMensagemClasse('text-red-500'); // Define a classe da mensagem de erro
      }
    } catch (error) {
      // Tratamento de erros de rede ou outros erros inesperados
      setMensagem(`Erro ao tentar criar a conta: ${error.message}`);
      setMensagemClasse('text-red-500');
    }
  };

  const termosTexto = `
    1. Relação com o Site Monitor:
       - O uso dos serviços do Site Monitor é regido por estes Termos de Uso, que constituem um contrato legal entre o usuário e o Site Monitor.

    2. Aceitação dos Termos:
       - Ao usar os serviços, o usuário aceita estes Termos.

    3. Alterações nos Termos:
       - O Site Monitor pode alterar os Termos periodicamente, e o uso continuado dos serviços indica aceitação das mudanças.

    4. Uso dos Serviços:
       - O usuário deve fornecer informações precisas e utilizar os serviços apenas conforme permitido por lei.

    5. Segurança da Conta:
       - O usuário é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram na sua conta.

    6. Privacidade:
       - O Site Monitor protege as informações pessoais do usuário conforme a Política de Privacidade.

    7. Limitação de Responsabilidade:
       - O Site Monitor não se responsabiliza por danos indiretos, incidentais ou consequenciais resultantes do uso dos serviços.
  `;

  return (
    <div>
  
      <div className='w-full justify-center flex items-center'>
        <div className="bg-transparent p-6 rounded-lg shadow-md w-2/3 m-2">
          <h1 className="text-xl font-bold text-white mb-4">Formulário de Cadastro eYe Monitor</h1>
          <p className="mb-4">Os campos marcados com * são obrigatórios.</p>
          {mensagem && <p className={`mb-4 ${mensagemClasse}`}>{mensagem}</p>} {/* Exibe a mensagem com a classe apropriada */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4 w-2/3">
              <label className="block text-white text-sm font-bold mb-2">
                Nome/Razão Social*:
              </label>
              <input 
                type="text" 
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-2/3">
              <label className="block text-white text-sm font-bold mb-2">
                E-mail*:
              </label>
              <input 
                type="email" 
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-2/3">
              <label className="block text-white text-sm font-bold mb-2">
                Senha*:
              </label>
              <input 
                type="password" 
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-2/3">
              <label className="block text-white text-sm font-bold mb-2">
                Documento*:
              </label>
              <input 
                type="text" 
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-2/3">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox"
                  checked={aceitarTermos}
                  onChange={(e) => setAceitarTermos(e.target.checked)}
                  required
                />
                <span className="ml-2 text-white  text-sm">
                  Eu li e aceito os 
                  <button 
                    type="button" 
                    onClick={() => setMostrarTermos(!mostrarTermos)}
                    className="text-blue-600 underline ml-1"
                  >
                    Termos de Serviço
                  </button>
                </span>
              </label>
            </div>
            {mostrarTermos && (
              <div className="mb-4 border p-4 bg-white rounded-lg max-h-48 overflow-y-auto">
                <pre className="text-gray-700 text-sm whitespace-pre-wrap">{termosTexto}</pre>
              </div>
            )}
            <div className="flex items-center justify-center">
              <button 
                type="submit" 
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Criar conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CriarConta;

"use client";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { 
  FaPlay, FaStop, FaTrashAlt, FaInfoCircle, FaGlobe, 
  FaClock, FaPlus, FaCheck, FaTimes, FaExclamationTriangle,
  FaChartBar, FaHistory, FaExternalLinkAlt, FaChartLine
} from "react-icons/fa";
import ModalPopup from "../components/ModalPopup";

const MonitoramentoDetalhado = () => {
  const [usuario, setUsuario] = useState(null);
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [intervalos, setIntervalos] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(false);
  const [detalhesMonitoramento, setDetalhesMonitoramento] = useState([]);
  const [urlSelecionada, setUrlSelecionada] = useState("");
  const [historicoOffline, setHistoricoOffline] = useState([]);
  const [porcentagemOnline, setPorcentagemOnline] = useState(0);
  const [porcentagemOffline, setPorcentagemOffline] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const usuarioData = localStorage.getItem("user");
    if (usuarioData) {
      const user = JSON.parse(usuarioData);
      setUsuario(user);
      fetchUrls(user.id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUrls = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://biomob-api.com:3202/dominio?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar URLs monitoradas");
      }
      const data = await response.json();
      setUrls(data);

      const intervalosIniciais = data.reduce((acc, monitor) => {
        acc[monitor.id] = monitor.intervalo || 1;
        return acc;
      }, {});
      setIntervalos(intervalosIniciais);
    } catch (error) {
      setMensagem("Erro ao buscar URLs monitoradas");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetalhesMonitoramento = async (monitor) => {
    try {
      setMensagem("Carregando detalhes...");
      const response = await fetch(
        `https://biomob-api.com:3202/monitor-results?url=${monitor.url}&userId=${monitor.user_id}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar detalhes do monitoramento");
      }
      const data = await response.json();
      setDetalhesMonitoramento(data);
      setUrlSelecionada(monitor.url);

      // Calcula o histórico de momentos offline
      const historico = data.filter((detalhe) => detalhe.status === "offline");
      setHistoricoOffline(historico);

      // Calcula a porcentagem de tempo online e offline
      const total = data.length;
      if (total > 0) {
        const onlineCount = data.filter((detalhe) => detalhe.status === "online").length;
        const offlineCount = total - onlineCount;

        setPorcentagemOnline(((onlineCount / total) * 100).toFixed(2));
        setPorcentagemOffline(((offlineCount / total) * 100).toFixed(2));
      } else {
        setPorcentagemOnline(0);
        setPorcentagemOffline(0);
      }

      setDetalhesVisiveis(true);
      setMensagem("");
    } catch (error) {
      setMensagem("Erro ao buscar detalhes do monitoramento");
    }
  };

  const handleAddUrl = async () => {
    if (!url) {
      setMensagem("Por favor, insira uma URL válida.");
      return;
    }

    // Valida a URL (adiciona https:// se não estiver presente)
    let urlValidada = url;
    if (!urlValidada.startsWith('http://') && !urlValidada.startsWith('https://')) {
      urlValidada = 'https://' + urlValidada;
    }

    try {
      setMensagem("Adicionando URL...");
      const response = await fetch("https://biomob-api.com:3202/dominio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: usuario.id,
          url: urlValidada,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar a URL");
      }

      setMensagem("URL adicionada com sucesso!");
      setUrl(""); // Limpa o campo de entrada
      fetchUrls(usuario.id); // Atualiza a lista de URLs
    } catch (error) {
      setMensagem("Erro ao adicionar a URL.");
      console.error("Erro:", error);
    }
  };

  const showDeleteConfirmation = (id) => {
    setDeletingId(id);
    setConfirmDelete(true);
  };

  const handleDeleteUrl = async (id) => {
    try {
      setMensagem("Excluindo URL...");
      const response = await fetch(`https://biomob-api.com:3202/dominio/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar a URL");
      }

      setMensagem("URL excluída com sucesso!");
      setConfirmDelete(false);
      setDeletingId(null);
      fetchUrls(usuario.id);
    } catch (error) {
      setMensagem("Erro ao excluir a URL.");
    }
  };

  const handleIntervalChange = (id, value) => {
    setIntervalos((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleMonitoramento = async (monitor, action) => {
    try {
      setMensagem(`${action === "start" ? "Iniciando" : "Parando"} monitoramento...`);
      const response = await fetch("https://biomob-api.com:3202/monitor-start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: monitor.url,
          timeInMinutes: intervalos[monitor.id],
          userId: usuario.id,
          action: action,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Erro ao ${action === "start" ? "iniciar" : "parar"} o monitoramento`
        );
      }

      setMensagem(
        `Monitoramento ${action === "start" ? "iniciado" : "parado"} com sucesso!`
      );
      fetchUrls(usuario.id);
    } catch (error) {
      setMensagem(`Erro ao ${action === "start" ? "iniciar" : "parar"} o monitoramento.`);
    }
  };

  const fecharModal = () => {
    setDetalhesVisiveis(false);
    setDetalhesMonitoramento([]);
  };

  // Função que retorna a classe de cor baseada no status
  const getStatusColor = (status) => {
    return status === "online" 
      ? "text-green-500 bg-green-50 border-green-200" 
      : "text-red-500 bg-red-50 border-red-200";
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Monitoramento Detalhado | eYe Monitor</title>
        <meta name="description" content="Monitoramento detalhado de seus sites com o eYe Monitor" />
      </Head>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Monitoramento Detalhado
            </h1>
            
            {usuario ? (
              <div className="mb-4 text-white">
                <p className="text-lg">
                  Bem-vindo, <strong>{usuario.nome || 'Usuário'}</strong>!
                </p>
                <p className="text-sm opacity-80">{usuario.email}</p>
              </div>
            ) : (
              <p className="mb-4 text-white opacity-90">
                Carregando informações do usuário...
              </p>
            )}
            
            <p className="text-lg text-white opacity-90 mb-4 max-w-3xl mx-auto">
              Gerencie e monitore seus sites em tempo real, receba alertas e visualize estatísticas detalhadas.
            </p>
          </div>
        </div>

        {/* Adicionar nova URL */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaGlobe className="mr-2 text-blue-600" /> Adicionar novo site para monitoramento
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="text-gray-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite a URL para monitorar (ex: exemplo.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleAddUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <FaPlus className="mr-2" /> Adicionar URL
              </button>
            </div>
          </div>
        </div>

        {/* Lista de URLs monitoradas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaChartLine className="mr-2 text-blue-600" /> Minhas URLs Monitoradas
            </h2>
            <span className="text-sm text-gray-500">{urls.length} sites</span>
          </div>
          
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Carregando seus sites...</p>
              </div>
            ) : urls.length > 0 ? (
              urls.map((monitor) => (
                <div key={monitor.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${monitor.monitorando ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <h3 className="font-medium text-gray-900">{monitor.url}</h3>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <FaClock className="mr-1" />
                        <span>Intervalo: {intervalos[monitor.id] || 1} min</span>
                        <span className="ml-4 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                          {monitor.monitorando ? 'Monitorando' : 'Parado'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <input
                          type="number"
                          min="1"
                          className="w-16 py-1 px-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={intervalos[monitor.id] || 1}
                          onChange={(e) => handleIntervalChange(monitor.id, e.target.value)}
                        />
                        <span className="bg-gray-100 px-2 py-1 text-sm text-gray-600">min</span>
                      </div>
                      
                      <button
                        onClick={() => handleMonitoramento(monitor, monitor.monitorando ? "stop" : "start")}
                        className={`flex items-center justify-center h-8 w-8 rounded-lg ${
                          monitor.monitorando 
                            ? "bg-red-100 text-red-600 hover:bg-red-200" 
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                        title={monitor.monitorando ? "Parar monitoramento" : "Iniciar monitoramento"}
                      >
                        {monitor.monitorando ? <FaStop size={14} /> : <FaPlay size={14} />}
                      </button>
                      
                      <button
                        onClick={() => showDeleteConfirmation(monitor.id)}
                        className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                        title="Excluir URL"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                      
                      <button
                        onClick={() => fetchDetalhesMonitoramento(monitor)}
                        className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                        title="Ver detalhes"
                      >
                        <FaInfoCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaGlobe className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum site monitorado</h3>
                <p className="text-gray-500 mb-4">Adicione URLs para começar a monitorar seus sites</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Precisa monitorar mais sites?</h2>
          <p className="text-lg text-blue-700 mb-6">
            Conheça nossos planos avançados e monitore múltiplos sites com intervalos de verificação mais curtos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/planos" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Ver Planos
            </a>
            <a href="/fale-conosco" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Fale Conosco
            </a>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar exclusão</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir esta URL? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteUrl(deletingId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalhes do monitoramento */}
      {detalhesVisiveis && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto w-full sm:w-11/12 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaHistory className="mr-2 text-blue-600" /> 
                  Detalhes do Monitoramento
                </h2>
                <button
                  onClick={fecharModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">URL: {urlSelecionada}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Disponibilidade:</span>
                      <span className="text-green-600 font-medium">{porcentagemOnline}%</span>
                    </div>
                    
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${porcentagemOnline}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tempo offline:</span>
                      <span className="text-red-600 font-medium">{porcentagemOffline}%</span>
                    </div>
                    
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${porcentagemOffline}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 flex items-center">
                  <FaInfoCircle className="mr-1" />
                  Total de verificações: {detalhesMonitoramento.length}
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de verificações</h3>
              
              {detalhesMonitoramento.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data/Hora
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resposta
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detalhesMonitoramento.map((detalhe, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                detalhe.status === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                                {detalhe.status === "online" ? (
                                  <><FaCheck className="mr-1" /> Online</>
                                ) : (
                                  <><FaTimes className="mr-1" /> Offline</>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(detalhe.checked_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {detalhe.response_time ? `${detalhe.response_time}ms` : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
                  <p className="text-gray-500">Nenhum histórico de verificação disponível.</p>
                </div>
              )}
              
              {historicoOffline.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Períodos offline</h3>
                  
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data/Hora
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {historicoOffline.map((detalhe, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                <FaExclamationTriangle className="mr-1 inline-block" /> {formatDate(detalhe.checked_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={fecharModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalPopup mensagem={mensagem} onClose={() => setMensagem("")} />
    </div>
  );
};

export default MonitoramentoDetalhado;
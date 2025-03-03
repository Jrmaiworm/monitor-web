"use client";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { FaPlay, FaStop, FaTrashAlt, FaInfoCircle } from "react-icons/fa";
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

  useEffect(() => {
    const usuarioData = localStorage.getItem("user");
    if (usuarioData) {
      const user = JSON.parse(usuarioData);
      setUsuario(user);
      fetchUrls(user.id);
    }
  }, []);

  const fetchUrls = async (userId) => {
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
        acc[monitor.id] = 1;
        return acc;
      }, {});
      setIntervalos(intervalosIniciais);
    } catch (error) {
      setMensagem("Erro ao buscar URLs monitoradas");
    }
  };

  const fetchDetalhesMonitoramento = async (monitor) => {
    try {
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
      const onlineCount = data.filter((detalhe) => detalhe.status === "online").length;
      const offlineCount = total - onlineCount;

      setPorcentagemOnline(((onlineCount / total) * 100).toFixed(2));
      setPorcentagemOffline(((offlineCount / total) * 100).toFixed(2));

      setDetalhesVisiveis(true);
    } catch (error) {
      setMensagem("Erro ao buscar detalhes do monitoramento");
    }
  };

  const handleAddUrl = async () => {
    if (!url) {
      setMensagem("Por favor, insira uma URL válida.");
      return;
    }

    try {
      const response = await fetch("https://biomob-api.com:3202/dominio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: usuario.id, // Usa o ID do usuário do localStorage
          url: url,
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

  const handleDeleteUrl = async (id) => {
    try {
      const response = await fetch(`https://biomob-api.com:3202/dominio/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar a URL");
      }

      setMensagem("URL deletada com sucesso!");
      fetchUrls(usuario.id);
    } catch (error) {
      setMensagem("Erro ao deletar a URL.");
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

  return (
    <div>
      

      <div className="w-full flex justify-center mt-8 bg-white h-full">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full sm:w-3/4 lg:w-full m-6">
          <h1 className="text-2xl font-bold text-red-700 mb-4 text-center">
            Monitoramento Detalhado
          </h1>
          {usuario ? (
            <div className="mb-6 text-center text-gray-700">
              <p>
                Bem-vindo, <strong>{usuario.nome}</strong>!
              </p>
              <p>Email: {usuario.email}</p>
            </div>
          ) : (
            <p className="mb-6 text-center text-gray-700">
              Carregando informações do usuário...
            </p>
          )}

          <div className="mb-4">
            <input
              type="text"
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Digite a URL para monitorar"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={handleAddUrl}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Adicionar URL
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Minhas URLs Monitoradas
            </h2>
            <ul className=" mb-6 text-gray-700">
              {urls.length > 0 ? (
                urls.map((monitor) => (
                  <li key={monitor.id} className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="flex-grow">{monitor.url}</span>
                      <span
                        className={
                          monitor.monitorando
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {monitor.monitorando ? (
                          <p className="text-xs">Monitorando...</p>
                        ) : (
                          <p className="text-xs">Parado</p>
                        )}
                      </span>
                      <input
                        type="number"
                        min="1"
                        className="border rounded w-20 py-1 px-2 mx-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={intervalos[monitor.id] || 1}
                        onChange={(e) => handleIntervalChange(monitor.id, e.target.value)}
                      />
                      <span className="text-xs">min</span>
                      <div className="flex space-x-2 mt-2 sm:mt-0 ml-0 sm:ml-4">
                        <button
                          onClick={() =>
                            handleMonitoramento(monitor, monitor.monitorando ? "stop" : "start")
                          }
                          className={`${
                            monitor.monitorando ? "text-red-500" : "text-green-500"
                          } hover:text-red-700 transition-colors`}
                        >
                          {monitor.monitorando ? (
                            <FaStop size={15} />
                          ) : (
                            <FaPlay size={15} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUrl(monitor.id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <FaTrashAlt size={15} />
                        </button>
                        <button
                          onClick={() => fetchDetalhesMonitoramento(monitor)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <FaInfoCircle size={15} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-700">
                  Nenhuma URL monitorada encontrada.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {detalhesVisiveis && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-11/12 lg:w-9/12">
            <h2 className="text-xl font-bold mb-4">
              Detalhes do Monitoramento: {urlSelecionada}
            </h2>

            {/* Exibe porcentagens de online e offline */}
            <div className="mb-4">
              <p className="text-green-500">Online: {porcentagemOnline}%</p>
              <p className="text-red-500">Offline: {porcentagemOffline}%</p>
            </div>

            {/* Linha do tempo rolável horizontalmente */}
            <div id="timeline" className="overflow-x-auto bg-gray-200 p-2 rounded-lg">
              <div className="flex space-x-4">
                {detalhesMonitoramento.map((detalhe, index) => (
                  <div
                    key={index}
                    className={`flex-1 text-center text-[9px]  ${
                      detalhe.status === "online"
                        ? " text-green-500"
                        : " text-red-500"
                    }`}
                  >
                    {new Date(detalhe.checked_at).toLocaleString()}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={fecharModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold  px-2 rounded"
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

"use client";
import Head from "next/head";
import React, { useEffect, useState } from "react";
// Importe os novos componentes
import HeroSection from "./components/HeroSection";
import AddUrlCard from "./components/AddUrlCard";
import SettingsCard from "./components/SettingsCard";
import MonitoredUrlsList from "./components/MonitoredUrlsList";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import MonitoringDetailsModal from "./components/MonitoringDetailsModal";
import CtaSection from "./components/CtaSection";
import ModalPopup from "../components/ModalPopup"; // Mantenha este se ainda for necessário
import api from "../../api/api"; // Certifique-se de que o caminho está correto

const Home = () => {
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
  const [limiteAtingido, setLimiteAtingido] = useState(false);
  const [limiteUrls, setLimiteUrls] = useState(0);

  // Novos estados para notificações
  const [notificacoes, setNotificacoes] = useState({
    email_notificacao1: "",
    email_notificacao2: "",
    email_notificacao3: "",
    email_notificacao4: "",
    email_notificacao5: "",
    telefone_notificacao: "",
    falhas: false,
    relatorio_mensal: false,
    contatosEmail: [],
  });
  const [newEmailContact, setNewEmailContact] = useState('');
  // NOVO ESTADO: ID do monitor selecionado para configuração
  const [selectedMonitorId, setSelectedMonitorId] = useState(null);


  useEffect(() => {
    const usuarioData = localStorage.getItem("user");
    if (usuarioData) {
      const user = JSON.parse(usuarioData);
      setUsuario(user);

      if (user.plano === "BASICO") {
        setLimiteUrls(1);
      } else if (user.plano === "AVANCADO") {
        setLimiteUrls(3);
      } else if (user.plano === "SUPER") {
        setLimiteUrls(10);
      } else {
        setLimiteUrls(1);
      }

      fetchUrls(user.id);
    } else {
      setIsLoading(false);
    }
  }, [usuario?.plano]);

  const fetchUrls = async (userId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/dominio?userId=${userId}`);
      setUrls(response.data);

      if (response.data.length > 0) {
        // Define o primeiro monitor como selecionado por padrão
        setSelectedMonitorId(response.data[0].id);
        // Carrega as configurações de notificação do primeiro monitor
        loadMonitorNotifications(response.data[0]);
      } else {
        // Reseta as configurações se não houver URLs
        setSelectedMonitorId(null);
        resetNotificationSettings();
      }

      if (usuario?.plano === "BASICO" && response.data.length >= 1) {
        setLimiteAtingido(true);
      } else if (usuario?.plano === "AVANCADO" && response.data.length >= 3) {
        setLimiteAtingido(true);
      } else if (usuario?.plano === "SUPER" && response.data.length >= 10) {
        setLimiteAtingido(true);
      } else {
        setLimiteAtingido(false);
      }

      const intervalosIniciais = response.data.reduce((acc, monitor) => {
        acc[monitor.id] = monitor.intervalo_minutos || 1;
        return acc;
      }, {});
      setIntervalos(intervalosIniciais);
    } catch (error) {
      setMensagem("Erro ao buscar URLs monitoradas");
      console.error("Erro ao buscar URLs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // NOVA FUNÇÃO: Carrega as configurações de notificação de um monitor específico
  const loadMonitorNotifications = (monitor) => {
    setNotificacoes({
      email_notificacao1: monitor.email_notificacao1 || "",
      email_notificacao2: monitor.email_notificacao2 || "",
      email_notificacao3: monitor.email_notificacao3 || "",
      email_notificacao4: monitor.email_notificacao4 || "",
      email_notificacao5: monitor.email_notificacao5 || "",
      telefone_notificacao: monitor.telefone_notificacao || "",
      falhas: monitor.falhas || false,
      relatorio_mensal: monitor.relatorio_mensal || false,
      contatosEmail: [
        monitor.email_notificacao1,
        monitor.email_notificacao2,
        monitor.email_notificacao3,
        monitor.email_notificacao4,
        monitor.email_notificacao5,
      ].filter(Boolean), // Filtra valores vazios para o array dinâmico
    });
  };

  // NOVA FUNÇÃO: Reseta as configurações de notificação para o estado inicial
  const resetNotificationSettings = () => {
    setNotificacoes({
      email_notificacao1: "",
      email_notificacao2: "",
      email_notificacao3: "",
      email_notificacao4: "",
      email_notificacao5: "",
      telefone_notificacao: "",
      falhas: false,
      relatorio_mensal: false,
      contatosEmail: [],
    });
    setNewEmailContact("");
  };


  const fetchDetalhesMonitoramento = async (monitor) => {
    try {
      setMensagem("Carregando detalhes...");
      const response = await api.get(
        `/monitor-results?url=${monitor.url}&userId=${monitor.user_id}`
      );

      setDetalhesMonitoramento(response.data);
      setUrlSelecionada(monitor.url);

      const historico = response.data.filter((detalhe) => detalhe.status === "offline");
      setHistoricoOffline(historico);

      const total = response.data.length;
      if (total > 0) {
        const onlineCount = response.data.filter((detalhe) => detalhe.status === "online").length;
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
      console.error("Erro ao buscar detalhes:", error);
    }
  };

  const handleAddUrl = async () => {
    if (!url) {
      setMensagem("Por favor, insira uma URL válida.");
      return;
    }

    if (
      (usuario?.plano === "BASICO" && urls.length >= 1) ||
      (usuario?.plano === "AVANCADO" && urls.length >= 3) ||
      (usuario?.plano === "SUPER" && urls.length >= 10)
    ) {
      setMensagem(
        "Você atingiu o limite de URLs para o seu plano. Faça upgrade para adicionar mais URLs."
      );
      return;
    }

    let urlValidada = url;
    if (!urlValidada.startsWith("http://") && !urlValidada.startsWith("https://")) {
      urlValidada = "https://" + urlValidada;
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao adicionar a URL");
      }

      setMensagem("URL adicionada com sucesso!");
      setUrl("");
      fetchUrls(usuario.id);
    } catch (error) {
      setMensagem(`Erro ao adicionar a URL: ${error.message}`);
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
      const response = await api.delete(`/dominio/${id}`);

      if (response.status !== 200) {
        throw new Error("Erro ao deletar a URL");
      }

      setMensagem("URL excluída com sucesso!");
      setConfirmDelete(false);
      setDeletingId(null);
      fetchUrls(usuario.id);
    } catch (error) {
      setMensagem("Erro ao excluir a URL.");
      console.error("Erro ao excluir:", error);
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

      const response = await api.post("/monitor-start", {
        url: monitor.url,
        timeInMinutes: intervalos[monitor.id],
        userId: usuario.id,
        action: action,
      });

      if (response.status !== 200) {
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
      console.error("Erro no monitoramento:", error);
    }
  };

  const fecharModalDetalhes = () => {
    setDetalhesVisiveis(false);
    setDetalhesMonitoramento([]);
    setHistoricoOffline([]);
    setUrlSelecionada("");
  };

  // Lógica para lidar com a seleção de um monitor no SettingsCard
  const handleMonitorSelectChange = (e) => {
    const selectedId = e.target.value;
    setSelectedMonitorId(selectedId);
    const selectedMonitor = urls.find(monitor => String(monitor.id) === selectedId);
    if (selectedMonitor) {
      loadMonitorNotifications(selectedMonitor);
    } else {
      resetNotificationSettings();
    }
  };


  const handleUpdateNotifications = async () => {
    if (!selectedMonitorId) {
      setMensagem("Por favor, selecione uma URL para configurar as notificações.");
      return;
    }

    try {
      setMensagem("Salvando configurações de notificação...");

      const body = {
        email_notificacao1: notificacoes.contatosEmail[0] || null,
        email_notificacao2: notificacoes.contatosEmail[1] || null,
        email_notificacao3: notificacoes.contatosEmail[2] || null,
        email_notificacao4: notificacoes.contatosEmail[3] || null,
        email_notificacao5: notificacoes.contatosEmail[4] || null,
        telefone_notificacao: notificacoes.telefone_notificacao || null,
        falhas: notificacoes.falhas,
        relatorio_mensal: notificacoes.relatorio_mensal,
      };

      // Adicione um log para verificar o body enviado
      console.log("Enviando PUT para /monitor/", selectedMonitorId, "com body:", body);
      
      const response = await api.put(`/monitor/${selectedMonitorId}`, body);

      if (response.status !== 200) {
        throw new Error("Erro ao salvar configurações de notificação.");
      }

      setMensagem("Configurações de notificação salvas com sucesso!");
      // Opcional: Atualize a lista de URLs para que as configurações salvas sejam refletidas
      fetchUrls(usuario.id);
    } catch (error) {
      setMensagem(`Erro ao salvar: ${error.message}`);
      console.error("Erro ao atualizar notificações:", error);
    }
  };

  const handleAddEmailContact = () => {
    const trimmedEmail = newEmailContact.trim();
    if (trimmedEmail && !notificacoes.contatosEmail.includes(trimmedEmail) && notificacoes.contatosEmail.length < 5) {
      setNotificacoes(prev => ({
        ...prev,
        contatosEmail: [...prev.contatosEmail, trimmedEmail]
      }));
      setNewEmailContact('');
    } else if (notificacoes.contatosEmail.length >= 5) {
      setMensagem("Limite de 5 e-mails de notificação atingido.");
    } else if (!trimmedEmail) {
      setMensagem("O campo de e-mail não pode ser vazio.");
    }
  };

  const handleRemoveEmailContact = (emailToRemove) => {
    setNotificacoes(prev => ({
      ...prev,
      contatosEmail: prev.contatosEmail.filter(email => email !== emailToRemove)
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Monitoramento Detalhado | eYe Monitor</title>
        <meta
          name="description"
          content="Monitoramento detalhado de seus sites com o eYe Monitor"
        />
      </Head>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <HeroSection usuario={usuario} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AddUrlCard
            url={url}
            setUrl={setUrl}
            handleAddUrl={handleAddUrl}
            limiteAtingido={limiteAtingido}
            usuario={usuario}
            limiteUrls={limiteUrls}
            urls={urls}
          />
          <SettingsCard
            notificacoes={notificacoes}
            setNotificacoes={setNotificacoes}
            handleUpdateNotifications={handleUpdateNotifications}
            newEmailContact={newEmailContact}
            setNewEmailContact={setNewEmailContact}
            handleAddEmailContact={handleAddEmailContact}
            handleRemoveEmailContact={handleRemoveEmailContact}
            urls={urls} // Passa a lista de URLs para o select
            selectedMonitorId={selectedMonitorId} // Passa o ID selecionado
            handleMonitorSelectChange={handleMonitorSelectChange} // Passa a função de mudança
            isLoadingUrls={isLoading} // Para desabilitar o select enquanto carrega
          />
        </div>

        <MonitoredUrlsList
          urls={urls}
          isLoading={isLoading}
          intervalos={intervalos}
          handleIntervalChange={handleIntervalChange}
          handleMonitoramento={handleMonitoramento}
          showDeleteConfirmation={showDeleteConfirmation}
          fetchDetalhesMonitoramento={fetchDetalhesMonitoramento}
        />

        <CtaSection />
      </div>

      <DeleteConfirmationModal
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleDeleteUrl={handleDeleteUrl}
        deletingId={deletingId}
      />

      <MonitoringDetailsModal
        detalhesVisiveis={detalhesVisiveis}
        fecharModal={fecharModalDetalhes}
        urlSelecionada={urlSelecionada}
        porcentagemOnline={porcentagemOnline}
        porcentagemOffline={porcentagemOffline}
        detalhesMonitoramento={detalhesMonitoramento}
        historicoOffline={historicoOffline}
      />

      <ModalPopup mensagem={mensagem} onClose={() => setMensagem("")} />
    </div>
  );
};

export default Home;
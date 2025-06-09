// components/SettingsCard.js
import React from 'react';
import { 
  FaCog, FaEllipsisV, FaPlus, FaTimesCircle, FaBell, FaSave, FaExclamationTriangle 
} from 'react-icons/fa';

const SettingsCard = ({
  notificacoes,
  setNotificacoes,
  handleUpdateNotifications,
  newEmailContact,
  setNewEmailContact,
  handleAddEmailContact,
  handleRemoveEmailContact, // Manter esta prop
  urls,
  selectedMonitorId,
  handleMonitorSelectChange,
  isLoadingUrls,
}) => {
  const handleCheckboxChange = (e) => {
    setNotificacoes(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  const handlePhoneChange = (e) => {
    setNotificacoes(prev => ({
      ...prev,
      numero_whatsapp: e.target.value
    }));
  };

  // NOVA FUNÇÃO: Lógica para remover e-mail com validação
  const handleRemoveEmailWithValidation = (emailToRemove) => {
    // Verifica se há apenas um e-mail e se é ele que está sendo removido
    if (notificacoes.contatosEmail.length === 1 && notificacoes.contatosEmail[0] === emailToRemove) {
      setNotificacoes(prev => ({
        ...prev,
        contatosEmail: [], // Limpa o array de e-mails
        falhas: false, // Desmarca notificação de falhas
        relatorio_mensal: false, // Desmarca relatório mensal
      }));
    } else {
      // Se não for o último, remove normalmente
      setNotificacoes(prev => ({
        ...prev,
        contatosEmail: prev.contatosEmail.filter(email => email !== emailToRemove)
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaCog className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Configurações de Notificação</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaEllipsisV />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Select para escolher a URL */}
          <div className="mb-4">
            <label htmlFor="monitor-select" className="block text-sm font-medium text-gray-700 mb-1">
              Selecione a URL para configurar notificações:
            </label>
            <select
              id="monitor-select"
              className="text-gray-700 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedMonitorId || ''}
              onChange={handleMonitorSelectChange}
              disabled={isLoadingUrls || urls.length === 0}
            >
              <option value="" disabled>
                {isLoadingUrls ? "Carregando URLs..." : (urls.length === 0 ? "Nenhuma URL disponível" : "Selecione uma URL")}
              </option>
              {urls.map((monitor) => (
                <option key={monitor.id} value={monitor.id}>
                  {monitor.url}
                </option>
              ))}
            </select>
            {!selectedMonitorId && urls.length > 0 && (
              <p className="mt-2 text-sm text-yellow-600">
                <FaExclamationTriangle className="inline mr-1" /> Por favor, selecione uma URL acima para editar as configurações.
              </p>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Campos de notificação (habilitados apenas se um monitor estiver selecionado) */}
          <fieldset disabled={!selectedMonitorId}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alertas por E-mail</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="falhas"
                    checked={notificacoes.falhas}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Notificar sobre falhas no site
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="relatorio_mensal"
                    checked={notificacoes.relatorio_mensal}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Receber relatório mensal de desempenho
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contatos de E-mail para Alertas (máx. 5)</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="email"
                    placeholder="novo.email@exemplo.com"
                    className="flex-grow rounded-l-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newEmailContact}
                    onChange={(e) => setNewEmailContact(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEmailContact();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddEmailContact}
                    className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newEmailContact || notificacoes.contatosEmail.length >= 5}
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                {notificacoes.contatosEmail.map((email, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-500">{email}</span>
                    <button
                      onClick={() => handleRemoveEmailWithValidation(email)} // CHAMA A NOVA FUNÇÃO AQUI
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={notificacoes.contatosEmail.length === 0} // Desabilita se não houver emails para remover
                    >
                      <FaTimesCircle size={14} />
                    </button>
                  </div>
                ))}
                {notificacoes.contatosEmail.length === 0 && (
                    <p className="text-sm text-gray-400">Nenhum e-mail adicionado ainda.</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone para Notificações (Whatsapp)</label>
              <input
                type="text"
                placeholder="+55 (DD) 9XXXX-XXXX"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={notificacoes.numero_whatsapp}
                onChange={handlePhoneChange}
              />
            </div>

            <div className="pt-3">
              <button
                onClick={handleUpdateNotifications}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedMonitorId}
              >
                <FaSave className="mr-2" />
                Salvar Configurações
              </button>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
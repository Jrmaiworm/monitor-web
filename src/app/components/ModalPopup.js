
import React from "react";


const ModalPopup = ({ mensagem, onClose }) => {
    if (!mensagem) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="text-center text-gray-800">{mensagem}</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default ModalPopup;

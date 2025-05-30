// components/DeleteConfirmationModal.js
import React from 'react';

const DeleteConfirmationModal = ({ confirmDelete, setConfirmDelete, handleDeleteUrl, deletingId }) => (
    confirmDelete && (
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
    )
);

export default DeleteConfirmationModal;
"use client";
import './page.css';
import React from "react";
import { Divider, Input } from "antd";

interface User {
    key: string;
    name: string;
    email: string;
    pass_client: string;
    cnpj_client: string;
    name_enterprise: string;
    amount_paid: number;
    isadmin: string;
    date_created: string;
}

interface ModalProps {
    isModalOpen: boolean;
    selectedUser: User | null;
    editMode: boolean;
    onClose: () => void;
    onSave: () => void;
    onCancelEdit: () => void;
    onEdit: () => void;
    setSelectedUser: (user: User) => void;
}

const Modal = ({
    isModalOpen,
    selectedUser,
    editMode,
    onClose,
    onSave,
    onCancelEdit,
    onEdit,
    setSelectedUser,
}: ModalProps) => {
    if (!isModalOpen || !selectedUser) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{editMode ? 'Editar Usuário' : 'Informações do Usuário'}</h2>
                <Divider />
                <div>
                    <p><strong>Nome:</strong></p>
                    <Input
                        value={selectedUser.name}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, name: e.target.value })
                        }
                        disabled={!editMode}
                    />
                </div>
                <div>
                    <p><strong>Email:</strong></p>
                    <Input
                        value={selectedUser.email}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, email: e.target.value })
                        }
                        disabled={!editMode}
                    />
                </div>
                <div>
                    <p><strong>Senha:</strong></p>
                    <Input
                        value={selectedUser.pass_client}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, pass_client: e.target.value })
                        }
                        disabled={!editMode}
                    />
                </div>
                <div>
                    <p><strong>CNPJ:</strong></p>
                    <Input
                        value={selectedUser.cnpj_client}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, cnpj_client: e.target.value })
                        }
                        disabled={!editMode}
                    />
                </div>
                <div>
                    <p><strong>Nome da Empresa:</strong></p>
                    <Input
                        value={selectedUser.name_enterprise}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, name_enterprise: e.target.value })
                        }
                        disabled={!editMode}
                    />
                </div>
                <div>
                    <p><strong>Valor:</strong></p>
                    <Input
                        value={selectedUser.amount_paid}
                        onChange={(e) =>
                            setSelectedUser({
                                ...selectedUser,
                                amount_paid: parseFloat(e.target.value) || 0,
                            })
                        }
                        disabled={!editMode}
                    />
                </div>
                <div>
                    <p><strong>Admin:</strong></p>
                    <Input
                        value={selectedUser.isadmin}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, isadmin: e.target.value })
                        }
                        disabled={!editMode}
                    />
                </div>
                <div>
                    <p><strong>Criado em:</strong></p>
                    <Input
                        value={selectedUser.date_created}
                        disabled={true}
                    />
                </div>
                <Divider />
                <div className="modal-actions">
                    {editMode ? (
                        <>
                            <button
                                onClick={onSave}
                                className="btn-save-modal"
                            >
                                Salvar
                            </button>
                            <button
                                onClick={onCancelEdit}
                                className="btn-cancel-modal"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onEdit}
                                className="btn-edit-modal"
                            >
                                Editar
                            </button>
                            <button
                                onClick={onClose}
                                className="btn-close-modal"
                            >
                                Fechar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
"use client";
import './page.css';
import axios from "axios";
import { Tooltip } from "antd";
import Modal from "../modal/page";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DeleteFilled, EyeFilled } from "@ant-design/icons";

interface DataType {
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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<DataType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.15.4:3001/');
        const mappedData = response.data.map((item: any, index: number) => ({
          key: item.id,
          name: item.name_client,
          email: item.email_client,
          pass_client: item.pass_client,
          cnpj_client: item.cnpj_client,
          name_enterprise: item.name_enterprise,
          amount_paid: item.amount_paid,
          isadmin: item.isadmin == 1 ? 'Sim' : 'Não',
          date_created: format(new Date(item.date_created), 'dd/MM/yyyy')
        }));
        setData(mappedData);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showModal = (user: DataType) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      const updatedFields = {
        name_client: selectedUser.name,
        email_client: selectedUser.email,
        pass_client: selectedUser.pass_client,
        cnpj_client: selectedUser.cnpj_client,
        name_enterprise: selectedUser.name_enterprise,
        amount_paid: selectedUser.amount_paid,
        isadmin: selectedUser.isadmin === 'Sim' ? 1 : 0,
      };

      await axios.put(`http://192.168.15.4:3001/put/${selectedUser.key}`, updatedFields);
      alert('Alterações salvas com sucesso!');

      // Atualiza a lista de usuários após a edição
      const updatedUsers = data.map((user) =>
        user.key === selectedUser.key ? selectedUser : user
      );
      setData(updatedUsers);

      // Fecha a modal automaticamente
      closeModal();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário. Tente novamente.');
    }
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este usuário?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://192.168.15.4:3001/delete/${userId}`);
      alert('Usuário deletado com sucesso!');

      // Atualiza a lista de usuários após a exclusão
      const updatedUsers = data.filter((user) => user.key !== userId);
      setData(updatedUsers);
    } catch (error) {
      alert('Erro ao deletar usuário. Tente novamente.');
    }
  };

  if (loading) {
    return <div><p>Carregando...</p></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Usuários</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nome da Empresa</th>
            <th>CNPJ</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.key}>
              <td>{user.name}</td>
              <td>{user.name_enterprise}</td>
              <td>{user.cnpj_client}</td>
              <td>
                <div className="btn-action-group">
                  <div>
                    <Tooltip title="Visualizar">
                      <button
                        className="btn-action"
                        onClick={() => showModal(user)}
                      >
                        <EyeFilled />
                      </button>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Deletar">
                      <button
                        className="btn-action"
                        onClick={() => handleDelete(user.key)}
                      >
                        <DeleteFilled />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal
        editMode={editMode}
        onSave={handleSave}
        onClose={closeModal}
        isModalOpen={isModalOpen}
        selectedUser={selectedUser}
        onEdit={() => setEditMode(true)}
        setSelectedUser={setSelectedUser}
        onCancelEdit={() => setEditMode(false)}
      />
    </div>
  );
};

export default Home;
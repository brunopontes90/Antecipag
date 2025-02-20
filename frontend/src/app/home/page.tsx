"use client";
import "./page.css";
import axios from "axios";
import { format } from "date-fns";
import { Divider, Input, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { DeleteFilled, EditFilled, EyeFilled } from "@ant-design/icons";

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
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
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
    setSelectedUser(user); // Define o usuário selecionado
    setIsModalOpen(true); // Abre o modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Fecha o modal
    setSelectedUser(null); // Reseta o usuário selecionado
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
                    <Tooltip title="Editar">
                      <button
                        className="btn-action"
                        onClick={() => showModal(user)}
                      >
                        <EditFilled />
                      </button>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Deletar">
                      <button
                        className="btn-action"
                        onClick={() => showModal(user)}
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
      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Informações do Usuário</h2>
            <Divider />
            <div>
              <p><strong>Email:</strong></p>
              <Input defaultValue={selectedUser.email} disabled={true} />
            </div>
            <div>
              <p><strong>Senha:</strong></p>
              <Input defaultValue={selectedUser.pass_client} disabled={true} />
            </div>
            <div>
              <p><strong>Valor:</strong></p>
              <Input defaultValue={selectedUser.amount_paid} disabled={true} />
            </div>
            <div>
              <p><strong>Admin:</strong></p>
              <Input defaultValue={selectedUser.isadmin} disabled={true} />
            </div>
            <div>
              <p><strong>Criado em:</strong></p>
              <Input defaultValue={selectedUser.date_created} disabled={true} />
            </div>
            <Divider />
            <div>
              <button
                onClick={closeModal}
                className="btn-close-modal"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
"use client";
import "./page.css";
import axios from "axios";
import { format } from "date-fns";
import { Divider, Input, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Input, Modal, Space, Spin, Table, Tooltip, Layout, theme, Card } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

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

  const { Content, Footer } = Layout;
  
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
    <Layout>
      <Content
        style={{
          // padding: '0 48px',
        }}
      >
        <div>
          <Table<DataType>
            columns={columns_home}
            dataSource={data}
          />
          <Modal
            // title="Informações"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Card title="Informações" bordered={true}>
              {selectedUser && (
                <div>
                  <div>
                    <p><strong>Email:</strong></p>
                    <Input defaultValue={selectedUser.email} disabled={true} />
                  </div>
                  <div>
                    <p><strong>Senha do Cliente:</strong></p>
                    <Input defaultValue={selectedUser.pass_client} disabled={true} />
                  </div>
                  <div>
                    <p><strong>Valor a Pagar:</strong></p>
                    <Input defaultValue={`R$ ${selectedUser.amount_paid}`} disabled={true} />
                  </div>
                  <div>
                    <p><strong>Administrador:</strong></p>
                    <Input defaultValue={selectedUser.isadmin} disabled={true} />
                  </div>
                  <div>
                    <p><strong>Criado em:</strong></p>
                    <Input defaultValue={selectedUser.date_created} disabled={true} />
                  </div>
                </div>
              )}
            </Card>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Home;
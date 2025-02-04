"use client";

import axios from "axios";
import type { TableProps } from 'antd';
import { useEffect, useState } from "react";
import { Input, Modal, Space, Spin, Table, Tooltip } from 'antd';
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
}

const Home = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          isadmin: item.isadmin == 1 ? 'Sim' : 'Não'
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

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return <div><Spin size="large" /></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const columns_home: TableProps<DataType>['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nome da Empresa',
      dataIndex: 'name_enterprise',
      key: 'name_enterprise',
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj_client',
      key: 'cnpj_client',
    },
    {
      title: 'Ação',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Visualizar">
            <EyeOutlined
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <EditOutlined />
          </Tooltip>
          <Tooltip title="Deletar">
            <DeleteOutlined />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table<DataType>
        columns={columns_home}
        dataSource={data}
      />
      <Modal
        title="Informações"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;

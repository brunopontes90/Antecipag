"use client";

import axios from "axios";
import { Space, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const Home = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.15.4:3001/');
        const mappedData = response.data.map((item: any, index: number) => ({
          key: item.id,
          name: item.name_client.toString(),
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Senha do Cliente',
      dataIndex: 'pass_client',
      key: 'pass_client',
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj_client',
      key: 'cnpj_client',
    },
    {
      title: 'Nome da Empresa',
      dataIndex: 'name_enterprise',
      key: 'name_enterprise',
    },
    {
      title: 'Valor a Pagar',
      dataIndex: 'amount_paid',
      key: 'amount_paid',
    },
    {
      title: 'Administrador',
      key: 'isadmin',
      dataIndex: 'isadmin',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Visualizar">
            <EyeOutlined />
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
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default Home;

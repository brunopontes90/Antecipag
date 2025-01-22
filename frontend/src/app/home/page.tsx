"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.15.4:3001/');
        setData(response.data);

      } catch (err) {
        setError('Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h1>Listagem de Dados</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name_client}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

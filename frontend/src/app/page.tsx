"use client";

import axios from "axios";
import './page.css';
import React, { FormEvent, useState } from "react";
import { Button, Checkbox, Form, Input, type FormProps } from "antd";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://192.168.15.4:3001/', { email, password });
      console.log(`Logado com sucesso: ${response.data}`);
      // Redireciona para a página inicial após login bem-sucedido
      router.push('/home');
    } catch (error) {
      console.error(`Falha no login: ${error}`);
    }
  }

  type FieldType = {
    email?: string;
    password?: string;
    remember?: boolean;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Sucesso:', values);
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Falha:', errorInfo);
  };

  return (
    <div className='div-form'>
      <Form
        name="basic"
        className='form'
        autoComplete="off"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onSubmitCapture={handleSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{ remember: false }}
      >
        <div className="h2-title">
          <h2>Antecipag</h2>
        </div>
        <Form.Item<FieldType>
          label="Email"
          name="email"
          className='form-item'
          rules={[
            {
              required: true,
              message: 'Por favor, insira o seu email!'
            }
          ]}
        >
          <Input
            className='input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Insira o seu email!"
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Senha"
          name="password"
          className='form-item'
          rules={[
            {
              required: true,
              message: 'Por favor, insira a sua senha!'
            }
          ]}
        >
          <Input
            type="password"
            className='input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Insira a sua senha!"
          />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Lembre-se de mim</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            className='form-button'
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

"use client";
import Axios from "axios";
import './page.css';
import React, { FormEvent, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, type FormProps } from "antd";
import { NextApiRequest, NextApiResponse } from "next";

const Login = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const [data, setData] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    try {
      useEffect(() => {
        Axios.get("http://http://192.168.15.4:3001/").then((res) => {
          setData(res.data);
          console.log(`Logado com sucesso: ${res.data}`);
          console.log('Aqui: ', res.data)
        });
      }, []);
    } catch (error) {
      console.error(`Falha no login: ${error}`);
    }
  }

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
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
          name="username"
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
            className='input'
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
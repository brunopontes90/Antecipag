import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function loginHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email, password } = req.body;

    try {
        const response = await axios.post(
            'http://http://192.168.15.4:3001/', { email, password }
        );

        // Fazer a requisição para a sua API Node.js
        const { token, isAdmin } = response.data;

        // Enviar o token e isAdmin para o cliente
        res.status(200).json({ token, isAdmin });
    } catch (error) {
        res.status(401).json({ error: 'Credenciais Invalidas' });
    }
}
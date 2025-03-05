import axios from "axios";
import { useRouter } from 'next/router'; // Para redirecionamento no Next.js

const api = axios.create({
    baseURL: "https://biomob-api.com:3202"
});

// Interceptor de requisição
api.interceptors.request.use(
    (config) => {
        const userJWT = localStorage.getItem('user');

        if (userJWT) {
            const user = JSON.parse(userJWT);
            console.log('token', user?.token);

            config.headers.Authorization = `Bearer ${user?.token}`;
        }
        return config;
    },
    (e) => {
        return Promise.reject(e);
    }
);

// Interceptor de resposta
api.interceptors.response.use(
    (response) => {
        return response; // Caso a resposta seja bem-sucedida, retorne ela normalmente
    },
    (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            // Se for 401 ou 403, deslogue o usuário e redirecione para /home
            localStorage.removeItem('user');
            const router = useRouter(); // Hook para redirecionamento
            router.push('/home');
        }

        return Promise.reject(error); // Rejeita a resposta com erro para ser tratada onde a requisição foi feita
    }
);

export default api;

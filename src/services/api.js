import axios from 'axios';

    // Instância para a API de Licenças
    const api = axios.create({

        baseURL: "http://192.168.200.124:8080", // Substitua pela URL real da sua API
        headers: {
            'Content-Type': 'application/json',
        },
    
    });
    api.interceptors.request.use(
        (config) => {
            // Adicione o token de autenticação ao cabeçalho, se disponível
            const token = localStorage.getItem('token'); // Ou de onde você armazena o token
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );


export default api;
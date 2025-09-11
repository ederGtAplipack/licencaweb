import axios from 'axios';

    // Inst�ncia para a API de Licen�as
    const api = axios.create({

        baseURL: "http://192.168.200.124:8080", // Substitua pela URL real da sua API
        headers: {
            'Content-Type': 'application/json',
        },
    
    });
    api.interceptors.request.use(
        (config) => {
            // Adicione o token de autentica��o ao cabe�alho, se dispon�vel
            const token = localStorage.getItem('token'); // Ou de onde voc� armazena o token
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
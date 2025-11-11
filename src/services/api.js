import axios from 'axios';

/*function getDefaultApiUrl() {
    // 1) Variável definida em build (.env.production ou .env.development)
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }

    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8080'; // URL para desenvolvimento
    }
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ":" + window.location.port : ""}`;
}

const apiBaseURL = getDefaultApiUrl();*/

//const apiBaseURL = process.env.REACT_APP_API_BASE_URL || "https://licenca-api.aplipack.com.br";

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || "http://192.168.200.149:8080";

    // Instância para a API de Licenças
    const api = axios.create({

        baseURL: apiBaseURL, // Substitua pela URL real da sua API
        headers: {
            'Content-Type': 'application/json',           
        },
        withCredentials: false, // Se precisar enviar cookies
    
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
export { apiBaseURL };
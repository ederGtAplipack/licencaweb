import axios from 'axios';

    // Instância para a API de Licenças
    const api = axios.create({

        baseURL: "http://localhost:8080", // Substitua pela URL real da sua API
    
    });


export default api;
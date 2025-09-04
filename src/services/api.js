import axios from 'axios';

    // Instância para a API de Licenças
    const api = axios.create({

        baseURL: "http://192.168.200.124:8080", // Substitua pela URL real da sua API
        headers: {
            'Content-Type': 'application/json',
        },
    
    });


export default api;
import axios from 'axios';

    // Inst�ncia para a API de Licen�as
    const api = axios.create({

        baseURL: "http://localhost:8080", // Substitua pela URL real da sua API
    
    });


export default api;
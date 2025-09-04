import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css"; // Certifique-se de que o Tailwind CSS está importado"
import api from "../../services/api";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    /* Função para lidar com o envio do formulário de login */
    async function handleLogin (e){
        e.preventDefault();

        // 🔒 Autenticação JWT virá depois
        const data = {
            username,
            password
        };
        try {   
            // Simula uma resposta de sucesso
            const response = await api.post("api/v1/Auth/Login" ,data); // Ajuste a rota conforme necessário 
            localStorage.setItem("username" ,username);
            localStorage.setItem("token" ,response.data.token); // Supondo que o token vem em response.data.token
            localStorage.setItem("refreshToken" ,response.data.refreshToken); 
            localStorage.setItem("expiration" ,response.data.expiration);   

            // Redireciona para a página principal após o login bem-sucedido    
            navigate("/dashboard/home"); // Ajuste a rota conforme necessário

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setError("Erro ao fazer login. Tente novamente.");
            return; 
        }
       
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-900">
            <div className="bg-white rounded-lg shadow-lg flex w-4/5 max-w-4xl overflow-hidden">

                {/* Lado Esquerdo */}
                <div className="hidden md:flex w-1/2 bg-indigo-900 text-white flex-col justify-center items-center p-10">
                    <img src="/img/Aplipack_Software.png" alt="Logo Aplipack" className="mb-6 w-32" />
                    <div className="text-4xl font-bold mb-4">LicencaWeb</div>
                    <p className="text-lg text-indigo-200">
                        Gerenciamento de Licenças.
                    </p>
                </div>

                {/* Lado Direito */}
                <div className="w-full md:w-1/2 p-10">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Acesso ao Sistema</h2>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Usuario por enquanto</label>
                        <input
                            id="username"
                            // Alterado de "email" para "text"
                            type="text"
                            placeholder="Nome de usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            //className="login-input"
                            required
                        />

                        <label className="text-sm text-gray-600 mb-1">Senha</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />

                        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" /> Lembrar-me
                            </label>
                            <a href="/" className="text-indigo-600 hover:underline">
                                Esqueci a senha ?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Acessar
                        </button>
                    </form>

                    <p className="mt-6 text-xs text-gray-500 text-center">
                        Aplipack Software, caso aceite os {" "}
                        <a href="/" className="text-indigo-600 hover:underline">Termos de Uso</a> &{" "}
                        <a href="/" className="text-indigo-600 hover:underline">Politcas Privativas</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

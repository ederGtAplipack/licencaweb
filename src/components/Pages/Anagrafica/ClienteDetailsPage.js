// src/pages/Anagrafica/ClienteDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import "./Cliente_style.css";

export default function ClienteDetailsPage() {
    const { id } = useParams(); // Obtém o ID da URL
    const { idRevenda } = useParams();
    const [cliente, setCliente] = useState(null);
    const [revenda, setRevendas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabAtiva, setTabAtiva] = useState("detalhes"); // Estado para controlar a aba ativa

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                // Acessa o endpoint do backend para buscar os dados de um cliente específico
                const response = await api.get(`/api/v1/Anagrafica/${id}`);
                setCliente(response.data);
            } catch (err) {
                console.error("Erro ao carregar cliente:", err);
                setError("Erro ao carregar os dados do cliente.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCliente();
        }
    }, [id]);

    useEffect(() => {
        const fetchRevendas = async () => {
            if (cliente && cliente.idRevenda)
            {
                try {
                    const response = await api.get(`/api/v1/Revenda/${cliente.idRevenda}`);
                    setRevendas(response.data);
                } catch (err) {
                    console.error("Erro ao carregar Revendas", err);
                    setError("Erro ao carregar os dados de Revenda e Cliente.");
                }
            }
        };
        fetchRevendas();

    }, [cliente]);


    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    // Verifica se o cliente foi encontrado
    if (!cliente) {
        return <p>Cliente não encontrado.</p>;
    }

    return (
        <div className="card">
            <h1 className="main-title">{cliente.razaoSocial}</h1>
            <p className="sub-title">Detalhes do Cliente - ID: {cliente.idAnagrafica}</p>

            {/* Menu de Abas */}
            <div className="tabs">
                <button
                    className={`tab-button ${tabAtiva === "detalhes" ? "active" : ""}`}
                    onClick={() => setTabAtiva("detalhes")}
                >
                    Detalhes
                </button>
                <button
                    className={`tab-button ${tabAtiva === "contratos" ? "active" : ""}`}
                    onClick={() => setTabAtiva("contratos")}
                >
                    Contratos
                </button>
                <button
                    className={`tab-button ${tabAtiva === "revendas" ? "active" : ""}`}
                    onClick={() => setTabAtiva("revendas")}
                >
                    Revendas
                </button>
                {/* Adicione outras abas conforme a necessidade, ex: Licenças */}
            </div>

            {/* Conteúdo da Aba */}
            <div className="tab-content">
                {tabAtiva === "detalhes" && (
                    <div className="details-section">
                        {/* Exiba os campos do cliente aqui */}
                        <p><strong>Nome Fantasia:</strong> {cliente.nomeFantasia}</p>
                        <p><strong>CNPJ:</strong> {cliente.cnpj}</p>
                        <p><strong>Razão Social:</strong>{cliente.razaoSocial}</p>
                        <p><strong>Contato:</strong>{cliente.contato}</p>
                        <p><strong>CEP:</strong>{cliente.cep}</p>
                        <p><strong>Endereço:</strong>{cliente.endereco}</p>
                        <p><strong>Bairro:</strong>{cliente.bairro}</p>
                        <p><strong>Cidade:</strong>{cliente.cidade}</p>
                        <p><strong>UF:</strong>{cliente.uf}</p>
                        <p><strong>IE:</strong>{cliente.ie}</p>
                        <p><strong>Telefone:</strong>{cliente.telefone}</p>
                        <p><strong>E-mail:</strong>{cliente.email}</p>
                        <p><strong>Código de Revenda:</strong>{cliente.idRevenda}</p>
                        {/* ... outros campos */}
                    </div>
                )}
                {tabAtiva === "contratos" && (
                    <div className="details-section">
                        {/* Aqui você faria uma nova chamada para a API ou usaria dados já carregados para exibir os contratos */}
                        <h2>Contratos do Cliente</h2>
                        <p>Conteúdo da aba de Contratos.</p>
                        {/* Você pode criar um novo componente <ContratosTable /> para esta seção */}
                    </div>
                )}
                {tabAtiva === "revendas" && (
                    <div className="details-section">
                        {/* Aqui você faria uma nova chamada para a API ou usaria dados já carregados para exibir os contratos */}
                        {revenda ? (
                            <>
                                <p><strong>ID Revenda:</strong> {revenda.idRevenda}</p>
                                <p><strong>Razão Social:</strong> {revenda.razaoSocial}</p>
                                <p><strong>Nome Fantasia:</strong> {cliente.nomeFantasia}</p>
                                <p><strong>Contato:</strong> {cliente.contato}</p>
                                <p><strong>Telefone:</strong> {cliente.telefone}</p>
                                <p><strong>Email:</strong> {cliente.email}</p>
                            </>
                        ) : (
                            <p>Revenda não encontrada ou não associada a este cliente.</p>
                        )}
                    </div>
                )}
                {/* Outros conteúdos de abas */}
            </div>
        </div>
    );
}
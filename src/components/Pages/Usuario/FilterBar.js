// Usuario Filter Bar Component 
import React, { useEffect, useState } from "react";
import UsuarioModal from "../Usuario/UsuarioModal";
import api from "../../../services/api";

export default function TemplateFilterBar({ filtro, setFiltro, total }) {
    const [showModal, setShowModal] = useState(false);  
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [error, setError] = useState("");
    const [usuarios, setUsuarios] = useState([]);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/Auth/GetAllUsers");

            const data = Array.isArray(response.data) ? response.data : [response.data];
            console.log("Dados recebidos da API:", data); // Log para verificar os dados recebidos

            setUsuarios(data);
            setMensagem(`Total de registros: ${data.length}`);
            setError("");
        } catch (err) {
            console.error("Erro ao carregar Registros:", err);
            setError("Erro ao carregar dados.");
            setMensagem("");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);


    return (
        <div className="card">
            <div className="card-header">
                {/*<input
                    type="text"
                    placeholder="🔍 Buscar por Usuario ou Descrição..."
                    className="search-input"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />*/}
            </div>

            <div className="card-header-filtro-usuario">
                <div className="card-subheader">
                    {/*Filtrando por: <strong>{filtro || "Todos"}</strong>
                    <span style={{ marginLeft: 12 }}>
                        Total: <strong>{total}</strong>
                    </span>*/}
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                 + Novo Usuário
                </button>
                {showModal && (
                    <UsuarioModal onClose={() => setShowModal(false)} onSaved={loadData} />
                )}
            </div>
        </div>
    );
}

// src/pages/Anagrafica/AnagraficaPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import AnagraficaTable from "../Anagrafica/AnagraficaTable";
import AnagraficaModal from "../Anagrafica/AnagraficaModal";
import FilterBar from "../Anagrafica/FilterBar";
//import "../../style.css";
import "./form.css"; 

export default function AnagraficaPage() {
    const [anagraficas, setAnagraficas] = useState([]);
    const [showModal, setShowModal] = useState(false);  
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [error, setError] = useState("");
    const [filtro, setFiltro] = useState("");   


    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/Anagrafica/AllAnagrafica");
            setAnagraficas(response.data);
            setMensagem(`Total de registros: ${response.data.length}`);
            setError("");
        } catch (err) {
            console.error("Erro ao carregar anagráficas:", err);
            setError("Erro ao carregar dados.");
            setMensagem("");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
       

    const anagraficaFiltradas = anagraficas.filter((a) =>
        [a.razaoSocial, a.nomeFantasia, a.cnpj, a.cidade, a.contato, a.email].some((c) => c?.toLowerCase().includes(filtro.toLowerCase()))
    );

    return (
        <div className="continer" >
            <div>
                <FilterBar filtro={filtro} setFiltro={setFiltro} total={anagraficaFiltradas.length} />
            </div>
            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <p className="error">{error}</p>
                ) : (
                    <AnagraficaTable anagraficas={anagraficaFiltradas} />
            )}

            {showModal && (
                <AnagraficaModal onClose={() => setShowModal(false)} onSaved={loadData} />
            )}
        </div>
    );
}

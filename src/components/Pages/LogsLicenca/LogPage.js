// src/pages/Anagrafica/AnagraficaPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../../../services/api";
import LogTable from "../LogsLicenca/LogTable";
import LogModal from "../LogsLicenca/LogModal";
import FilterBar from "../LogsLicenca/FilterBar";
//import "../../style.css";
import "../LogsLicenca/Log_style.css";

// Componente para mensagens de sucesso/erro, reusado do SoftwareModal.js
const MessageModal = ({ type, message, onClear, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className={`message-content ${type}`}>
                <p>{message}</p>
                {type === "confirm" ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <button onClick={onConfirm} className="btn-confirm">
                            Sim
                        </button>
                        <button onClick={onClear} className="btn-cancel">
                            Não
                        </button>
                    </div>
                ) : (
                    <button onClick={onClear} className="btn-close-success">
                        Ok!
                    </button>
                )}
            </div>
        </div>
    );
};

export default function LicencaLogPage() {
    const [logs, setLogs] = useState([]);
    const [logsFiltrados, setLogsFiltrados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentLog, setCurrentLog] = useState(null);
    const [mensagem, setMensagem] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/v1/Logs/LicencaLog");
            setLogs(response.data);
        } catch (err) {
            console.error("Erro ao carregar Logs de Licenca:", err);
            setMensagem({ type: "error", text: "Erro ao carregar dados." });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Lógica de Filtro
    useEffect(() => {
        if (!filtro) {
            setLogsFiltrados(logs);
            return;
        }
            const lowerCaseFiltro = filtro.toLowerCase();
            const logsFiltrados = logs.filter((log) =>
                (log.endPoint?.toLowerCase().includes(lowerCaseFiltro)) ||
                (log.chave?.toLowerCase().includes(lowerCaseFiltro)) ||
                (log.numLic?.toLowerCase().includes(lowerCaseFiltro))
            );
            setLogsFiltrados(logsFiltrados);
        },[filtro, logs]);

    const handleDetails = (log) => {
        setCurrentLog(log);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentLog(null);
    };

    return (
        <div className="continer-ana">
            <div>
                <FilterBar
                    filtro={filtro}
                    setFiltro={setFiltro}
                    total={logsFiltrados.length}
                    onRefresh={loadData}
                    onAdd={null}
                />
            </div>
            <div className="card">
                {loading ? (
                    <p>Carregando Logs...</p>
                ) : error ? (
                    <p>Erro ao carregar Logs.</p>
                ) : (
                    <LogTable
                        logs={logsFiltrados}
                        onDetails={handleDetails}
                    />
                )}
            </div>

            {showModal && (
                <LogModal
                    onClose={handleCloseModal}
                    logData={currentLog}
                />
            )}

            {mensagem && (
                <MessageModal
                    type={mensagem.type}
                    message={mensagem.text}
                    onClear={() => setMensagem(null)}
                />
            )}
        </div>
    );
}
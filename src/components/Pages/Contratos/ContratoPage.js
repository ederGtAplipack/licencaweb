// src/pages/Contrato/ContratoPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import ContratoTable from "../Contratos/ContratoTable";
import ContratoModal from "../Contratos/ContratoModal";
import FilterBar from "../Contratos/FilterBar";
//import "../../style.css";
import "./form.css"; 

// Componente para mensagens de sucesso/erro, reusado do ContratoModal.js
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

export default function ContratoPage() {
    const [Contratos, setContratos] = useState([]);
    const [showModal, setShowModal] = useState(false);  
    const [currentContrato, setCurrentContrato] = useState(null); // Estado para o cliente a ser editado/cadastrado
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [error, setError] = useState("");
    const [filtro, setFiltro] = useState(""); 
    const [ContratoToDeleteId, setContratoToDeleteId] = useState(null);


    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/Contrato/AllContrato");
            setContratos(response.data);            
        } catch (err) {
            console.error("Erro ao carregar Contratos:", err);            
            setMensagem({ type: "error", text: "Erro ao carregar dados." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (Contratos) => {
        setCurrentContrato(Contratos);
        setShowModal(true);
    };

    // Ação para deletar - mostra a confirmação no modal
    const handleDeleteClick = (id) => {
        setContratoToDeleteId(id);
        setMensagem({ type: "confirm", text: "Tem certeza que deseja excluir este registro?" });
    };

    // Função que executa a exclusão após a confirmação
    const confirmDelete = async () => {
        setMensagem(null);
        setLoading(true);
        try {
            await api.delete(`/api/v1/Contrato/DeleteContrato/${ContratoToDeleteId}`);
            setMensagem({ type: "success", text: "Registro excluído com sucesso!" });
            loadData();
        } catch (err) {
            console.error("Erro ao excluir:", err);
            setMensagem({ type: "error", text: "Erro ao excluir registro." });
        } finally {
            setLoading(false);
            setContratoToDeleteId(null);
        }
    };
           
    // filtro simples (assegure que campos existem e são strings)
    const ContratoFiltradas = Contratos.filter((a) => {
        const search = filtro.trim().toLowerCase();
        if (!search) return true;
        const values = [
            String(a.qtdlicencas || ""),
            String(a.dataInicio || ""),
            String(a.datafim || ""),
            String(a.periodicidade || ""),
            String(a.statusContrato || ""),
            String(a.statusDescricao || ""),
            String(a.dataUltimoPagamento || ""),
            String(a.dataProximoPagamento || ""),
            String(a.Observacoes)
        ];
        return values.some((c) => c?.toLowerCase().includes(search));
    });

    const handleOnAdd = () => {
        setCurrentContrato(null);
        setShowModal(true);
    };

    return (
        <div className="continer-ana" >
            <div>
                <FilterBar filtro={filtro}
                    setFiltro={setFiltro}
                    total={ContratoFiltradas.length}
                    onAdd={handleOnAdd} />
            </div>
            <div className="card">
             {loading ? (
                    <p>Carregando...</p>
             ) : error ? (
                <p className="error">{error}</p>
             ) : (
                            <ContratoTable
                                Contratos={ContratoFiltradas}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                            />
             )}

             {showModal && (
               <ContratoModal
                        onClose={() => setShowModal(false)}
                        onSaved={async () => {
                            await loadData();
                            setShowModal(false);
                        }}
                        ContratoData={currentContrato}
               />
                )}
                {/* Modal de confirmação e mensagens de status */}
                {mensagem && (
                    <MessageModal
                        type={mensagem.type}
                        message={mensagem.text}
                        onClear={() => setMensagem(null)}
                        onConfirm={confirmDelete}
                    />
                )}
            </div>
        </div>
    );
}

// src/pages/Anagrafica/AnagraficaPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import RevendaTable from "../Revendas/RevendaTable";
import RevendaModal from "../Revendas/RevendaModal";
import FilterBar from "../Revendas/FilterBar";
//import "../../style.css";
import "./Revenda_style.css"; 

// Componente para mensagens de sucesso/erro, reusado do RevendaModal.js
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

export default function RevendaPage() {
    const [revendas, setRevendas] = useState([]);
    const [showModal, setShowModal] = useState(false);  
    const [currentRevenda, setCurrentRevenda] = useState(null); // Estado para o cliente a ser editado/cadastrado
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [error, setError] = useState("");
    const [filtro, setFiltro] = useState(""); 
    const [revendaToDeleteId, setRevendaToDeleteId] = useState(null);


    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/Revenda/AllRevenda");
            setRevendas(response.data);
        } catch (err) {
            console.error("Erro ao carregar Revendas:", err);
            setMensagem({ type: "error", text: "Erro ao carregar dados." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (revendas) => {
        setCurrentRevenda(revendas);
        setShowModal(true);
    };

    // Ação para deletar - mostra a confirmação no modal
    const handleDeleteClick = (id) => {
        setRevendaToDeleteId(id);
        setMensagem({ type: "confirm", text: "Tem certeza que deseja excluir este registro?" });
    };

    // Função que executa a exclusão após a confirmação
    const confirmDelete = async () => {
        setMensagem(null);
        setLoading(true);
        try {
            await api.delete(`/api/v1/Revenda/DeleteRevenda/${revendaToDeleteId}`);
            setMensagem({ type: "success", text: "Registro excluído com sucesso!" });
            loadData();
        } catch (err) {
            console.error("Erro ao excluir:", err);
            setMensagem({ type: "error", text: "Erro ao excluir registro." });
        } finally {
            setLoading(false);
            setRevendaToDeleteId(null);
        }
    };
           
    // filtro simples (assegure que campos existem e são strings)
    const revendasFiltradas = revendas.filter((a) => {
        const search = filtro.trim().toLowerCase();
        if (!search) return true;
        const values = [
            String(a.razaoSocial || "")
        ];
        return values.some((c) => c?.toLowerCase().includes(search));
    });

    const handleOnAdd = () => {
        setCurrentRevenda(null);
        setShowModal(true);
    };

    return (
        <div className="continer-ana" >
            <div>
                <FilterBar filtro={filtro}
                    setFiltro={setFiltro}
                    total={revendasFiltradas.length}
                    onAdd={handleOnAdd} />
            </div>
            <div className="card">
             {loading ? (
                    <p>Carregando...</p>
             ) : error ? (
                <p className="error">{error}</p>
             ) : (
                            <RevendaTable
                                revendas={revendasFiltradas}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                            />
             )}

             {showModal && (
               <RevendaModal
                        onClose={() => setShowModal(false)}
                        onSaved={async () => {
                            await loadData();
                            setShowModal(false);
                        }}
                        revendaData={currentRevenda}
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

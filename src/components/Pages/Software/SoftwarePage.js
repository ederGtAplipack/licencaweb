// src/pages/Anagrafica/AnagraficaPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import SoftwareTable from "../Software/SoftwareTable";
import SoftwareModal from "../Software/SoftwareModal";
import FilterBar from "../Software/FilterBar";
//import "../../style.css";
import "./Software_style.css"; 

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

export default function SoftwarePage() {
    const [Softwares, setSoftwares] = useState([]);
    const [showModal, setShowModal] = useState(false);  
    const [currentSoftware, setCurrentSoftware] = useState(null); // Estado para o cliente a ser editado/cadastrado
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [error, setError] = useState("");
    const [filtro, setFiltro] = useState(""); 
    const [SoftwareToDeleteId, setSoftwareToDeleteId] = useState(null);


    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/Software/AllSoftware");
            setSoftwares(response.data);
        } catch (err) {
            console.error("Erro ao carregar Softwares:", err);
            setMensagem({ type: "error", text: "Erro ao carregar dados." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (Softwares) => {
        setCurrentSoftware(Softwares);
        setShowModal(true);
    };

    // Ação para deletar - mostra a confirmação no modal
    const handleDeleteClick = (id) => {
        setSoftwareToDeleteId(id);
        setMensagem({ type: "confirm", text: "Tem certeza que deseja excluir este registro?" });
    };

    // Função que executa a exclusão após a confirmação
    const confirmDelete = async () => {
        setMensagem(null);
        setLoading(true);
        try {
            await api.delete(`/api/v1/Software/DeleteSoftware/${SoftwareToDeleteId}`);
            setMensagem({ type: "success", text: "Registro excluído com sucesso!" });
            loadData();
        } catch (err) {
            console.error("Erro ao excluir:", err);
            setMensagem({ type: "error", text: "Erro ao excluir registro." });
        } finally {
            setLoading(false);
            setSoftwareToDeleteId(null);
        }
    };
           
    // filtro simples (assegure que campos existem e são strings)
    const SoftwaresFiltradas = Softwares.filter((a) => {
        const search = filtro.trim().toLowerCase();
        if (!search) return true;
        const values = [
            String(a.razaoSocial || "")
        ];
        return values.some((c) => c?.toLowerCase().includes(search));
    });

    const handleOnAdd = () => {
        setCurrentSoftware(null);
        setShowModal(true);
    };

    return (
        <div className="continer-ana" >
            <div>
                <FilterBar filtro={filtro}
                    setFiltro={setFiltro}
                    total={SoftwaresFiltradas.length}
                    onAdd={handleOnAdd} />
            </div>
            <div className="card">
             {loading ? (
                    <p>Carregando...</p>
             ) : error ? (
                <p className="error">{error}</p>
             ) : (
                            <SoftwareTable
                                Softwares={SoftwaresFiltradas}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                            />
             )}

             {showModal && (
               <SoftwareModal
                        onClose={() => setShowModal(false)}
                        onSaved={async () => {
                            await loadData();
                            setShowModal(false);
                        }}
                        SoftwareData={currentSoftware}
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

// src/pages/Anagrafica/AnagraficaPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import AnagraficaTable from "../Anagrafica/AnagraficaTable";
import AnagraficaModal from "../Anagrafica/AnagraficaModal";
import FilterBar from "../Anagrafica/FilterBar";
//import "../../style.css";
import "./Cliente_style.css"; 

// Componente para mensagens de sucesso/erro, reusado do AnagraficaModal.js
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

export default function AnagraficaPage() {
    const [anagraficas, setAnagraficas] = useState([]);
    const [showModal, setShowModal] = useState(false);  
    const [currentAnagrafica, setCurrentAnagrafica] = useState(null); // Estado para o cliente a ser editado/cadastrado
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [error, setError] = useState("");
    const [filtro, setFiltro] = useState(""); 
    const [anagraficaToDeleteId, setAnagraficaToDeleteId] = useState(null);


    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/Anagrafica/AllAnagrafica");
            setAnagraficas(response.data);
            //setMensagem(`Total de registros: ${response.data.length}`);
            //setError("");
        } catch (err) {
            console.error("Erro ao carregar anagráficas:", err);
            //setError("Erro ao carregar dados.");
            setMensagem({ type: "error", text: "Erro ao carregar dados." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (anagraficas) => {
        setCurrentAnagrafica(anagraficas);
        setShowModal(true);
    };

    // Ação para deletar - mostra a confirmação no modal
    const handleDeleteClick = (id) => {
        setAnagraficaToDeleteId(id);
        setMensagem({ type: "confirm", text: "Tem certeza que deseja excluir este registro?" });
    };

    // Função que executa a exclusão após a confirmação
    const confirmDelete = async () => {
        setMensagem(null);
        setLoading(true);
        try {
            await api.delete(`/api/v1/Anagrafica/DeleteAnagrafica/${anagraficaToDeleteId}`);
            setMensagem({ type: "success", text: "Registro excluído com sucesso!" });
            loadData();
        } catch (err) {
            console.error("Erro ao excluir:", err);
            setMensagem({ type: "error", text: "Erro ao excluir registro." });
        } finally {
            setLoading(false);
            setAnagraficaToDeleteId(null);
        }
    };
           
    // filtro simples (assegure que campos existem e são strings)
    const anagraficaFiltradas = anagraficas.filter((a) => {
        const search = filtro.trim().toLowerCase();
        if (!search) return true;
        const values = [
            String(a.razaoSocial || ""),
            String(a.nomeFantasia || ""),
            String(a.cnpj || ""),
            String(a.cidade || ""),
            String(a.contato || ""),
            String(a.email || "")
        ];
        return values.some((c) => c?.toLowerCase().includes(search));
    });

    const handleOnAdd = () => {
        setCurrentAnagrafica(null);
        setShowModal(true);
    };

    return (
        <div className="continer-ana" >
            <div>
                <FilterBar filtro={filtro}
                    setFiltro={setFiltro}
                    total={anagraficaFiltradas.length}
                    onAdd={handleOnAdd} />
            </div>
            <div className="card">
             {loading ? (
                    <p>Carregando...</p>
             ) : error ? (
                <p className="error">{error}</p>
             ) : (
                            <AnagraficaTable
                                anagraficas={anagraficaFiltradas}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                            />
             )}

             {showModal && (
               <AnagraficaModal
                        onClose={() => setShowModal(false)}
                        onSaved={async () => {
                            await loadData();
                            setShowModal(false);
                        }}
                        anagraficaData={currentAnagrafica}
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

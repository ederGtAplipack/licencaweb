import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "../Software/Software_style.css";

//modal com sucesso ou erro 
const MessageModal = ({ type, message, onClear }) => {
    return (
        <div className="modal-overlay">
            <div className={`message-content ${type}`}>
                <p>{message}</p>
                <button onClick={onClear} className="btn-close-success">
                    Ok !
                </button>
            </div>
        </div>
    );
};  

// Objeto de estado inicial para um novo cliente
const initialState = {
    idSoftware: "",
    razaoSocial: ""    
};

export default function SoftwareModal({ onClose, onSaved, SoftwareData }) {
    // Usamos 'SoftwareData' para preencher o formulário ou 'initialState' para um novo
    const [form, setForm] = useState(SoftwareData || initialState);

    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    // Efeito para sincronizar o estado do formulário com a prop anagraficaData
    // Isso garante que o formulário seja preenchido corretamente para edições
    useEffect(() => {
        setForm(SoftwareData || initialState);
    }, [SoftwareData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };  

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);
        try {
            if (form.idSoftware) {
                // Modo de Edição - Envia para o endpoint de atualização
                await api.put(`/api/v1/Software/UpdateSoftware/${form.idSoftware}`, form);
                setMensagem({ type: "success", text: "Registro atualizado com sucesso!" });
                //onClose();
            } else {
                // Modo de Criação - Envia para o endpoint de criação
                const { idSoftware, ...payload } = form;
                await api.post("/api/v1/Software/CreateNewSoftware", payload);
                setMensagem({ type: "success", text: "Registro salvo com sucesso!" });
                //onClose();
            }
        } catch (err) {
            console.error("Erro ao salvar:", err.response?.data || err.message);
            setMensagem({ type: "error", text: "Erro ao salvar o registro !" });
        } finally {
            setLoading(false);
        }
    };

    // Auto-fechar mensagem de sucesso em 5s e depois fechar o modal principal
    useEffect(() => {
        if (mensagem?.type === "success") {
            const timer = setTimeout(() => {
                setMensagem(null);
                if (onSaved) {
                    onSaved();
                }
                onClose(); // fecha o modal principal depois de 5s
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mensagem, onClose, onSaved]);

    // Renderiza o formulário do modal
    return (
        <div className="modal-overlay-Software">
            <div className="modal-Software">
                <div className="container-Software">
                    <h2 className="form-title">{form.idSoftware ? "Editar Software" : "Nova Software"}</h2>
                     <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group-Software form-group-half">
                                <label>ID</label>
                                <input type="number" name="idSoftware" value={form.idSoftware} onChange={handleChange} className="form-control" disabled={!!form.idSoftware}
                                    style={{ display: form.idSoftware ? 'block' : 'none' }}
                                />
                            </div>
                            <div className="form-group-Software form-group-half">
                                <label>Nome</label>
                                <input type="nSoftware" name="nSoftware" value={form.nSoftware} onChange={handleChange} required className="form-control"  />
                            </div>                           
                            <div className="form-group-Software form-group-half">
                                <label>Descrição</label>
                                <input type="descricao" name="descricao" value={form.descricao} onChange={handleChange} required className="form-control" />
                            </div>                           
                        </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Salvando..." : "Salvar"}
                            </button>
                                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                                    Cancelar
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            {/* Modal secundário para mensagens */}
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

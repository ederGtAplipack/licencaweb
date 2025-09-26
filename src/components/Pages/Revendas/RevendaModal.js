import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "../Revendas/Revenda_style.css";

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
    idRevenda: "",
    razaoSocial: ""    
};

export default function RevendaModal({ onClose, onSaved, revendaData }) {
    // Usamos 'revendaData' para preencher o formulário ou 'initialState' para um novo
    const [form, setForm] = useState(revendaData || initialState);

    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    // Efeito para sincronizar o estado do formulário com a prop anagraficaData
    // Isso garante que o formulário seja preenchido corretamente para edições
    useEffect(() => {
        setForm(revendaData || initialState);
    }, [revendaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };  

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);
        try {
            if (form.idRevenda) {
                // Modo de Edição - Envia para o endpoint de atualização
                await api.put(`/api/v1/Revenda/UpdateRevenda/${form.idRevenda}`, form);
                setMensagem({ type: "success", text: "Registro atualizado com sucesso!" });
                //onClose();
            } else {
                // Modo de Criação - Envia para o endpoint de criação
                const { idRevenda, ...payload } = form;
                await api.post("/api/v1/Revenda/CreateNewRevenda", payload);
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
        <div className="modal-overlay-revenda">
            <div className="modal-revenda">
                <div className="container-revenda">
                    <h2 className="form-title">{form.idRevenda ? "Editar Revenda" : "Nova Revenda"}</h2>
                     <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group-revenda form-group-half">
                                <label>ID</label>
                                <input type="number" name="idRevenda" value={form.idRevenda} onChange={handleChange} className="form-control" disabled={!!form.idRevenda}
                                    style={{ display: form.idRevenda ? 'block' : 'none' }}
                                />
                            </div>
                            <div className="form-group-revenda form-group-half">
                                <label>Razão Social</label>
                                <input type="razaoSocial" name="razaoSocial" value={form.razaoSocial} onChange={handleChange} required className="form-control"  />
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

import React, { useState } from "react";
import api from "../../../services/api";
import "./form.css";

//modal com sucesso ou erro 
const SuccessModal = ({ message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content-success">
                <p>{message}</p>
                <button onClick={onClose} className="btn-close-success">Fechar</button>
            </div>
        </div>
    );
};  

export default function UsuarioModal({ onClose, onSaved }) {
    const [form, setForm] = useState({
        id: "",
        userName: "",
        email: "",
        password: "",
        key: ""
    });

    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);
        try {
            const payload = {
                ...form,
                idAnagrafica: parseInt(form.idAnagrafica, 10) || 0,
                idRevenda: parseInt(form.idRevenda, 10) || 0
            };

            await api.post("/api/v1/Auth/Register", payload);
            setMensagem({ type: "sucess", text: "Registro salvo com sucesso!" });
            onSaved(); // recarrega tabela
            //setShowSuccessModal(true);

            setTimeout(() => {
                onClose(); // fecha modal
            }, 5000);
        } catch (err) {
            console.error("Erro ao salvar:", err.response?.data || err.message);
            alert("Erro ao salvar registro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-usuario">
                <div className="container-usuario">
                    <h3 className="form-title">Novo Usuário</h3>
                    <form onSubmit={handleSubmit} className="form-usuario">
                        <div className="form-grid">
                            <div className="form-group-usuario form-group-half">
                                <label>Usuario</label>
                                <input type="text" name="userName" value={form.userName} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-usuario form-group-half">
                                <label>Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-usuario form-group-half">
                                <label>Senha</label>
                                <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-usuario form-group-half">
                                <label>Key</label>
                                <input type="text" name="key" value={form.key} onChange={handleChange} className="form-control" />
                            </div>                         
                            <div className="modal-buttons">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {mensagem && (
                <div className="modal-overlay">
                    <div className="modal-message">
                        <p>{mensagem.text}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setMensagem(null);
                                if (mensagem.type === "success") onClose();
                            }}
                        >
                            Salvo com sucesso !
                        </button>
                    </div>
                </div>
            )}
            {showErrorModal && (
                <SuccessModal
                    message={errorMessage || "Ocorreu um erro."}
                    onClose={() => setShowErrorModal(false)}
                />
            )}
        </div>
    );
}
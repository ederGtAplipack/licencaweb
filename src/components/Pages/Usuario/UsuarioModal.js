// src/components/Usuario/UsuarioModal.js
import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./Usuario_style.css";

// Componente para a mensagem de feedback
const MessageModal = ({ type, message, onClear }) => {
    return (
        <div className="modal-overlay">
          <div className={`message-content ${type}`}>
            <p>{message}</p>
            <button onClick={onClear} className="btn btn-primary">
                    Ok !
            </button>
          </div>
        </div>
    );
};

export default function UsuarioModal({ onClose, onSaved }) {
    const [form, setForm] = useState({
        userName: "",
        email: "",
        password: "",
        key: "",
        role: "",
    });

    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [mensagem, setMensagem] = useState(null); // { type: "success" | "error", text: "..." }


    /*Quando o componente é montado, o useEffect executa a função assíncrona fetchRoles que busca dados dos perfis na API.
    Os dados são normalizados em objetos { id, name } se forem strings. 
    O estado do componente (roles) é atualizado com os dados normalizados. 
    Em caso de erro, o estado é atualizado para um array vazio e o erro é registrado no console.*/
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get("/api/v1/Auth/GetAllRoles");
                const data = response.data || [];
                const normalized = data.map((r, i) =>
                    typeof r === "string" ? { id: `role-${i}`, name: r } : r
                );
                setRoles(normalized);
            } catch (err) {
                console.error("Erro ao carregar perfis:", err);
                setRoles([]);
            }
        };
        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);

        try {
            // Criar usuário
            const registerPayload = {
                userName: form.userName,
                email: form.email,
                password: form.password,
                key: form.key,
            };
            await api.post("/api/v1/Auth/Register", registerPayload);

            // Atribuir perfil
            if (form.role) {
                const assignRolePayload = { username: form.userName };
                await api.post(
                    `/api/v1/Auth/AssignRole?roleName=${encodeURIComponent(form.role)}`,
                    assignRolePayload
                );
            }

            setMensagem({
                type: "success",
                text: "Usuário e perfil atribuídos com sucesso!",
            });

            /*if (onSaved) {
                await onSaved();
            }*/
        } catch (err) {
            console.error("Erro ao salvar:", err.response?.data || err.message);
            const msg = err.response?.data?.message || "Erro ao salvar registro.";
            setMensagem({ type: "error", text: msg });
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

    return (
        <div className="modal-overlay-usuario">
            <div className="modal-usuario">
                <div className="container-usuario">
                    <h3 className="form-title">Novo Usuário</h3>

                    <form onSubmit={handleSubmit} className="form-usuario">
                        <div className="form-grid">
                            <div className="form-group-usuario form-group-half">
                                <label>Usuário</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={form.userName}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group-usuario form-group-half">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group-usuario form-group-half">
                                <label>Senha</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group-usuario form-group-half">
                                <label>Key</label>
                                <input
                                    type="text"
                                    name="key"
                                    value={form.key}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group-usuario form-group-full">
                                <label>Perfil</label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                >
                                    <option value="">-- Selecione --</option>
                                    {roles.map((r, i) => (
                                        <option key={`${r.id ?? r.name}-${i}`} value={String(r.name)}>
                                            {String(r.name)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-buttons">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Mensagem de feedback sobreposta */}
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
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

export default function AnagraficaModal({ onClose, onSaved }) {
    const [form, setForm] = useState({
        idAnagrafica: "",
        razaoSocial: "",
        nomeFantasia: "",
        contato: "",
        cep: "",
        endereco: "",
        bairro: "",
        cidade: "",
        uf: "",
        cnpj: "",
        ie: "",
        telefone: "",
        email: "",
        idRevenda: "",
        senha: ""
    });

    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);

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

            await api.post("/api/v1/Anagrafica/CreateAnagrafica", payload);
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

    // Renderiza o formulário do modal
    return (
        <div className="modal-overlay">
            <div className="modal-ana">
                <div className="container-ana">
                    <h2 className="form-title">Cadastro de Cliente</h2>
                     <form onSubmit={handleSubmit} className="formAnagrafica">
                        <div className="form-grid">
                            <div className="form-group-ana form-group-half">
                                <label>ID</label>
                                <input type="number" name="idAnagrafica" value={form.idAnagrafica} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-ana form-group-half">
                                <label>ID Revenda</label>
                                <input type="number" name="idRevenda" value={form.idRevenda} onChange={handleChange} className="form-control" />
                            </div>

                            {/* segunda linha*/}
                            <div className="form-group-ana form-group-half">
                                <label>Razão Social</label>
                                <input name="razaoSocial" value={form.razaoSocial} onChange={handleChange} required className="form-control" />
                            </div>

                            <div className="form-group-ana forma-group-full">
                                <label>Nome Fantasia</label>
                                <input name="nomeFantasia" value={form.nomeFantasia} onChange={handleChange} required className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>Contato</label>
                                <input name="contato" value={form.contato} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana form-group-half">
                                <label>CEP</label>
                                <input name="cep" value={form.cep} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana form-group-full">
                                <label>Endereço</label>
                                <input name="endereco" value={form.endereco} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana form-group-full">
                                <label>Bairro</label>
                                <input name="bairro" value={form.bairro} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>Cidade</label>
                                <input name="cidade" value={form.cidade} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>UF</label>
                                <input name="uf" value={form.uf} onChange={handleChange} maxLength="2" className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>CNPJ</label>
                                <input name="cnpj" value={form.cnpj} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>IE</label>
                                <input name="ie" value={form.ie} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>Telefone</label>
                                <input name="telefone" value={form.telefone} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>Senha</label>
                                <input type="password" name="senha" value={form.senha} onChange={handleChange} className="form-control" />
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
        </div>
    );
}

import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "../Anagrafica/Cliente_style.css";

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
};

export default function AnagraficaModal({ onClose, onSaved, anagraficaData }) {
    // Usamos 'anagraficaData' para preencher o formulário ou 'initialState' para um novo
    const [form, setForm] = useState(anagraficaData || initialState);

    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    // Efeito para sincronizar o estado do formulário com a prop anagraficaData
    // Isso garante que o formulário seja preenchido corretamente para edições
    useEffect(() => {
        setForm(anagraficaData || initialState);
    }, [anagraficaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);
        try {
            if (form.idAnagrafica) {
                // Modo de Edição - Envia para o endpoint de atualização
                await api.put(`/api/v1/Anagrafica/UpdateAnagrafica/${form.idAnagrafica}`, form);
                setMensagem({ type: "success", text: "Registro atualizado com sucesso!" });
                //onClose();
            } else {
                // Modo de Criação - Envia para o endpoint de criação
                const { idAnagrafica, ...payload } = form;
                await api.post("/api/v1/Anagrafica/CreateAnagrafica", payload);
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
        <div className="modal-overlay-cliente">
            <div className="modal-cliente">
                <div className="container-cliente">
                    <h2 className="form-title">{form.idAnagrafica ? "Editar Cliente" : "Novo Cliente"}</h2>
                     <form onSubmit={handleSubmit} className="formAnagrafica">
                        <div className="form-grid-cliente">
                            <div className="form-group-cliente form-group-half">
                                <label>ID</label>
                                <input type="number" name="idAnagrafica" value={form.idAnagrafica} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-cliente form-group-half">
                                <label>ID Revenda</label>
                                <input type="number" name="idRevenda" value={form.idRevenda} onChange={handleChange} className="form-control" />
                            </div>

                            {/* segunda linha*/}
                            <div className="form-group-cliente form-group-half">
                                <label>Razão Social</label>
                                <input name="razaoSocial" value={form.razaoSocial} onChange={handleChange} required className="form-control" />
                            </div>

                            <div className="form-group-cliente forma-group-full">
                                <label>Nome Fantasia</label>
                                <input name="nomeFantasia" value={form.nomeFantasia} onChange={handleChange} required className="form-control" />
                            </div>

                            <div className="form-group-cliente">
                                <label>Contato</label>
                                <input name="contato" value={form.contato} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-cliente form-group-half">
                                <label>CEP</label>
                                <input name="cep" value={form.cep} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-cliente form-group-full">
                                <label>Endereço</label>
                                <input name="endereco" value={form.endereco} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-cliente form-group-full">
                                <label>Bairro</label>
                                <input name="bairro" value={form.bairro} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-cliente">
                                <label>Cidade</label>
                                <input name="cidade" value={form.cidade} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-cliente">
                                <label>UF</label>
                                <input name="uf" value={form.uf} onChange={handleChange} maxLength="2" className="form-control" />
                            </div>

                            <div className="form-group-cliente">
                                <label>CNPJ</label>
                                <input name="cnpj" value={form.cnpj} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-cliente">
                                <label>IE</label>
                                <input name="ie" value={form.ie} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-cliente">
                                <label>Telefone</label>
                                <input name="telefone" value={form.telefone} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-cliente">
                                <label>Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-cliente">
                                <label>Senha</label>
                                <input type="password" name="senha" value={form.senha} onChange={handleChange} className="form-control" />
                            </div>
                        </div>
                            <div className="modal-actions">
                            <button type="submit" className="btn-cliente btn-secondary-cliente" disabled={loading}>
                                    {loading ? "Salvando..." : "Salvar"}
                            </button>
                            <button type="button" className="btn-cliente btn-primary-cliente" onClick={onClose} disabled={loading}>
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

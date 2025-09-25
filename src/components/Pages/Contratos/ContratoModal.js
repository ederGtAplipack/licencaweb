import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "./form.css";

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

// Objeto de estado inicial para um novo Contrato
const initialState = {
    idCliente: "",
    plano: "",
    qtdlicencas: "",
    dataInicio: "",
    datafim: "",
    periodicidade: "",
    pagamentoEmDia: "",
    statusContrato: "",
    dataProximoPagamento: "",
    dataUltimoPagamento: "",
    observacoes: "",
    statusDescricao: "",
    idContrato: "",
    razaoSocial: "",
    idRevenda: ""
};

export default function ContratoModal({ onClose, onSaved, ContratoData }) {
    // Usamos 'ContratoData' para preencher o formulário ou 'initialState' para um novo
    const [form, setForm] = useState(ContratoData || initialState);

    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    // Efeito para sincronizar o estado do formulário com a prop ContratoData
    // Isso garante que o formulário seja preenchido corretamente para edições
    useEffect(() => {
        if (ContratoData) {
            // Formata as datas para o formato yyyy-MM-dd
            const formattedData = {
                ...ContratoData,
                dataInicio: ContratoData.dataInicio ? ContratoData.dataInicio.substring(10, 0) : "",
                datafim: ContratoData.datafim ? ContratoData.datafim.substring(10, 0) : "",
                dataProximoPagamento: ContratoData.dataProximoPagamento ? ContratoData.dataProximoPagamento.substring(0, 10) : "",
                dataUltimoPagamento: ContratoData.dataUltimoPagamento ? ContratoData.dataUltimoPagamento.substring(0, 10) : "",
                // Inclua outras datas se necessário, como dataProximoPagamento
                // dataProximoPagamento: ContratoData.dataProximoPagamento ? ContratoData.dataProximoPagamento.substring(0, 10) : "",
            };
            setForm(formattedData);
        } else {
            setForm(initialState);
        }
    }, [ContratoData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);
        try {
            if (form.idContrato) {
                // Modo de Edição - Envia para o endpoint de atualização
                await api.put(`/api/v1/Contrato/UpdateContrato/${form.idContrato}`, form);
                setMensagem({ type: "success", text: "Registro atualizado com sucesso!" });
                VerificarStatusContrato(form.idContrato); // Atualiza o status após a edição
                //onClose();
            } else {
                // Modo de Criação - Envia para o endpoint de criação
                const { idContrato, ...payload } = form;
                await api.post("/api/v1/Contrato/CreateNewContrato", payload);
                setMensagem({ type: "success", text: "Registro salvo com sucesso!" });
                VerificarStatusContrato(form.idContrato); // Atualiza o status após a criação
                //setForm(initialState); // Limpa o formulário após salvar
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

    // Novo método para buscar o status
    const VerificarStatusContrato = async (idContrato) => {
        if (!idContrato) return;

        try {
            const { data } = await api.get(`/api/v1/Contrato/${idContrato}/status`);

            // Atualiza o statusContrato e a descrição
            setForm((prev) => ({
                ...prev,
                statusContrato: data.statusContrato,
                statusDescricao: data.statusDescricao || prev.statusDescricao
            }));
        } catch (err) {
            console.error("Erro ao verificar status do contrato:", err.response?.data || err.message);
            setMensagem({ type: "error", text: "Falha ao verificar status do contrato." });
        }
    };

    // Dispara sempre que o idContrato for preenchido ou alterado
    useEffect(() => {
        if (form.idContrato) {
            VerificarStatusContrato(form.idContrato);
        }
    }, [form.idContrato]);


    // Função para exibir o status como badge colorido
    const renderStatusBadge = (status) => {
        let className = "badge";
        switch (status) {
            case "Ativo":
                className += " badge-success"; // verde
                break;
            case "A vencer":
                className += " badge-warning"; // amarelo
                break;
            case "Vencido":
                className += " badge-danger"; // vermelho
                break;
            default:
                className += " badge-secondary"; // cinza
                break;
        }
        return <span className={className}>{status || "Calculando..."}</span>;
    };

    // Renderiza o formulário do modal
    return (
        <div className="modal-overlay">
            <div className="modal-ana">
                <div className="container-ana">
                    <h2 className="form-title">{form.idContrato ? "Editar Contrato" : "Novo Contrato"}</h2>
                     <form onSubmit={handleSubmit} className="formContrato">
                        <div className="form-grid">
                            <div className="form-group-ana form-group-half">
                                <label>ID Contrato</label>
                                <input type="number" name="idContrato" value={form.idContrato} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="status-contrato">
                                <div className="form-group-half">
                                    <label>Status Contrato</label>
                                    <p className="form-control-static">
                                        {renderStatusBadge(form.statusContrato
                                            ? `${form.statusContrato} (${form.statusDescricao || ""})`
                                            : "Calculando...")}
                                    </p>
                                    {/*<input name="statusContrato" value={form.statusContrato} onChange={handleChange} className="form-control" />*/}
                                </div>
                            </div>

                            {/* segunda linha*/}
                            <div className="form-group-ana form-group-half">
                                <label>Razão Social</label>
                                <input name="razaoSocial" value={form.razaoSocial} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana forma-group-full">
                                <label>Plano</label>
                                <select name="plano" value={form.plano} onChange={handleChange} required className="form-control">
                                    <option value="PlanBasic">Plan Basic</option>
                                    <option value="PlanIntermedi">Plan Intermedi</option>
                                    <option value="PlanPremin">Plan Premin</option>
                                    <option value="PlanAdvanche">Plan Advanch</option>
                                </select>
                                {/*<input name="plano" value={form.plano} onChange={handleChange} required className="form-control" />*/}
                            </div>

                            <div className="form-group-ana">
                                <label>Qtd Licencas</label>
                                <input name="qtdlicencas" type="number" value={form.qtdlicencas} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana form-group-half">
                                <label>Data Início</label>
                                <input name="dataInicio" type="date" value={form.dataInicio} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-ana form-group-half">
                                <label>Data Fim</label>
                                <input name="datafim" type="date" value={form.datafim} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana form-group-half">
                                <label>Periodicidade</label>
                                <select name="periodicidade" value={form.periodicidade} onChange={handleChange} required className="form-control">
                                    <option value="Diária">Diária</option>
                                    <option value="Semanal">Semanal</option>
                                    <option value="Quizenal">Quinzenal</option>
                                    <option value="Mensal">Mensal</option>
                                    <option value="Bimestral">Bimestral</option>
                                    <option value="Trimestral">Trimestral</option>
                                    <option value="Semestral">Semestral</option>
                                    <option value="Anual">Anual</option>
                                    <option value="Bienal">Bienal</option>
                                    <option value="Trienal">Trienal</option>
                                    <option value="Perpetua">Perpetua</option>
                                </select>                                
                            </div>

                            {/*<div className="form-group-ana form-group-full">
                                <label>Pag. em Dia ?</label>
                                <input name="pagamentoEmDia" value={form.pagamentoEmDia} onChange={handleChange} className="form-control" />
                            </div>*/}


                            <div className="form-group-ana">
                                <label>Status Descricao</label>
                                <input name="statusDescricao" value={form.statusDescricao} onChange={handleChange} maxLength="200" className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>Dt. Ultimo Pag.</label>
                                <input name="dataUltimoPagamento" type="date" value={form.dataUltimoPagamento} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>Dt. Próximo Pag.</label>
                                <input name="dataProximoPagamento" type="date" value={form.dataProximoPagamento} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana">
                                <label>Observações</label>
                                <input name="observacoes" value={form.observacoes} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-ana form-group-half">
                                <label>ID Cliente</label>
                                <input type="number" name="idCliente" value={form.idCliente} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-ana">
                                <label>Revenda</label>
                                <input name="idrevenda" value={form.idrevenda} onChange={handleChange} className="form-control" />
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

import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "./Contrato_style.css";

// Modal de mensagem (sucesso / erro)
const MessageModal = ({ type, message, onClear }) => (
    <div className="modal-overlay">
        <div className={`message-content ${type}`}>
            <p>{message}</p>
            <button onClick={onClear} className="btn-close-success">
                Ok !
            </button>
        </div>
    </div>
);

// Estado inicial do formulário
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
    const [form, setForm] = useState(ContratoData ? mapContratoToForm(ContratoData) : initialState);
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [mensagem, setMensagem] = useState(null);

    // --- Helpers ---
    // Garante que ContratoData vindo da api (com datas em ISO) vire yyyy-mm-dd para inputs date
    function mapContratoToForm(data) {
        return {
            ...data,
            dataInicio: data.dataInicio ? String(data.dataInicio).substring(0, 10) : "",
            datafim: data.datafim ? String(data.datafim).substring(0, 10) : "",
            dataProximoPagamento: data.dataProximoPagamento ? String(data.dataProximoPagamento).substring(0, 10) : "",
            dataUltimoPagamento: data.dataUltimoPagamento ? String(data.dataUltimoPagamento).substring(0, 10) : "",
            // normaliza nomes de campos que podem vir diferentes
            idCliente: data.idCliente ?? data.id_cliente ?? data.clienteId ?? data.cliente?.id ?? data.id ?? "",
            razaoSocial: data.razaoSocial ?? data.razao_social ?? data.cliente?.razaoSocial ?? data.cliente?.nome ?? ""
        };
    }

    // --- Carrega lista de clientes (anagráfica) ---
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await api.get("/api/v1/Anagrafica/AllAnagrafica");
                const data = response.data || [];
                // Normaliza cada registro para um shape previsível { id, razaoSocial, ... }
                const normalized = data.map((r, i) => {
                    if (!r || typeof r === "string") {
                        return { id: `cliente-${i}`, razaoSocial: String(r || `Cliente ${i}`) };
                    }
                    return {
                        id: r.id ?? r.idAnagrafica ?? r.idCliente ?? r.id_cliente ?? r.Id ?? null,
                        razaoSocial: r.razaoSocial ?? r.nome ?? r.razao_social ?? r.RazaoSocial ?? ""
                    };
                });
                setClientes(normalized);
            } catch (err) {
                console.error("Erro ao carregar Clientes:", err);
                setClientes([]);
            }
        };
        fetchClientes();
    }, []);

    // Sincroniza o formulário quando a prop ContratoData muda
    useEffect(() => {
        if (ContratoData) {
            setForm(mapContratoToForm(ContratoData));
        } else {
            setForm(initialState);
        }
    }, [ContratoData]);

    // --- Handlers genéricos ---
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Para campos number em input, e.g., type="number", manter conversão segura
        const val = type === "number" ? (value === "" ? "" : Number(value)) : value;
        setForm((prev) => ({ ...prev, [name]: val }));
    };

    // Handler específico para seleção de cliente
    // No seu ContratoModal.js, dentro da sua função
    // --- Função handleClienteSelect corrigida ---
    const handleClienteSelect = (e) => {
        const selectedId = e.target.value;
        const selectedCliente = clientes.find(
            (cliente) => String(cliente.id) === String(selectedId)
        );

        if (selectedCliente) {
            setForm((prevForm) => ({
                ...prevForm,
                idCliente: selectedId,
                razaoSocial: selectedCliente.razaoSocial,
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                idCliente: selectedId,
                razaoSocial: "",
            }));
        }
    };

    // --- Verifica status do contrato (faz chamada ao endpoint) ---
    const VerificarStatusContrato = async (idContrato) => {
        if (!idContrato) return;
        try {
            const { data } = await api.get(`/api/v1/Contrato/${idContrato}/status`);
            // Data pode ser string (legado) ou objeto { statusContrato, statusDescricao }
            if (typeof data === "string") {
                setForm((prev) => ({
                    ...prev,
                    statusContrato: data,
                    statusDescricao: prev.statusDescricao || ""
                }));
            } else {
                setForm((prev) => ({
                    ...prev,
                    statusContrato: data.statusContrato ?? prev.statusContrato,
                    statusDescricao: data.statusDescricao ?? prev.statusDescricao
                }));
            }
        } catch (err) {
            console.error("Erro ao verificar status do contrato:", err.response?.data || err.message);
            setMensagem({ type: "error", text: "Falha ao verificar status do contrato." });
        }
    };

    // Dispara quando idContrato mudar (edição ou após criação com retorno do servidor)
    useEffect(() => {
        if (form.idContrato) {
            VerificarStatusContrato(form.idContrato);
        }
    }, [form.idContrato]);

    // --- Render badge de status ---
    const renderStatusBadge = (status) => {
        const s = status || "Calculando...";
        let className = "badge badge-secondary";
        if (s === "Ativo") className = "badge badge-success";
        else if (s === "A vencer" || s === "A vencer") className = "badge badge-warning";
        else if (s === "Vencido") className = "badge badge-danger";
        return <span className={className}>{s}</span>;
    };

    // --- Submit do formulário (criar / atualizar) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);
        const { statusContrato, statusDescricao, ...payloadBase } = form;
        try {
            if (payloadBase.idContrato) {
                // Edição
                // Envia o payloadBase sem os campos de status
                await api.put(`/api/v1/Contrato/UpdateContrato/${payloadBase.idContrato}`, payloadBase);
                setMensagem({ type: "success", text: "Registro atualizado com sucesso!" });

                // Não é necessário chamar VerificarStatusContrato aqui se o useEffect abaixo já faz isso.

            } else {
                // Criação: remove idContrato (que é vazio)
                const { idContrato, ...payloadCreate } = payloadBase;
                const res = await api.post("/api/v1/Contrato/CreateNewContrato", payloadCreate);

                const created = res?.data;
                if (created && (created.idContrato || created.id)) {
                    const newId = created.idContrato ?? created.id;
                    // Ao atualizar o idContrato, o useEffect logo abaixo irá buscar o novo status
                    setForm((prev) => ({ ...prev, idContrato: newId }));
                    VerificarStatusContrato(newId);
                }

                setMensagem({ type: "success", text: "Registro salvo com sucesso!" });
            }
        } catch (err) {
            console.error("Erro ao salvar:", err.response?.data || err.message);
            setMensagem({ type: "error", text: "Erro ao salvar o registro!" });
        } finally {
            setLoading(false);
        }
    };


    // Fecha mensagem de sucesso e fecha modal após 5s
    useEffect(() => {
        if (mensagem?.type === "success") {
            const timer = setTimeout(() => {
                setMensagem(null);
                if (onSaved) onSaved();
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mensagem, onClose, onSaved]);

    // --- JSX render ---
    return (
        <div className="modal-overlay-contrato">
            <div className="modal-contrato">
                <div className="container-contrato">
                    <h2 className="form-title">Licenças {form.idContrato ? "Editar Contrato" : "Novo Contrato"}</h2>

                    <form onSubmit={handleSubmit} className="formContrato">
                        <div className="form-grid">
                            <div className="form-group-contrato form-group-fullCliente">
                                <label>Selecione o Cliente...</label>
                                <select
                                    name="idCliente"
                                    value={form.idCliente || ""}
                                    onChange={ContratoData ? undefined : handleClienteSelect} // Desabilita mudança se em modo de edição
                                    className={`form-control ${ContratoData ? 'disabled-field' : ''}`}
                                    required
                                    disabled={!!ContratoData}  // Desabilita se estiver em modo de edição

                                >
                                    <option value="">-- Selecione --</option>
                                    {clientes.map((cliente, i) => (
                                        <option key={cliente.id || i} value={String(cliente.id)}>
                                            {cliente.razaoSocial}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group-contrato form-group-half">
                                <label>Contrato</label>
                                <input
                                    type="number"
                                    name="idContrato"
                                    value={form.idContrato ?? ""}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={{ display: form.idContrato ? "block" : "" }}
                                    readOnly={!!form.idContrato}  // Não permite editar se já existe
                                    placeholder={form.idContrato ? "" : "Será gerado pelo sistema"}
                                    required={false}  // Não é obrigatório, pois é gerado pelo sistema
                                />
                            </div>

                            <div className="status-contrato">
                                <div className="form-group-half">
                                    <label>Status Contrato</label>
                                    <p className="form-control-static">{renderStatusBadge(form.statusContrato)}</p>
                                </div>
                            </div>

                            {/* segunda linha */}
                            <div className="form-group-contrato form-group-half">
                                <label>Razão Social</label>
                                <input
                                    name="razaoSocial"
                                    value={form.razaoSocial ?? ""}
                                    readOnly
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group-contrato forma-group-full">
                                <label>Plano</label>
                                <select name="plano" value={form.plano} onChange={handleChange} required className="form-control">
                                    <option value="PlanBasic">Plan Basic</option>
                                    <option value="PlanIntermedi">Plan Intermedi</option>
                                    <option value="PlanPremin">Plan Premin</option>
                                    <option value="PlanAdvanche">Plan Advanch</option>
                                </select>
                            </div>

                            <div className="form-group-contrato">
                                <label>Qtd Licencas</label>
                                <input name="qtdlicencas" type="number" value={form.qtdlicencas ?? ""} onChange={handleChange} className="form-control" required />
                            </div>

                            <div className="form-group-contrato form-group-half">
                                <label>Data Início</label>
                                <input name="dataInicio" type="date" value={form.dataInicio ?? ""} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-contrato form-group-half">
                                <label>Data Fim</label>
                                <input name="datafim" type="date" value={form.datafim ?? ""} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-contrato form-group-half">
                                <label>Periodicidade</label>
                                <select name="periodicidade" value={form.periodicidade} onChange={handleChange} required className="form-control">
                                    <option value="">-- Selecione --</option>
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

                            <div className="form-group-contrato">
                                <label>Status Descricao</label>
                                <input name="statusDescricao" value={form.statusDescricao ?? ""} onChange={handleChange} maxLength="200" className="form-control" />
                            </div>

                            <div className="form-group-contrato">
                                <label>Dt. Ultimo Pag.</label>
                                <input name="dataUltimoPagamento" type="date" value={form.dataUltimoPagamento ?? ""} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-contrato">
                                <label>Dt. Próximo Pag.</label>
                                <input name="dataProximoPagamento" type="date" value={form.dataProximoPagamento ?? ""} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-contrato">
                                <label>Observações</label>
                                <input name="observacoes" value={form.observacoes ?? ""} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="form-group-contrato">
                                <label>Revenda</label>
                                <input name="idRevenda" value={form.idRevenda ?? ""} onChange={handleChange} className="form-control" />
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

            {/* Modal de mensagens */}
            {mensagem && <MessageModal type={mensagem.type} message={mensagem.text} onClear={() => setMensagem(null)} />}
        </div>
    );
}

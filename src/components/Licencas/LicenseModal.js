import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import "./LicenseModal.css";

const MessageModal = ({ type, message, onClear }) => (
    <div className="modal-overlay">
        <div className={`message-content ${type}`}>
            <p>{message}</p>
            <button onClick={onClear} className="btn-close-success">Ok !</button>
        </div>
    </div>
);

/*VERSÃO ATUAL 13:29 */
const initialFormState = {
    idCliente: "",
    idSoftware: "",
    nSoftware: "",
    tipoLic: "",
    macAddress: "",
    sistemaOp: "",
    tipoPc: "",
    nomeComputador: "",
    ip: "",
    processador: "",
    statusLicenca: "",
    numLic: "",
    razaoSocial: "",
    software: ""
};

export default function LicenseModalSimplificado({ onClose, onSaved, licencaData }) {
    const [form, setForm] = useState(licencaData || initialFormState);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [softwares, setSoftwares] = useState([]);
    const [idSoftware, setIdSoftware] = useState("");
    const [nSoftware, setNSoftware] = useState("");
    const [error, setError] = useState(null);
    const [clientes, setClientes] = useState([]);

    // --- Carrega lista de softwares ---
    const fetchSoftwares = useCallback(async () => {
        try {
            // Se você estiver usando o 'api' de ContratoPage, substitua o fetch
            const response = await api.get("/api/v1/Software/AllSoftware");

            setSoftwares(response.data);

        } catch (error) {
            console.error("Erro na comunicação para buscar softwares:", error);

            // CORREÇÃO 2: Tratamento de erro específico para axios (incluindo o 404)
            let errorMessage = "Não foi possível carregar a lista de softwares.";

            if (error.response) {
                // O servidor respondeu com um status code fora da faixa 2xx
                errorMessage = `Erro HTTP ${error.response.status}. Verifique a rota da API no backend.`;
            } else if (error.request) {
                // A requisição foi feita, mas não houve resposta (ex: erro de rede)
                errorMessage = "Erro de rede: O servidor não está acessível.";
            }

            setError(errorMessage);
        }
    }, []);

    // Load clients and software lists
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

    // Efeito para carregar os softwares quando o modal for aberto
    useEffect(() => {
        fetchSoftwares();
    }, [fetchSoftwares]);

    // Atualiza formulário quando licencaData mudar
    useEffect(() => {
        setForm(licencaData || initialFormState);
    }, [licencaData]);

    // Handle input changes generically
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle specific selects to update related fields
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

    const handleSoftwareSelect = (e) => {
        const selectedId = e.target.value;
        const software = softwares.find(s => String(s.idSoftware) === selectedId);
        setForm(prev => ({ ...prev, idSoftware: selectedId, software: software?.descricao ?? "" }));
    };

    // Submit form to create or update license
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);

        try {
            const payload = {
                idCliente: Number(form.idCliente) || 0,
                tipoLic: form.tipoLic || "Desconhecido",
                macAddress: form.macAddress || "00:00:00:00:00:00",
                idSoftware: Number(form.idSoftware) || 0,
                sistemaOp: form.sistemaOp || "",
                tipoPc: form.tipoPc || "",
                nomeComputador: form.nomeComputador || "",
                software: form.software || "",
                ip: form.ip || "",
                processador: form.processador || "",
                numLic: form.numLic || "",
                statusLicenca: form.statusLicenca,
            };

            console.log("Payload a ser enviado:", payload);

            if (form.numLic) {
                // Editar licença existente
                await api.put(`/api/v1/Licenca/updateLicenca/${form.numLic}`, form);
                setMensagem({ type: "success", text: "Licença atualizada com sucesso!" });
            } else {
                // Criar nova licença
                const { numLic, ...payload } = form;
                await api.post("/api/v1/Licenca/createNewLicenca", payload);
                setMensagem({ type: "success", text: "Licença criada com sucesso!" });
            }
        } catch (err) {
            console.error("Erro ao salvar licença:", err);
            let errorText = "Erro ao salvar licença.";
            if (err.response && err.response.data && err.response.data.title) {
                errorText = err.response.data.title;
                // Se houver erros de validação mais específicos, você pode detalhar
                if (err.response.data.errors) {
                    errorText += " Detalhes: " + JSON.stringify(err.response.data.errors);
                }
            }
            setMensagem({ type: "error", text: "Erro ao salvar licença." });
        } finally {
            setLoading(false);
        }
    };

    // Auto close modal on success
    useEffect(() => {
        if (mensagem?.type === "success") {
            const timer = setTimeout(() => {
                setMensagem(null);
                if (onSaved) onSaved();
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [mensagem, onSaved, onClose]);

    const isEditMode = Boolean(form.numLic);

    return (
        <div className="modal-overlay-licenca">
            <div className="modal-licenca">
                <div className="container-licenca">
                    <h2 className="form-title">
                        {isEditMode ? "Editar Licença" : "Nova Licença"}
                    </h2>

                    <form onSubmit={handleSubmit} className="formLicenca">
                        <div className="form-grid">
                            <div className="form-group-licenca form-group-full">
                                <label>Cliente</label>
                                <select
                                    name="idCliente"
                                    value={form.idCliente}
                                    onChange={handleClienteSelect}
                                    className="form-control"
                                    required
                                    disabled={isEditMode}
                                >
                                    <option value="">-- Selecione --</option>
                                    {clientes.map((c) => (
                                        <option key={c.id} value={String(c.id)}>
                                            {c.razaoSocial}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/*<div className="form-group-licenca form-group-full">
                                <label>Software</label>
                                <select
                                    name="idSoftware"
                                    value={form.idSoftware}
                                    onChange={handleSoftwareSelect}
                                    className="form-control"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">-- Selecione --</option>
                                    {softwares.map((s) => (
                                        <option key={s.idSoftware} value={s.idSoftware}>
                                            {s.descricao}
                                        </option>
                                    ))}
                                </select>
                            </div>*/}

                            <div className="form-group">
                                <label>Tipo Licença</label>
                                <input
                                    name="tipoLic"
                                    value={form.tipoLic}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>MAC Address</label>
                                <input
                                    name="macAddress"
                                    value={form.macAddress}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Software</label>
                                <select
                                    name="idSoftware"
                                    value={form.idSoftware}
                                    onChange={handleSoftwareSelect}
                                    className="form-control"
                                    aria-label="Selecionar software"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">-- selecione --</option>
                                    {softwares.map(sw => (
                                        <option key={sw.idSoftware} value={sw.idSoftware}>
                                            {sw.descricao}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Sistema Operacional</label>
                                <input
                                    name="sistemaOp"
                                    value={form.sistemaOp}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Tipo PC</label>
                                <input
                                    name="tipoPc"
                                    value={form.tipoPc}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Nome do Computador</label>
                                <input
                                    name="nomeComputador"
                                    value={form.nomeComputador}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            {/*<div className="form-group">
                                        <label>Software</label>
                                        <input
                                            name="software"
                                            value={form.software}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>*/}

                            <div className="form-group">
                                <label>IP</label>
                                <input
                                    name="ip"
                                    value={form.ip}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Processador</label>
                                <input
                                    name="processador"
                                    value={form.processador}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Salvando..." : "Salvar"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

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

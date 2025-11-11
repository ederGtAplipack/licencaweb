// src/components/Licencas/LicenseModal.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../services/api";
import "./LicenseModal.css";

// --- Modal de Mensagem Simples ---
const MessageModal = ({ type, message, onClear }) => (
    <div className="modal-overlay">
        <div className={`message-content ${type}`}>
            <p>{message}</p>
            <button onClick={onClear} className="btn-close-success">
                Ok!
            </button>
        </div>
    </div>
);

// --- Estado inicial do formulário ---
const initialFormState = {
    idCliente: "",
    idSoftware: "",
    tipoLic: "",
    macAddress: "",
    sistemaOp: "",
    tipoPc: "",
    nomeComputador: "",
    ip: "",
    processador: "",
    statusLicenca: "",
    software: "",
    numLic: "",
};

// --- Hook para carregar dados auxiliares ---
const useDataLoader = () => {
    const [softwares, setSoftwares] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSoftwares = useCallback(async () => {
        try {
            const { data } = await api.get("/api/v1/Software/AllSoftware");
            setSoftwares(data);
        } catch (err) {
            console.error("Erro ao carregar softwares:", err);
            setError("Falha ao carregar lista de softwares.");
        }
    }, []);

    const fetchClientes = useCallback(async () => {
        try {
            const { data } = await api.get("/api/v1/Anagrafica/AllAnagrafica");
            const normalized = (data || []).map((item, index) => ({
                id:
                    item?.id ??
                    item?.idAnagrafica ??
                    item?.idCliente ??
                    item?.id_cliente ??
                    `cliente-${index}`,
                razaoSocial:
                    item?.razaoSocial ??
                    item?.nome ??
                    item?.razao_social ??
                    "Cliente sem nome",
            }));
            setClientes(normalized);
        } catch (err) {
            console.error("Erro ao carregar clientes:", err);
            setError("Falha ao carregar lista de clientes.");
        }
    }, []);

    const loadAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        await Promise.all([fetchSoftwares(), fetchClientes()]);
        setLoading(false);
    }, [fetchSoftwares, fetchClientes]);

    return { softwares, clientes, loading, error, loadAllData };
};

// --- Componente Principal ---
export default function LicenseModal({ onClose, onSaved, licencaData }) {
    const [form, setForm] = useState(initialFormState);
    const [mensagem, setMensagem] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const {
        softwares,
        clientes,
        loading: dataLoading,
        error: dataError,
        loadAllData,
    } = useDataLoader();

    const isEditMode = useMemo(() => !!licencaData?.numLic, [licencaData]);
    const isLoading = dataLoading || submitLoading;

    // Carregar dados iniciais
    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // Preencher o formulário quando licencaData mudar
    useEffect(() => {
        if (!licencaData) {
            setForm(initialFormState);
            return;
        }

        const mappedData = {
            numLic: licencaData.numLic ?? licencaData.id ?? "",
            idCliente: String(licencaData.idCliente ?? licencaData.clienteId ?? ""),
            idSoftware: String(licencaData.idSoftware ?? licencaData.softwareId ?? ""),
            tipoLic: licencaData.tipoLic ?? licencaData.tipo_lic ?? licencaData.TipoLic ?? "",
            statusLicenca: licencaData.statusLicenca ?? licencaData.status ?? "",

            macAddress:
                licencaData.macAddress ??
                licencaData.mac_address ??
                licencaData.MacAddress ??
                "",
            sistemaOp:
                licencaData.sistemaOp ??
                licencaData.sistema_op ??
                licencaData.SistemaOp ??
                "",
            tipoPc:
                licencaData.tipoPc ?? licencaData.tipo_pc ?? licencaData.TipoPc ?? "",
            nomeComputador:
                licencaData.nomeComputador ??
                licencaData.nome_computador ??
                licencaData.NomeComputador ??
                "",
            ip: licencaData.ip ?? licencaData.Ip ?? "",
            processador:
                licencaData.processador ??
                licencaData.Processador ??
                licencaData.cpu ??
                "",
            software:
                licencaData.software ?? licencaData.descricaoSoftware ?? "",
        };

        console.table(mappedData);
        setForm({ ...initialFormState, ...mappedData });
    }, [licencaData]);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleClienteSelect = (e) => {
        if (isEditMode) return;
        const selectedId = e.target.value;
        const cliente = clientes.find(
            (c) => String(c.id) === String(selectedId)
        );
        setForm((prev) => ({
            ...prev,
            idCliente: selectedId,
            razaoSocial: cliente?.razaoSocial || "",
        }));
    };

    const handleSoftwareSelect = (e) => {
        const selectedId = e.target.value;
        const software = softwares.find(
            (s) => String(s.idSoftware) === String(selectedId)
        );
        setForm((prev) => ({
            ...prev,
            idSoftware: selectedId,
            software: software?.descricao || "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setMensagem(null);

        try {
            const payload = { ...form };
            if (isEditMode) {
                await api.put(
                    `/api/v1/Licenca/updateLicenca/${form.numLic}`,
                    payload
                );
                setMensagem({ type: "success", text: "Licença atualizada com sucesso!" });
            } else {
                const { numLic, ...createPayload } = payload;
                await api.post("/api/v1/Licenca/createNewLicenca", createPayload);
                setMensagem({ type: "success", text: "Licença criada com sucesso!" });
            }
        } catch (err) {
            console.error("Erro ao salvar licença:", err);
            const status = err.response?.status;
            const messages = {
                400: "Dados inválidos. Verifique os campos.",
                409: "Licença já existente ou conflito de dados.",
                500: "Erro interno do servidor.",
            };
            setMensagem({
                type: "error",
                text: messages[status] || "Erro ao salvar licença.",
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    // Fechar automaticamente após sucesso
    useEffect(() => {
        if (mensagem?.type === "success") {
            const timer = setTimeout(() => {
                setMensagem(null);
                onSaved?.();
                onClose();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [mensagem, onSaved, onClose]);

    // --- Renderização ---
    return (
        <div className="login-container">
            <div className="login-box">
                <div className="modal-overlay-licenca">
                    <div className="modal-licenca">
                        <div className="container-licenca">
                            <h2 className="form-title-licenca">
                                {isEditMode ? "Editar Licença" : "Nova Licença"}
                            </h2>

                            {dataError && <div className="error-message">{dataError}</div>}
                            {dataLoading && (
                                <div className="loading-message">Carregando dados...</div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-grid-licenca">
                                    {/* Cliente */}
                                    <div className="form-group form-group-fulllicenca">
                                        <label>Cliente</label>
                                        <select
                                            name="idCliente"
                                            value={form.idCliente}
                                            onChange={handleClienteSelect}
                                            className="form-control"
                                            required
                                            disabled={isLoading}
                                        >
                                            <option value="">-- Selecione --</option>
                                            {clientes.map((c) => (
                                                <option key={c.id} value={String(c.id)}>
                                                    {c.razaoSocial}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Campos de texto */}
                                    {[
                                        { label: "Tipo Licença", name: "tipoLic" },
                                        { label: "MAC Address", name: "macAddress" },
                                        { label: "Sistema Operacional", name: "sistemaOp" },
                                        { label: "Tipo PC", name: "tipoPc" },
                                        { label: "Nome do Computador", name: "nomeComputador" },
                                        { label: "IP", name: "ip" },
                                        { label: "Processador", name: "processador" },
                                        { label: "Status Licença", name: "statusLicenca" },
                                    ].map(({ label, name }) => (
                                        <div key={name} className="form-group-licenca">
                                            <label>{label}</label>
                                            <input
                                                name={name}
                                                value={form[name]}
                                                onChange={handleChange}
                                                className="form-control"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    ))}

                                    {/* Software */}
                                    <div className="form-group-licenca">
                                        <label>Software</label>
                                        <select
                                            name="idSoftware"
                                            value={form.idSoftware}
                                            onChange={handleSoftwareSelect}
                                            className="form-control"
                                            required
                                            disabled={isLoading}
                                        >
                                            <option value="">-- Selecione --</option>
                                            {softwares.map((s) => (
                                                <option key={s.idSoftware} value={s.idSoftware}>
                                                    {s.descricao}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Ações */}
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="btn btn-secondary"
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
                                        {submitLoading ? "Salvando..." : "Salvar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de mensagens */}
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

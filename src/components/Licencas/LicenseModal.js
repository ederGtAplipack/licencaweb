// src/components/Licencas/LicenseModal.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import "./LicenseModal.css";

// Modal de mensagens (sucesso / erro)
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

const initialFormState = {
    idCliente: "",
    tipoLic: "",
    macAddress: "",
    idSoftware: "",
    sistemaOp: "",
    tipoPc: "",
    nomeComputador: "",
    software: "",
    ip: "",
    processador: ""
};

export default function LicenseModal({ onClose, onSaved, licencaData }) {
    const [form, setForm] = useState(licencaData || initialFormState);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [softwares, setSoftwares] = useState([]);
    const [idSoftware, setIdSoftware] = useState("");
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

    // Efeito para carregar os softwares quando o modal for aberto
    useEffect(() => {
        fetchSoftwares();
    }, [fetchSoftwares]);

    // Atualiza formulário quando licencaData mudar
    useEffect(() => {
        setForm(licencaData || initialFormState);
    }, [licencaData]);

    // Handler genérico de inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Submissão do formulário
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
                processador: form.processador || ""
            };

            console.log("Payload a ser enviado:", payload);

            if (form.numLic) {
                // Editar licença existente
                await api.put(`/api/v1/Licenca/${form.numLic}`, form);
                setMensagem({ type: "success", text: "Licença atualizada com sucesso!" });
            } else {
                // Criar nova licença
                const { numLic, ...payload } = form;
                await api.post("/api/v1/Licenca/createNewLicenca", payload);
                setMensagem({ type: "success", text: "Licença criada com sucesso!" });
            }
        } catch (err) {
            console.error("Erro ao salvar licença:", err);
            setMensagem({ type: "error", text: "Erro ao salvar licença." });
        } finally {
            setLoading(false);
        }
    };

    // Fecha mensagem de sucesso automaticamente após 5 segundos
    useEffect(() => {
        if (mensagem?.type === "success") {
            const timer = setTimeout(() => {
                setMensagem(null);
                if (onSaved) onSaved();
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mensagem, onSaved, onClose]);

    // --- Render ---
    return (

        <div className="login-container">
            <div className="login-box">
                <div className="modal-overlay-licenca">
                    <div className="modal-licenca">
                        <div className="container-licenca">
                            <h2 className="form-title-licenca">
                                {licencaData?.numLic ? "Editar Licença" : "Nova Licença"}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group form-group-fulllicenca">
                                        <label>ID Cliente</label>
                                        <select
                                            name="idCliente"
                                            value={form.idCliente || ""}
                                            onChange={licencaData ? undefined : handleClienteSelect} // Desabilita mudança se em modo de edição
                                            className={`form-control ${licencaData ? 'disabled-field' : ''}`}
                                            required
                                            disabled={!!licencaData}  // Desabilita se estiver em modo de edição

                                        >
                                            <option value="">-- Selecione --</option>
                                            {clientes.map((cliente, i) => (
                                                <option key={cliente.id || i} value={String(cliente.id)}>
                                                    {cliente.razaoSocial}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

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
                                            value={idSoftware}
                                            onChange={e => setIdSoftware(e.target.value)}
                                            className="form-control"
                                            aria-label="Selecionar software"
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
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="btn btn-secondary"
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? "Salvando..." : "Salvar"}
                                        </button>
                                    </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal secundário de mensagens */}
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

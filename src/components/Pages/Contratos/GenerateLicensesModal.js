// GenerateLicensesModal.js
import React, { useState, useCallback, useEffect } from "react";
import api from "../../../services/api";
import "./Contrato_style.css";
import { generateMultipleLicenses, generateMultipleViaSingleCreates } from "../../../services/licencaService";
// import api from "../../../services/api"; // não usado aqui, mantido caso precise


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

export default function GenerateLicensesModal({
    show,
    onClose,
    onSuccess,
    contract,
    defaultSoftwareId,
    onGenerate // optional: function(payload) => response    
}) {
    // --- estado inicial baseado no contrato (atualiza quando contract muda) ---
    const [softwares, setSoftwares] = useState([]);
    const [idSoftware, setIdSoftware] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const maxAllowed = contract?.qtdLicencas ?? contract?.qtdlicencas ?? 1;

    // --- Carrega lista de Softwares ---
    // Função para buscar a lista de softwares na API
    // OBS: Assumindo que você tem um endpoint /api/v1/software/all
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

    // Efeito para carregar os softwares quando o modal for aberto
    useEffect(() => {
        if (show) {
            fetchSoftwares();
        }
    }, [show, fetchSoftwares]);

    // Validação do formulário
    const validateBeforeSubmit = useCallback(() => {
        setError(null);
        if (!idSoftware) {
            setError("Selecione o software.");
            return false;
        }
        if (!quantidade || Number(quantidade) < 1) {
            setError("Quantidade mínima: 1");
            return false;
        }
        if (Number(quantidade) > maxAllowed) {
            setError(`Quantidade superior ao disponível no contrato (${maxAllowed}).`);
            return false;
        }    
        return true;
    }, [idSoftware, quantidade, maxAllowed, contract]);

    // Função que efetivamente chama a API (usa onGenerate se fornecido)
    const callGenerateApi = useCallback(async (payload) => {
        // if parent provided an onGenerate function, use it
        if (typeof onGenerate === "function") {
            return await onGenerate(payload);
        }

        // otherwise try bulk endpoint, fallback to single creates
        try {
            return await generateMultipleLicenses(payload);
        } catch (err) {
            // se bulk não suportado ou deu erro, fallback para execuções individuais
            // detect error status 404/501 optionally via err.httpStatus
            return await generateMultipleViaSingleCreates(payload);
        }
    }, [onGenerate]);

    // Submit handler
    const handleGenerate = useCallback(async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!validateBeforeSubmit()) return;

        setLoading(true);
        setResult(null);
        setError(null);

        // montar payload com nomes esperados pelo backend
        const payload = {
            idCliente: contract?.idCliente ?? contract?.IdCliente,
            idContrato: contract?.idContrato ?? contract?.IdContrato,
            idSoftware: idSoftware,
            quantidade: Number(quantidade),
            dataLic: new Date().toISOString(),
            scade: null, // opcional, pode ser nulo
            maxDevices: 1, // opcional, default 1
            tipoLic: null // opcional, pode ser nulo
        };

        try {
            const data = await callGenerateApi(payload);

            // esperar objeto válido
            if (!data) {
                setError("Resposta inválida do servidor.");
                return;
            }

            // Normaliza possíveis formatos de resposta (created / createdLicenses / createdItems)
            const normalized = {
                created: data.created ?? data.createdLicenses ?? data.createdItems ?? [],
                failed: data.failed ?? data.failedItems ?? []
            };

            setResult(normalized);
            onSuccess && onSuccess(normalized);
        } catch (ex) {
            console.error("[GenerateLicensesModal] error:", ex);
            // ex pode ser Error com message ou response object
            const msg = ex?.message || (ex?.response && ex.response?.data?.message) || "Erro ao gerar licenças";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [validateBeforeSubmit, contract, idSoftware, quantidade, callGenerateApi, onSuccess]);

    // CSV download (protegendo contra valores nulos)
    const downloadCsv = useCallback(() => {
        if (!result || !result.created || result.created.length === 0) return;

        const rows = result.created.map(r => ({
            numLic: r.numLic ?? "",
            chave: r.chave ?? "",
            scade: r.scade ?? ""
        }));

        const separator = ",";
        const header = Object.keys(rows[0]).join(separator);
        const csv = [
            header,
            ...rows.map(row =>
                Object.values(row).map(val => `"${String(val ?? "").replace(/"/g, '""')}"`).join(separator)
            )
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `licencas_${contract?.idContrato ?? "contrato"}_${new Date().toISOString().substring(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }, [result, contract]);

    // Saída antecipada
    if (!show) return null;

    // JSX
    return (
        <div className="modal-overlay-contrato">
            <div className="modal-contrato-licenca">
                <div className="container-contrato">
                    <h2 className="form-title">Gerar Licenças (Contrato #{contract?.idContrato ?? contract?.IdContrato ?? "—"})</h2>

                    <form onSubmit={handleGenerate} className="formContrato" noValidate>
                        <div className="form-grid">
                            {/* Cliente - Full width */}
                            <div className="form-group-contrato form-group-fullCliente">
                                <label className="label-title">Cliente:</label>
                                <span>{contract?.razaoSocial ?? contract?.NomeFantasia ?? contract?.idCliente ?? "—"}</span>
                            </div>

                            {/* Software - Half width */}
                            <div className="form-group-contrato form-group-half">
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

                            {/* Quantidade - Half width */}
                            <div className="form-group-contrato form-group-half">
                                <label>Quantidade (disponível: {maxAllowed})</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={maxAllowed}
                                    value={quantidade}
                                    onChange={e => setQuantidade(Number(e.target.value || 1))}
                                    className="form-control"
                                    aria-label="Quantidade de licenças"
                                />
                            </div>
                        </div>

                        {error && <div className="error" style={{ marginTop: 8, gridColumn: '1 / -1' }}>{error}</div>}

                        <div className="modal-actions" style={{ marginTop: 12 }}>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Gerando..." : "Gerar"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setResult(null);
                                    setError(null);
                                    onClose && onClose();
                                }}
                                disabled={loading}
                            >
                                Fechar
                            </button>
                        </div>

                        {result && (
                            <div className="result" style={{ marginTop: 12, gridColumn: '1 / -1' }}>
                                <h4>Resultado da Geração</h4>
                                <div>Criadas: {result.created?.length ?? 0}</div>
                                <div>Falhas: {result.failed?.length ?? 0}</div>

                                {result.created && result.created.length > 0 && (
                                    <>
                                        <button onClick={downloadCsv} className="btn btn-info" style={{ marginTop: 10 }}>
                                            Exportar CSV
                                        </button>
                                        <table style={{ marginTop: 10 }}>
                                            <thead><tr><th>NumLic</th><th>Chave</th><th>Scade</th></tr></thead>
                                            <tbody>
                                                {result.created.map((c, i) => (
                                                    <tr key={i}>
                                                        <td>{c.numLic}</td>
                                                        <td><code>{c.chave}</code></td>
                                                        <td>{c.scade ? new Date(c.scade).toLocaleDateString() : ""}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                {result.failed && result.failed.length > 0 && (
                                    <>
                                        <h5 style={{ color: 'red', marginTop: 10 }}>Detalhes das Falhas</h5>
                                        <ul>
                                            {result.failed.map((f, i) => <li key={i}>Índice {f.index}: {f.reason}</li>)}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

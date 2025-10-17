// GenerateLicensesModal.js
import React, { useState, useCallback } from "react";
import "./Contrato_style.css";
import { generateMultipleLicenses, generateMultipleViaSingleCreates } from "../../../services/licencaService";
import api from "../../../services/api";

// ... (MessageModal e initialState)

export default function GenerateLicensesModal({ show, onClose, onSuccess, contract, defaultSoftwareId, onGenerate }) {

    const initialScade = contract?.dataFim
        ? new Date(contract.dataFim).toISOString().substring(0, 10)
        : "";

    // --- STATE & HOOKS (DEVE ESTAR SEMPRE NO TOPO) ---
    const [quantidade, setQuantidade] = useState(1);
    const [idSoftware, setIdSoftware] = useState(defaultSoftwareId ?? "");
    const [scade, setScade] = useState(initialScade);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const maxAllowed = contract?.qtdLicencas ?? 1;

    // Lógica de validação (com useCallback)
    const validateBeforeSubmit = useCallback(() => {
        setError(null);
        if (!idSoftware) { setError("Selecione o software."); return false; }
        if (!quantidade || quantidade < 1) { setError("Quantidade mínima: 1"); return false; }
        if (Number(quantidade) > maxAllowed) { setError(`Quantidade superior ao disponível no contrato (${maxAllowed}).`); return false; }
        if (!scade) { setError("Informe validade (Scade)."); return false; }

        const scadeDate = new Date(scade);
        if (contract?.dataFim) {
            const contratoFim = new Date(contract.dataFim);
            if (scadeDate.getTime() > contratoFim.getTime()) {
                setError("Validade não pode exceder a data fim do contrato.");
                return false;
            }
        }
        return true;
    }, [idSoftware, quantidade, maxAllowed, scade, contract]); // Dependências corrigidas

    // Lógica principal de geração e chamada da API (com useCallback)
    const handleGenerate = useCallback(async (e) => {
        e.preventDefault();

        if (!validateBeforeSubmit()) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const payload = {
                idContrato: contract.idContrato,
                idCliente: contract.idCliente,
                idSoftware: Number(idSoftware),
                quantidade: Number(quantidade),
                scade: new Date(scade).toISOString(),
                maxDevices: 1
            };

            const resp = await fetch("/api/v1/licenca/generate-multiple", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await resp.json();

            if (!resp.ok) {
                setError(data?.message || "Erro desconhecido ao gerar licenças.");
                return;
            }

            setResult(data);
            onSuccess && onSuccess(data);
        } catch (ex) {
            console.error("[API Error]", ex);
            setError("Erro de comunicação com o servidor.");
        } finally {
            setLoading(false);
        }
    }, [validateBeforeSubmit, contract, idSoftware, quantidade, scade, onSuccess]);

    // Lógica para download de CSV (com useCallback)
    const downloadCsv = useCallback(() => {
        if (!result || !result.created) return;

        const rows = result.created.map(r => ({
            numLic: r.numLic,
            chave: r.chave,
            scade: r.scade
        }));

        const separator = ",";
        const header = Object.keys(rows[0] || {}).join(separator);

        const csv = [header]
            .concat(rows.map(r =>
                Object.values(r).map(val =>
                    `"${String(val).replace(/"/g, '""')}"`
                ).join(separator)
            ))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `licencas_${contract.idContrato}_${new Date().toISOString().substring(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }, [result, contract]);

    // --- SAÍDA ANTECIPADA (DEVE ESTAR DEPOIS DOS HOOKS) ---
    if (!show) return null;

    // --- JSX Render ---
    return (
        // ... (o restante do JSX)
        <div className="modal-overlay-contrato">
            <div className="modal-contrato-licenca">
                <div className="container-contrato">
                    <h2 className="form-title">Gerar Licenças {"n/"} (Contrato #{contract?.idContrato})</h2>

                    <form onSubmit={handleGenerate} className="formContrato">

                        <div className="form-grid">

                            {/* Cliente - Full width */}
                            <div className="form-group-contrato form-group-fullCliente">
                                <label className="label-title">Cliente: </label>
                                <span>{contract?.razaoSocial ?? contract?.idCliente}</span>
                            </div>

                            {/* Software - Half width */}
                            <div className="form-group-contrato form-group-half">
                                <label>Software</label>
                                <select
                                    value={idSoftware}
                                    onChange={e => setIdSoftware(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">-- selecione --</option>
                                    <option value="1">Software A</option>
                                    <option value="2">Software B</option>
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
                                    onChange={e => setQuantidade(e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            {/* Validade (Scade) - Half width */}
                            <div className="form-group-contrato form-group-half">
                                <label>Validade (Scade)</label>
                                <input
                                    type="date"
                                    value={scade}
                                    onChange={e => setScade(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {error && <div className="error" style={{ marginTop: 8, gridColumn: '1 / -1' }}>{error}</div>}

                        <div className="modal-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Gerando..." : "Gerar"}
                            </button>
                            <button type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setResult(null);
                                    setError(null);
                                    onClose();
                                }}
                                disabled={loading}>
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
                                                        <td>{new Date(c.scade).toLocaleDateString()}</td>
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
// src/components/Licencas/LicenseModal.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

/**
 * LicenseModal
 * Props:
 *  - show: boolean
 *  - onClose: fn
 *  - onSaved: fn (chamada após salvar para recarregar lista)
 *  - initial: objeto (quando for edição)
 */
export default function LicenseModal({ show, onClose, onSaved, initial }) {
    const [form, setForm] = useState({
        clienteId: "",     // manter "" quando vazio, number quando selecionado
        macAddress: "",
        software: "",
        ip: "",
        scade: "",
        status: "Ativa",
    });

    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [saving, setSaving] = useState(false);

    // Sincroniza form com "initial" (edição) quando modal abrir ou initial mudar
    useEffect(() => {
        if (initial) {
            setForm({
                clienteId: initial.clienteId ?? initial.idCliente ?? initial.clientId ?? "",
                macAddress: initial.macAddress ?? initial.mac ?? "",
                software: initial.software ?? "",
                ip: initial.ip ?? "",
                scade: initial.scade ? (initial.scade.split?.("T")[0] ?? initial.scade) : "",
                status: initial.status ?? "Ativa",
            });
        } else {
            setForm({
                clienteId: "",
                macAddress: "",
                software: "",
                ip: "",
                scade: "",
                status: "Ativa",
            });
        }
    }, [initial, show]);

    // Carrega clientes quando modal abre
    useEffect(() => {
        if (!show) return;

        const loadClients = async () => {
            setLoadingClients(true);
            try {
                // Tenta endpoints comuns — ajuste conforme API real
                const tryEndpoints = [
                    "api/v1/Licencaquery/GetAllWithDetails",   // endpoint ideal
                ];

                let resp = null;
                for (const ep of tryEndpoints) {
                    try {
                        resp = await api.get(ep);
                        if (resp?.data) break;
                    } catch (err) {
                        resp = null;
                    }
                }

                const data = resp?.data ?? [];
                if (Array.isArray(data)) {
                    setClients(data);
                } else {
                    // se o endpoint retornar um objeto com nested list (incomum), tente extrair
                    setClients(Array.isArray(data.items) ? data.items : []);
                }
            } catch (err) {
                console.error("Erro ao carregar clientes:", err);
                setClients([]);
            } finally {
                setLoadingClients(false);
            }
        };

        loadClients();
    }, [show]);

    // Handle change — converte clienteId para number (ou "" se vazio)
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "clienteId") {
            // select sempre retorna string; convert to number or ""
            if (value === "" || value === null) {
                setForm((p) => ({ ...p, [name]: "" }));
            } else {
                const num = Number(value);
                setForm((p) => ({ ...p, [name]: Number.isNaN(num) ? "" : num }));
            }
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
    };

    // Submit - envia payload com idCliente (number)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // valida simples: exige cliente selecionado
        if (!form.clienteId) {
            alert("Selecione um cliente válido antes de salvar.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                // backend parece esperar idCliente no root (mensagem de erro anterior)
                idCliente: Number(form.clienteId),
                macAddress: form.macAddress || null,
                software: form.software || null,
                ip: form.ip || null,
                scade: form.scade ? new Date(form.scade).toISOString() : null,
                status: form.status ?? "Ativa",
            };

            // logs para debugging — confira no console e network
            console.log("Payload CreateNewLin:", payload, "type idCliente:", typeof payload.idCliente);

            if (initial && initial.id) {
                // edição
                await api.put(`api/v1/licenca/${initial.id}`, payload);
            } else {
                // criação
                await api.post("CreateNewLin", payload);
            }

            // chama callback para recarregar lista no dashboard
            onSaved?.();
            onClose?.();
        } catch (err) {
            console.error("Erro salvar licença:", err?.response?.data ?? err?.message ?? err);
            const serverMsg = err?.response?.data ?? err?.message;
            alert("Erro ao salvar licença. Veja o console para detalhes.\n" + (serverMsg ? JSON.stringify(serverMsg) : ""));
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">{initial?.id ? "Editar Licença" : "Nova Licença"}</h2>

                <form onSubmit={handleSubmit}>
                    

                    <div className="form-group">
                        <label>Cliente</label>
                        <input name="clienteId" value={form.clienteId} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>MAC</label>
                        <input name="macAddress" value={form.macAddress} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Software</label>
                        <input name="software" value={form.software} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>IP</label>
                        <input name="ip" value={form.ip} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Validade</label>
                        <input type="date" name="scade" value={form.scade} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary" disabled={saving}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

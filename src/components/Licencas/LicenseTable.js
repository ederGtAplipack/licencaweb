// src/components/Licencas/LicenseTable.jsx
import React from "react";

export default function LicenseTable({ licencas = [], onEdit, onDelete }) {
    const linhas = Array.isArray(licencas) ? licencas : [];

    return (
        <table className="session-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>MAC</th>
                    <th>Software</th>
                    <th>IP</th>
                    <th>Ativação</th>
                    <th>Validade</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {linhas.length > 0 ? (
                    linhas.map((l) => (
                        <tr key={l.id}>
                            <td>{l.numLic}</td>
                            <td>{l.nomeCliente}</td>
                            <td>{l.macAddress}</td>
                            <td>{l.software}</td>
                            <td>{l.ip}</td>
                            <td>{l.dataAtivacao ?? "—"}</td>
                            <td>{l.scade ?? "—"}</td>
                            <td>{l.status}</td>
                            <td>
                                <button className="btn btn-secondary" onClick={() => onEdit(l)}>Editar</button>{" "}
                                <button className="btn btn-danger" onClick={() => onDelete(l.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" style={{ textAlign: "center" }}>Nenhuma licença encontrada</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

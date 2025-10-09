// src/components/Licencas/LicenseTable.jsx
import React, { useState } from "react";
import "./form.css";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Exemplo com 'react-icons'
import { formatDateISOToBR } from "../../utils/date";

export default function LicenseTable({ licencas = [], onEdit, onDelete }) {
    const linhas = Array.isArray(licencas) ? licencas : [];
    const [paginaAtual, setPaginaAtual] = useState(1);
    const registrosPorPagina = 5;

    // calcular índices
    const indexUltimo = paginaAtual * registrosPorPagina;
    const indexPrimeiro = indexUltimo - registrosPorPagina;
    const registrosExibidos = licencas.slice(indexPrimeiro, indexUltimo);

    const totalPaginas = Math.ceil(licencas.length / registrosPorPagina);

    return (
    <div>
        <table className="session-table">
            <thead>
                <tr>
                    <th>Licenca</th>
                    <th>Cliente</th>
                    <th>Tipo Plano</th>
                    <th>{null}</th>
                    {/*<th>ID Contrato</th>*/}
                    <th>Status Contrato</th>
                    <th>Plano Contrato</th>
                    <th>{null}</th>
                    <th>Chave</th>
                    <th>Qtd - Licencas Disponiveis</th>
                    <th>Status Chave</th>
                    <th>Revenda</th>
                    <th>Razão Revenda</th>
                    <th>Software</th>
                    <th>{null}</th>
                    <th>Ident. Device</th>
                    <th>Status Device</th>
                    <th>{null}</th>
                    <th>Criado em:</th>
                    <th>Ativação</th>
                    <th>Validade até:</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                    {registrosExibidos.length > 0 ? (
                        registrosExibidos.map((l) => (
                        <tr key={l.id}>
                            <td>{l.numLic}</td>
                            <td>{l.nomeCliente}</td>
                            <td>{l.tipoLic}</td>
                            <td>{null}</td>
                            <td>{l.statusContrato}</td>
                            <td>{l.planoContrato}</td>
                            <td>{null}</td>
                            <td>{l.chaveLicenca}</td>
                            <td>{l.qtdLicencasContrato}</td>
                            <td>{l.statusChave}</td>
                            <td>{l.idRevenda_Licenca}</td>
                            <td>{l.razaoSocialRevenda}</td>
                            <td>{l.nomeSoftware}</td>
                            <td>{null}</td>
                            <td>{l.deviceFingerprint}</td>
                            <td>{l.statusLicenca}</td>
                            <td>{null}</td>
                            <td>{formatDateISOToBR(l.dataLic ?? "—")}</td>
                            <td>{formatDateISOToBR(l.dataAtivacao ?? "no Active")}</td>
                            <td>{formatDateISOToBR(l.scade ?? "—")}</td>
                            <td>
                                <button className="btn btn-secondary-licen" onClick={() => onEdit(l)}>
                                    <FaEdit />
                                </button>{" "}
                                <button className="btn btn-danger-licen" onClick={() => onDelete(l.id)}>
                                    <FaTrash />
                                </button>
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
        {/* Paginação */ }
        {totalPaginas > 1 && (
            <div className="pagination">
                {/* Botão Primeiro */}
                <button
                    className="btn"
                    onClick={() => setPaginaAtual(1)}
                    disabled={paginaAtual === 1}
                    title="Primeira página"
                >
                    ⏮ Primeiro
                </button>

                {/* Botão Anterior */}
                <button
                    className="btn"
                    onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                    disabled={paginaAtual === 1}
                    title="Página anterior"
                >
                    ◀ Anterior
                </button>

                {/* Indicador de página atual */}
                <span className="page-info">
                    Página {paginaAtual} de {totalPaginas}
                </span>

                {/* Botão Próxima */}
                <button
                    className="btn"
                    onClick={() =>
                        setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
                    }
                    disabled={paginaAtual === totalPaginas}
                    title="Próxima página"
                >
                    Próxima ▶
                </button>

                {/* Botão Último */}
                <button
                    className="btn"
                    onClick={() => setPaginaAtual(totalPaginas)}
                    disabled={paginaAtual === totalPaginas}
                    title="Última página"
                >
                    Último ⏭
                </button>
            </div>
            )}
        </div>
    );
}

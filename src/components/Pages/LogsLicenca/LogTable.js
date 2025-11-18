import React, { useState } from "react";
import { FaEye } from 'react-icons/fa'; // Exemplo com 'react-icons'
import { formatDateISOToBR } from "../../../utils/date"; // Se tiver essa função

export default function LogTable({ logs = [],  onDetails }) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const registrosPorPagina = 12;

    // calcular índices
    const indexUltimo = paginaAtual * registrosPorPagina;
    const indexPrimeiro = indexUltimo - registrosPorPagina;
    const registrosExibidos = logs.slice(indexPrimeiro, indexUltimo);

    const totalPaginas = Math.ceil(logs.length / registrosPorPagina);

    // Função auxiliar para formatar o código de resposta (opcional)
    const renderResponseCode = (code) => {
        let className = "badge";
        if (code >= 200 && code < 300) {
            className += " badge-success";
        } else if (code >= 400) {
            className += " badge-danger";
        } else {
            className += " badge-secondary";
        }
        return <span className={className}>{code || "-"}</span>;
    };

    return (
        <div className="table-container">
            <table className="session-table">
                <thead>
                    <tr>
                        <th>Id Log</th>
                        <th>Licenca (Num/Chave)</th>
                        <th>EndPoint</th>
                        <th>Status</th>
                        <th>Data Criação</th>
                        <th>Mensagem</th>
                        <th className="actions-col">Detalhes</th>
                    </tr>
                </thead>
                <tbody>
                    {registrosExibidos.length > 0 ? (
                        registrosExibidos.map((log) => (
                            <tr key={log.idLog}>
                                <td>{log.idLog}</td>
                                <td>{log.numLic} ({log.chave?.substring(0, 80)}...)</td>
                                <td>{log.endPoint}</td>
                                {/*<td>{log.ClienteIp}</td>*/}
                                <td>{renderResponseCode(log.responseCode)}</td>
                                <td>{formatDateISOToBR(log.createdAt)}</td>
                                {/* A mensagem longa será exibida no modal */}
                                <td>{log.mensagem?.substring(0, 400)}...</td>
                                <td className="actions-col">
                                    <button onClick={() => onDetails(log)} title="Ver Detalhes">
                                        <FaEye />
                                    </button> 
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" style={{ textAlign: "center" }}>
                                Nenhum registro encontrado
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginação */}
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

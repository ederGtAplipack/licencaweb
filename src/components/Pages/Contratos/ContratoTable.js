import React, { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Exemplo com 'react-icons'
import { formatDateISOToBR } from "../../../utils/date";

export default function ContratoTable({ Contratos = [], onEdit, onDelete }) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const registrosPorPagina = 10;

    // calcular índices
    const indexUltimo = paginaAtual * registrosPorPagina;
    const indexPrimeiro = indexUltimo - registrosPorPagina;
    const registrosExibidos = Contratos.slice(indexPrimeiro, indexUltimo);

    const totalPaginas = Math.ceil(Contratos.length / registrosPorPagina);

    // Função para exibir o status como badge colorido
    const renderStatusBadge = (status) => {
        let className = "badge";
        switch (status) {
            case "Ativo":
                className += " badge-success"; // verde
                break;
            case "A vencer":
                className += " badge-warning"; // amarelo
                break;
            case "Vencido":
                className += " badge-danger"; // vermelho
                break;
            default:
                className += " badge-secondary"; // cinza
                break;
        }
        return <span className={className}>{status || "Calculando..."}</span>;
    };

    return (
        <div>
            <table className="session-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente (Razão Social)</th>
                        <th>Plano</th>
                        <th>Qtd. Licencas</th>
                        <th>Data Início</th>
                        <th>Data Fim</th>
                        <th>Periodicidade</th>
                        {/*<th>Pag. Em dia</th>*/}
                        <th>Status</th>
                        {/*<th>Dt. Ult.Pag</th>
                        <th>Dt. Pro.Pag</th>*/}
                        <th>Descrição Contrato</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {registrosExibidos.length > 0 ? (
                        registrosExibidos.map((a) => (
                            <tr key={a.idContrato}>
                                <td>{a.idContrato ?? a.idContrato}</td>
                                <td>{a.razaoSocial || a.idCliente || "-"}</td>
                                <td>{a.plano || "-"}</td>
                                <td>{a.qtdlicencas}</td>
                                <td>{formatDateISOToBR(a.dataInicio)}</td>
                                <td>{formatDateISOToBR(a.datafim)}</td>
                                <td>{a.periodicidade}</td>
                                {/*<td>{a.pagamentoEmDia}</td>*/}
                                <td>{renderStatusBadge(a.statusContrato || "-")}</td>
                                {/*<td>{a.dataUltimoPagamento}</td>
                                <td>{a.dataProximoPagamento}</td>*/}
                                <td>{a.statusDescricao}</td>
                                <td>
                                    <button className="btn btn-secondary-cli" onClick={() => onEdit(a)} title="Editar">
                                        <FaEdit />                                         
                                    </button>
                                    <button className="btn btn-danger-cli" onClick={() => onDelete(a.idContrato)}>
                                        <FaTrash />
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

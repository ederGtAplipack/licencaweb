import React, { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Exemplo com 'react-icons'

export default function ContratoTable({ Contratos = [], onEdit, onDelete }) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const registrosPorPagina = 12;

    // calcular índices
    const indexUltimo = paginaAtual * registrosPorPagina;
    const indexPrimeiro = indexUltimo - registrosPorPagina;
    const registrosExibidos = Contratos.slice(indexPrimeiro, indexUltimo);

    const totalPaginas = Math.ceil(Contratos.length / registrosPorPagina);

    return (
        <div>
            <table className="session-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Plano</th>
                        <th>Qtd. Licencas</th>
                        <th>Dt. Início</th>
                        <th>Dt. Fim</th>
                        <th>Periodicidade</th>
                        {/*<th>Pag. Em dia</th>*/}
                        <th>Descrição</th>
                        <th>Dt. Ult.Pag</th>
                        <th>Dt. Pro.Pag</th>
                        <th>Status Contrato</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {registrosExibidos.length > 0 ? (
                        registrosExibidos.map((a) => (
                            <tr key={a.idContrato}>
                                <td>{a.idContrato}</td>
                                <td>{a.plano}</td>
                                <td>{a.qtdlicencas}</td>
                                <td>{a.dataInicio}</td>
                                <td>{a.datafim}</td>
                                <td>{a.periodicidade}</td>
                                {/*<td>{a.pagamentoEmDia}</td>*/}
                                <td>{a.statusContrato}</td>
                                <td>{a.dataUltimoPagamento}</td>
                                <td>{a.dataProximoPagamento}</td>
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
                    <button
                        className="btn"
                        onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                        disabled={paginaAtual === 1}
                    >
                        ◀ Anterior
                    </button>
                    <span>
                        Página {paginaAtual} de {totalPaginas}
                    </span>
                    <button
                        className="btn"
                        onClick={() =>
                            setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
                        }
                        disabled={paginaAtual === totalPaginas}
                    >
                        Próxima ▶
                    </button>
                </div>
            )}
        </div>
    );
}

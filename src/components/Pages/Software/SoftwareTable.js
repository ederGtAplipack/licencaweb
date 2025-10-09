import React, { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Exemplo com 'react-icons'

export default function SoftwareTable({ Softwares = [], onEdit, onDelete }) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const registrosPorPagina = 12;

    // calcular índices
    const indexUltimo = paginaAtual * registrosPorPagina;
    const indexPrimeiro = indexUltimo - registrosPorPagina;
    const registrosExibidos = Softwares.slice(indexPrimeiro, indexUltimo);

    const totalPaginas = Math.ceil(Softwares.length / registrosPorPagina);

    return (
        <div>
            <table className="session-table">
                <thead>
                    <tr>
                        <th>Id Software</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {registrosExibidos.length > 0 ? (
                        registrosExibidos.map((a) => (
                            <tr key={a.idSoftware}>
                                <td>{a.idSoftware}</td>
                                <td>{a.nSoftware}</td>
                                <td>{a.descricao}</td>
                                <td>
                                    <button className="btn btn-secondary-cli" onClick={() => onEdit(a)} title="Editar">
                                        <FaEdit />                                         
                                    </button>
                                    <button className="btn btn-danger-cli" onClick={() => onDelete(a.idSoftware)}>
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

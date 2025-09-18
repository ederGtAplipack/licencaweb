import React, { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Exemplo com 'react-icons'

export default function RevendaTable({ revendas = [], onEdit, onDelete }) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const registrosPorPagina = 12;

    // calcular índices
    const indexUltimo = paginaAtual * registrosPorPagina;
    const indexPrimeiro = indexUltimo - registrosPorPagina;
    const registrosExibidos = revendas.slice(indexPrimeiro, indexUltimo);

    const totalPaginas = Math.ceil(revendas.length / registrosPorPagina);

    return (
        <div>
            <table className="session-table">
                <thead>
                    <tr>
                        <th>Id Revenda</th>
                        <th>Razão Social</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {registrosExibidos.length > 0 ? (
                        registrosExibidos.map((a) => (
                            <tr key={a.idRevenda}>
                                <td>{a.idRevenda}</td>
                                <td>{a.razaoSocial}</td>
                                <td>
                                    <button className="btn btn-secondary-cli" onClick={() => onEdit(a)} title="Editar">
                                        <FaEdit />                                         
                                    </button>
                                    <button className="btn btn-danger-cli" onClick={() => onDelete(a.idRevenda)}>
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

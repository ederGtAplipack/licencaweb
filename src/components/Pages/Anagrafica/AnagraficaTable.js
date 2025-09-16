import React, { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Exemplo com 'react-icons'

export default function AnagraficaTable({ anagraficas = [], onEdit, onDelete }) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const registrosPorPagina = 12;

    // calcular índices
    const indexUltimo = paginaAtual * registrosPorPagina;
    const indexPrimeiro = indexUltimo - registrosPorPagina;
    const registrosExibidos = anagraficas.slice(indexPrimeiro, indexUltimo);

    const totalPaginas = Math.ceil(anagraficas.length / registrosPorPagina);

    return (
        <div>
            <table className="session-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Razão Social</th>
                        <th>Nome Fantasia</th>
                        <th>Contato</th>
                        <th>Cidade</th>
                        <th>UF</th>
                        <th>CNPJ</th>
                        <th>Telefone</th>
                        {/*<th>Email</th>*/}
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {registrosExibidos.length > 0 ? (
                        registrosExibidos.map((a) => (
                            <tr key={a.idAnagrafica}>
                                <td>{a.idAnagrafica}</td>
                                <td>{a.razaoSocial}</td>
                                <td>{a.nomeFantasia}</td>
                                <td>{a.contato}</td>
                                <td>{a.cidade}</td>
                                <td>{a.uf}</td>
                                <td>{a.cnpj}</td>
                                <td>{a.telefone}</td>
                                {/*<td>{a.email}</td>*/}
                                <td>
                                    <button className="btn btn-secondary-cli" onClick={() => onEdit(a)} title="Editar">
                                        <FaEdit />                                         
                                    </button>
                                    <button className="btn btn-danger-cli" onClick={() => onDelete(a.idAnagrafica)}>
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

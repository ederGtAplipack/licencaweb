import React, { useState } from "react";
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa'; // Exemplo com 'react-icons'
import { useNavigate } from "react-router-dom";

export default function AnagraficaTable({ anagraficas = [], onEdit, onDelete }) {
    const navigate = useNavigate();
    const [paginaAtual, setPaginaAtual] = useState(1);
    const registrosPorPagina = 12;

    // calcular índices
    const indexUltimo = paginaAtual * registrosPorPagina;
    const indexPrimeiro = indexUltimo - registrosPorPagina;
    const registrosExibidos = anagraficas.slice(indexPrimeiro, indexUltimo);

    const totalPaginas = Math.ceil(anagraficas.length / registrosPorPagina);

    const hanleRowClick = (id) => {
        navigate(`/dashboard/anagrafica/${id}`);
    };


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
                                <tr>
                                 <td>
                                    <button className="btn btn-secondary-cli" onClick={() => onEdit(a)} title="Editar">
                                        <FaEdit />                                         
                                    </button>
                                    <button className="btn btn-danger-cli" onClick={() => onDelete(a.idAnagrafica)}>
                                        <FaTrash />
                                        </button>
                                    <button className="btn btn-info" onClick={() => hanleRowClick(a.idAnagrafica)}>
                                        <FaInfoCircle />
                                    </button>
                                 </td>
                                </tr>
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
            {/* Paginação Melhorada com opções Primeiro e Último */}
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

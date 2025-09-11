import React, { useState } from "react";

export default function TemplateTable({ usuarios = [] }) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const registrosPorPagina = 10;

    const indexUltimo = paginaAtual * registrosPorPagina;
    const indexPrimeiro = indexUltimo - registrosPorPagina;
    const registrosExibidos = usuarios.slice(indexPrimeiro, indexUltimo);

    const totalPaginas = Math.ceil(usuarios.length / registrosPorPagina);

    return (        
        <div>
            <table className="session-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuário</th>
                        <th>Email</th>
                        <th>Perfil</th>
                    </tr>
                </thead>
                <tbody>
                    {registrosExibidos.length > 0 ? (
                        registrosExibidos.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.userName}</td>
                                <td>{r.email}</td>
                                <td>{Array.isArray(r.roles) ? r.roles.join(", ") : "-"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                Nenhum registro encontrado
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {totalPaginas > 1 && (
                <div className="pagination">
                    <button
                        className="btn"
                        onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                        disabled={paginaAtual === 1}
                    >
                        ◀ Anterior
                    </button>
                    <span>
                        Página {paginaAtual} de {totalPaginas}
                    </span>
                    <button
                        className="btn"
                        onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
                        disabled={paginaAtual === totalPaginas}
                    >
                        Próxima ▶
                    </button>
                </div>
            )}
        </div>
    );
}

// src/pages/Dashboard/Dashboard.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importe o componente Link
import api from "../../services/api";
import "../../style.css";

function Dashboard() {
    const [licencas, setLicencas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [username, setUsername] = useState("");

    // Exemplo de busca de licenças via API
    useEffect(() => {
        async function fetchLicencas() {
            try {
                // Rota de busca pode ser ajustada para sua API
                const { data } = await api.get("");
                setLicencas(data);
            } catch (err) {
                console.error("Erro ao carregar licenças", err);
            }
        }
        fetchLicencas();
    }, []);

    // Filtragem das licenças
    const licencasFiltradas = licencas.filter((l) =>
        [l.cliente, l.mac, l.ip].some((campo) =>
            campo?.toLowerCase().includes(filtro.toLowerCase())
        )
    );

    /* Renderização do componente */
    return (
        <div className="container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">
                    {/* Imagem */}
                    <img src="../img/Aplipack_Software.png" alt="Logo Aplipack" width="100%" />
                </div>
                <nav>
                    <ul>
                        <li>
                            {/* Use o Link para navegação interna */}
                            <Link to="/dashboard" className="active">
                                Home
                            </Link>
                        </li>
                        <li>
                            {/* Use o Link para navegação interna */}
                            <Link to="/nova-licenca">Nova Licença</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Conteúdo Principal */}
            <div className="main">
                {/* Topbar */}
                <header className="topbar">
                    <div className="title">Sistema de Licenças - Aplipack Software</div>
                    <div className="user-info">
                        <span>{username}</span> | <Link to="/login">Logout</Link>
                        <div className="timezone">All times are UTC-03:00</div>
                    </div>
                </header>

                {/* Conteúdo */}
                <main>
                    <section className="card-section">
                        <div className="card">
                            <div className="card-header">
                                <input
                                    type="text"
                                    placeholder="🔍 Buscar por cliente, MAC ou IP..."
                                    className="search-input" // Adicionada classe CSS
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                />
                            </div>
                            <div className="card-subheader">
                                Filtrando por: <strong>{filtro || "Todos"}</strong>
                                <strong>Total de Licenças Ativas: { } <span>{licencasFiltradas.length}</span></strong>
                            
                            </div>

                            <table className="session-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>MAC</th>
                                        <th>Software</th>
                                        <th>IP</th>
                                        <th>Data de Ativação</th>
                                        <th>Validade</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {licencasFiltradas.map((l) => (
                                        <tr key={l.id}>
                                            <td>{l.id}</td>
                                            <td>{l.cliente}</td>
                                            <td>{l.mac}</td>
                                            <td>{l.software}</td>
                                            <td>{l.ip}</td>
                                            <td>{l.dataAtivacao}</td>
                                            <td>{l.validade}</td>
                                            <td>{l.status}</td>
                                            <td>
                                                <button>Editar</button>
                                                <button>Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="card">
                            <canvas id="graficoSoftware" width="600" height="280"></canvas>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
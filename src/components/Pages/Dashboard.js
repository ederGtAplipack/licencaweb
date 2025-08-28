// src/pages/Dashboard/Dashboard.js
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Importe o componente Link
import api from "../../services/api";
import { Chart } from "chart.js/auto"; // Importa Chart.js
import "../../style.css";

function Dashboard() {
    const [licencas, setLicencas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const chartRef = useRef(null);
    const chartInstance = useRef(null);


    // Recupera o nome de usuário do localStorage
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Busca de licenças via API
    useEffect(() => {
        async function fetchLicencas() {
            setLoading(true);
            setErro("");

            try {
                // Rota de busca pode ser ajustada para sua API
                const { data } = await api.get("api/v1/licenca/GetAllWithDetails");
                setLicencas(data);
            } catch (err) {
                console.error("Erro ao carregar licenças", err);
                setErro("Não foi possível carregar as licenças. Tente novamente mais tarde.");
                //setLicencas([]); // Define como array vazio em caso de erro
            } finally {
                // Qualquer ação final, se necessário
                setLoading(false);
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

    // Atualiza o gráfico quando as licenças mudam
    useEffect(() => {
        if (!loading && licencas.length > 0) {
            const softwareCount = licencas.reduce((acc, l) => {
                acc[l.software] = (acc[l.software] || 0) + 1;
                return acc;
            }, {});

            const labels = Object.keys(softwareCount);
            const valores = Object.values(softwareCount);

            if (chartInstance.current) {
                chartInstance.current.destroy(); // Evita duplicar o gráfico
            }

            chartInstance.current = new Chart(chartRef.current, {
                type: "bar",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "Licenças por Software",
                            data: valores,
                            backgroundColor: "rgba(75, 192, 192, 0.5)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true },
                        title: { display: true, text: "Distribuição de Licenças" }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }, [licencas, loading]);

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

                            {loading && <p>Carregando licenças...</p>}
                            {erro && <p style={{ color: "red" }}>{erro}</p>}

                            {!loading && !erro && ( 
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
                                            <td>{l.numLic}</td>
                                            <td>{l.nomeCliente}</td>
                                            <td>{l.macAddress}</td>
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
                                        {licencasFiltradas.length === 0 && (
                                            <tr>
                                                <td colSpan="9" style={{ textAlign: "center" }}>
                                                    Nenhuma licença encontrada
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                              </table>
                            )}
                        </div>

                        <div className="card-h2">
                            <canvas ref={chartRef} id="graficoSoftware" width="600" height="280"></canvas>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
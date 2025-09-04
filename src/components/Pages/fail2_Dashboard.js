// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import FilterBar from "../../components/Licencas/FilterBar";
import LicenseTable from "../../components/Licencas/LicenseTable";
import LicenseModal from "../../components/Licencas/LicenseModal";
import "../../style.css"

export default function Dashboard() {
    const [username] = useState(localStorage.getItem("username") || "Usuário");
    const [licencas, setLicencas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const load = async () => {
        setLoading(true);
        setErro("");
        try {
            const { data } = await api.get("api/v1/licencaquery/GetAllWithDetails");
            setLicencas(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setErro("Erro ao carregar licenças.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const licencasFiltradas = licencas.filter((l) =>
        [l.nomeCliente, l.macAddress, l.ip].some((c) => c?.toLowerCase().includes(filtro.toLowerCase()))
    );

    const handleOpenNew = () => {
        setEditing(null);
        setShowModal(true);
    };

    const handleEdit = (lic) => {
        setEditing(lic);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Confirmar exclusão?")) return;
        try {
            await api.delete(`api/v1/licenca/${id}`);
            setLicencas((p) => p.filter(x => x.id !== id));
        } catch (err) {
            console.error("Erro excluir:", err);
            alert("Erro ao excluir licença.");
        }
    };

    return (
        <div className="container">
            <aside className="sidebar">
                <div className="logo"><img src="../img/Aplipack_Software.png" alt="Logo" /></div>
                <nav>
                    <ul>
                        <li><Link to="/dashboard" className="active">Home</Link></li>
                        <li><a href="#" onClick={handleOpenNew}>Nova Licença</a></li>
                    </ul>
                </nav>
            </aside>

            <div className="main">
                <header className="topbar">
                    <h1>Sistema de Licenças - Aplipack</h1>
                    <div className="user-info"><span>{username}</span> | <Link to="/login">Logout</Link></div>
                </header>

                <main>
                    <FilterBar filtro={filtro} setFiltro={setFiltro} total={licencasFiltradas.length} onOpenModal={handleOpenNew} />

                    {loading && <p>Carregando licenças...</p>}
                    {erro && <p className="erro">{erro}</p>}

                    {!loading && !erro && (
                        <LicenseTable
                            licencas={licencasFiltradas}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </main>
            </div>

            <LicenseModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSaved={() => { setShowModal(false); load(); }}
                initial={editing}
            />
        </div>
    );
}

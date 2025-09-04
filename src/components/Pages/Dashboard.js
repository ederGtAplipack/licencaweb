import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import FilterBar from "../../components/Licencas/FilterBar";
import LicenseTable from "../../components/Licencas/LicenseTable";
import "../../style.css";

function Dashboard() {
    const GET_URL = "/api/v1/licencaquery/GetAllWithDetails";
    const POST_URL = "/CreateNewlin"; // Verifique a rota correta no backend

    const [username] = useState(localStorage.getItem("username") || "Usu�rio");
    const [licencas, setLicencas] = useState([]);
    const [licencaSelect, setLicencaSelect] = useState({
        idCliente: "",
        nomeCliente: "",
        macAddress: "",
        software: "",
        ip: "",
        scade: "",
        status: "Ativa"
    });
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [addModal, setAddModal] = useState(false);

    const openCloseModal = () => setAddModal(!addModal);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLicencaSelect((prev) => ({ ...prev, [name]: value }));
    };

    // Carrega licen�as
    const loadLicencas = async () => {
        setLoading(true);
        try {
            const response = await api.get(GET_URL);
            setLicencas(response.data);
        } catch (error) {
            console.error("Erro ao carregar licen�as:", error);
            setErro("Erro ao carregar licen�as.");
        } finally {
            setLoading(false);
        }
    };

    // Salva ou atualiza licen�a
    const salvarLicenca = async () => {
        try {
            const clienteIdNum = parseInt(licencaSelect.idCliente, 10);
            if (isNaN(clienteIdNum) || clienteIdNum <= 0) {
                alert("Informe um ClienteId v�lido.");
                return;
            }

            const now = new Date().toISOString();

            const payload = {
                idCliente: clienteIdNum,
                nomeCliente: licencaSelect.nomeCliente || "Cliente Desconhecido",
                tipoLic: licencaSelect.tipoLic || "Padr�o",
                macAddress: licencaSelect.macAddress,
                dataLic: now,
                scade: licencaSelect.scade ? new Date(licencaSelect.scade).toISOString() : now,
                attivo: true,
                idRevenda: licencaSelect.idRevenda ? parseInt(licencaSelect.idRevenda, 10) : 1,
                sistemaOp: licencaSelect.sistemaOp || "Windows",
                dataAtivacao: now,
                tipoPc: licencaSelect.tipoPc || "Desktop",
                nomeComputador: licencaSelect.nomeComputador || "PC-Gen�rico",
                software: licencaSelect.software,
                ip: licencaSelect.ip,
                processador: licencaSelect.processador || "Intel i5",
                status: licencaSelect.status || "Ativa",
                idLicencaChave: licencaSelect.idLicencaChave ? parseInt(licencaSelect.idLicencaChave, 10) : 0,
                chaveLicenca: licencaSelect.chaveLicenca || "ABC123-XYZ"
            };

            console.log("Payload enviado:", payload);
            const response = await api.post("/CreateNewLin", payload);
            setLicencas((prev) => [...prev, response.data]);
            openCloseModal();
        } catch (error) {
            console.error("Erro ao salvar licen�a:", error.response?.data || error.message);
            setErro("Erro ao salvar licen�a.");
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        salvarLicenca();
    };

    // Exclui licen�a
    const handleDelete = async (id) => {
        if (!window.confirm("Confirmar exclus�o?")) return;
        try {
            await api.delete(`/api/v1/licenca/${id}`);
            setLicencas((prev) => prev.filter((l) => l.id !== id));
        } catch (err) {
            console.error("Erro ao excluir:", err);
            alert("Erro ao excluir licen�a.");
        }
    };

    useEffect(() => {
        loadLicencas();
    }, []);

    const licencasFiltradas = licencas.filter((l) =>
        [l.nomeCliente, l.macAddress, l.ip].some((c) => c?.toLowerCase().includes(filtro.toLowerCase()))
    );

    return (
        <div className="container">
            <aside className="sidebar">
                <div className="logo">
                    <img src="../img/Aplipack_Software.png" alt="Logo" />
                </div>
                <nav>
                    <ul>
                        <li><Link to="/dashboard" className="active">Home</Link></li>
                        <li><Link to="/anagrafica">Anagr�fica</Link></li>
                        <li><button onClick={openCloseModal} className="btn-link">Nova Licen�a</button></li>
                    </ul>
                </nav>
            </aside>

            <div className="main">
                <header className="topbar">
                    <h1>Sistema de Licen�as - Aplipack</h1>
                    <div className="user-info">
                        <span>{username}</span> | <Link to="/login">Logout</Link>
                    </div>
                </header>

                <FilterBar filtro={filtro} setFiltro={setFiltro} openCloseModal={openCloseModal} />

                {loading ? (
                    <p>Carregando...</p>
                ) : erro ? (
                    <p className="error">{erro}</p>
                ) : (
                    <LicenseTable licencas={licencasFiltradas} onEdit={salvarLicenca} onDelete={handleDelete} />
                )}

                {addModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2 className="modal-title">Nova Licen�a</h2>
                            <form id="formLicenca" onSubmit={handleSubmit}>

                                <div className="form-grid">
                                {/* Campos obrigat�rios */}
                                <div className="form-group">
                                    <label>ID Cliente</label>
                                    <input name="idCliente" type="number" onChange={handleChange} className="form-control" required />
                                </div>                                

                                <div className="form-group">
                                    <label>Nome Cliente</label>
                                    <input name="nomeCliente" onChange={handleChange} className="form-control" required />
                                </div>

                                <div className="form-group">
                                    <label>MAC Address</label>
                                    <input name="macAddress" onChange={handleChange} className="form-control" required />
                                </div>

                                <div className="form-group">
                                    <label>Software</label>
                                    <input name="software" onChange={handleChange} className="form-control" required />
                                </div>

                                <div className="form-group">
                                    <label>IP</label>
                                    <input name="ip" onChange={handleChange} className="form-control" required />
                                </div>

                                <div className="form-group">
                                    <label>Validade</label>
                                    <input type="date" name="scade" onChange={handleChange} className="form-control" required />
                                </div>

                                {/* Campos opcionais com valor padr�o */}
                                <div className="form-group">
                                    <label>Tipo Licen�a</label>
                                    <input name="tipoLic" onChange={handleChange} className="form-control" placeholder="Padr�o" />
                                </div>

                                <div className="form-group">
                                    <label>Sistema Operacional</label>
                                    <input name="sistemaOp" onChange={handleChange} className="form-control" placeholder="Windows" />
                                </div>

                                <div className="form-group">
                                    <label>Tipo PC</label>
                                    <input name="tipoPc" onChange={handleChange} className="form-control" placeholder="Desktop" />
                                </div>

                                <div className="form-group">
                                    <label>Nome Computador</label>
                                    <input name="nomeComputador" onChange={handleChange} className="form-control" placeholder="PC-Gen�rico" />
                                </div>

                                <div className="form-group">
                                    <label>Processador</label>
                                    <input name="processador" onChange={handleChange} className="form-control" placeholder="Intel i5" />
                                </div>

                                <div className="form-group">
                                    <label>Chave Licen�a</label>
                                    <input name="chaveLicenca" onChange={handleChange} className="form-control" placeholder="ABC123-XYZ" />
                                </div>
                                </div>

                                {/* Bot�es */}
                                <div className="modal-actions">
                                    <button type="button" onClick={openCloseModal} className="btn btn-secondary">Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Dashboard;

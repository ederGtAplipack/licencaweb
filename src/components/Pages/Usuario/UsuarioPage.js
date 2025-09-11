import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import UsuarioTable from "../Usuario/UsuarioTable";
import UsuarioModal from "../Usuario/UsuarioModal";
import FilterBar from "../Usuario/FilterBar";
import "./form.css";


export default function UsuarioPage() {
const [usuarios, setUsuarios] = useState([]);
const [loading, setLoading] = useState(false);
const [filtro, setFiltro] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [error, setError] = useState("");

    const loadData = async () => {
    setLoading(true);
    try {
        const response = await api.get("/api/v1/Auth/GetAllUsers");

        const data = Array.isArray(response.data) ? response.data : [response.data];
        console.log("Dados recebidos da API:", data); // Log para verificar os dados recebidos

        setUsuarios(data);
        setMensagem(`Total de registros: ${data.length}`);
        setError("");
    } catch (err) {
        console.error("Erro ao carregar Registros:", err);
        setError("Erro ao carregar dados.");
        setMensagem("");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    loadData();
}, []);


/*export default function UsuarioPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtro, setFiltro] = useState("");
    const [showModal, setShowModal] = useState(false);
    const loadData = async () => {
        setLoading(true);
        try {
            const resp = await api.get("/api/v1/Auth/Register");
            setUsuarios(resp.data);
        }

        catch (err) {
            console.error("Erro ao carregar usuários:", err);
        }

        finally {
            setLoading(false);
        }

    }
        ;

    useEffect(() => {
        loadData();
    }, []);
    */

    const usuariosFiltrados = usuarios.filter((u) =>
        [u.id, u.userName, u.email, u.roles].some((c) => c?.toLowerCase().includes(filtro.toLowerCase()))
    );

    return (
        <div className="container-ana">
        <br></br>
            <FilterBar filtro={filtro} setFiltro={setFiltro} total={usuariosFiltrados.length} />
            <div className="card">
            {loading ? (
                <p>Carregando...</p>
            ) : (
                <UsuarioTable usuarios={usuariosFiltrados} />
            )}
            {showModal && (
                <UsuarioModal onClose={() => setShowModal(false)} onSaved={loadData} />
                )}
            </div>
            
        </div>
    );
}

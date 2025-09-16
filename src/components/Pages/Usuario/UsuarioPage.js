// src/components/Usuario/UsuarioPage.js
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

    const loadData = async () => {
        setLoading(true);
        try {
            // use the API endpoint you actually have (GetAllUsers in your original code)
            const response = await api.get("/api/v1/Auth/GetAllUsers");
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setUsuarios(data);
        } catch (err) {
            console.error("Erro ao carregar Registros:", err);
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // filtro simples (assegure que campos existem e são strings)
    const usuariosFiltrados = usuarios.filter((u) => {
        const search = filtro.trim().toLowerCase();
        if (!search) return true;
        // converter valores para string com fallback
        const values = [
            String(u.id || ""),
            String(u.userName || ""),
            String(u.email || ""),
            Array.isArray(u.roles) ? u.roles.join(", ") : String(u.roles || "")
        ];
        return values.some((v) => v.toLowerCase().includes(search));
    });

    return (
        <div className="container-ana">
            <br />
            {/* Passa onAdd para abrir modal e total */}
            <FilterBar
                filtro={filtro}
                setFiltro={setFiltro}
                total={usuariosFiltrados.length}
                onAdd={() => setShowModal(true)}
            />

            <div className="card">
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <UsuarioTable usuarios={usuariosFiltrados} />
                )}

                {showModal && (
                    <UsuarioModal
                        onClose={() => setShowModal(false)}
                        onSaved={async () => {
                            // quando o modal notificar que salvou, recarregamos aqui
                            await loadData();
                            setShowModal(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

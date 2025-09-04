// src/pages/Licencas/LicencasPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import LicenseTable from "../../components/Licencas/LicenseTable";
import FilterBar from "../../components/Licencas/FilterBar";

export default function LicencasPage() {
    const [licencas, setLicencas] = useState([]);
    const [filtro, setFiltro] = useState("");


    const licencasFiltradas = licencas.filter((l) =>
        [l.nomeCliente, l.macAddress, l.ip].some((c) => c?.toLowerCase().includes(filtro.toLowerCase()))
    );

    useEffect(() => {
        axios.get("http://192.168.200.124:8080/api/v1/licencaquery/GetAllWithDetails")
            .then((resp) => setLicencas(resp.data))
            .catch((err) => console.error("Erro ao carregar licenças:", err));
    }, []);

    return (
        <div>
            <FilterBar filtro={filtro} setFiltro={setFiltro}/> 
            <LicenseTable licencas={licencas} onEdit={() => { }} onDelete={() => { }} />
        </div>
    );
}

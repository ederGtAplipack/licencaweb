// src/pages/Home/HomePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";

export default function HomePage() {
    const [licencas, setLicencas] = useState([]);

    const STATUS_COLORS = {
        Ativa: "#28a745",      // verde
        Expirada: "#dc3545",   // vermelho
        Pendente: "#ffc107",   // amarelo
        Suspensa: "#6c757d"    // cinza
    };

    const CLIENT_COLORS = ["#007bff", "#6610f2", "#6f42c1", "#e83e8c", "#fd7e14"];
    const SOFTWARE_COLORS = ["#20c997", "#17a2b8", "#0dcaf0", "#6c757d", "#198754"];



    useEffect(() => {
        axios.get("http://192.168.200.124:8080/api/v1/licencaquery/GetAllWithDetails")
            .then((resp) => setLicencas(resp.data))
            .catch((err) => console.error("Erro ao carregar dados:", err));
    }, []);

    // Agrupamento por status
    const statusData = Object.values(
        licencas.reduce((acc, l) => {
            acc[l.status] = acc[l.status] || { status: l.status, total: 0 };
            acc[l.status].total++;
            return acc;
        }, {})
    );

    // Agrupamento por cliente
    const clienteData = Object.values(
        licencas.reduce((acc, l) => {
            acc[l.nomeCliente] = acc[l.nomeCliente] || { name: l.nomeCliente, value: 0 };
            acc[l.nomeCliente].value++;
            return acc;
        }, {})
    );

    // Agrupamento por software
    const softwareData = Object.values(
        licencas.reduce((acc, l) => {
            acc[l.software] = acc[l.software] || { software: l.software, total: 0 };
            acc[l.software].total++;
            return acc;
        }, {})
    );

    const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8"];

    return (
        <div>
            <h2>Resumo de Licenças</h2>

            {/* Gráfico por Status */}
            <h3>Licenças por Status</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#007bff" />
                </BarChart>
            </ResponsiveContainer>

            {/* Gráfico por Cliente */}
            <h3>Licenças por Cliente</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={clienteData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        label
                    >
                        {clienteData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>

            {/* Gráfico por Software */}
            <h3>Licenças por Software</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={softwareData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="software" />
                    <Tooltip />
                    <Bar dataKey="total" fill="#28a745" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

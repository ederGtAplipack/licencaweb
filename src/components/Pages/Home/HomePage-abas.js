// src/components/Pages/Home/HomePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function HomePage() {
    const [licencas, setLicencas] = useState([]);
    const [activeTab, setActiveTab] = useState("status");
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        axios
            .get("http://192.168.200.124:8080/api/v1/licencaquery/GetAllWithDetails")
            .then((resp) => setLicencas(resp.data))
            .catch((err) => console.error("Erro ao carregar dados:", err));
    }, []);

    // Função para trocar de aba com animação
    const handleTabChange = (tab) => {
        if (tab !== activeTab) {
            setTransitioning(true);
            setTimeout(() => {
                setActiveTab(tab);
                setTransitioning(false);
            }, 300); // tempo da animação
        }
    };

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
            acc[l.nomeCliente] =
                acc[l.nomeCliente] || { name: l.nomeCliente, value: 0 };
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

    const COLORS = ["#4f46e5", "#16a34a", "#f59e0b", "#ef4444", "#0ea5e9"];

    return (
        <div className="p-6">
            <div className="rounded-2xl border bg-white shadow-xl">
                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "status"
                                ? "border-b-2 border-indigo-600 text-indigo-600"
                                : "text-gray-600 hover:text-indigo-500"
                            }`}
                        onClick={() => handleTabChange("status")}
                    >
                        Licenças por Status
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "cliente"
                                ? "border-b-2 border-indigo-600 text-indigo-600"
                                : "text-gray-600 hover:text-indigo-500"
                            }`}
                        onClick={() => handleTabChange("cliente")}
                    >
                        Licenças por Cliente
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "software"
                                ? "border-b-2 border-indigo-600 text-indigo-600"
                                : "text-gray-600 hover:text-indigo-500"
                            }`}
                        onClick={() => handleTabChange("software")}
                    >
                        Licenças por Software
                    </button>
                </div>

                {/* Conteúdo com animação */}
                <div
                    className={`p-6 transition-opacity duration-300 transform ${transitioning ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
                        }`}
                >
                    {activeTab === "status" && (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="status" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                                <Bar
                                    dataKey="total"
                                    fill="url(#statusGradient)"
                                    radius={[8, 8, 0, 0]}
                                    animationDuration={1200}
                                />
                                <defs>
                                    <linearGradient id="statusGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {activeTab === "cliente" && (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={clienteData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={120}
                                    label
                                    animationDuration={1200}
                                >
                                    {clienteData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#gradient-${index % COLORS.length})`}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                                {COLORS.map((color, i) => (
                                    <defs key={i}>
                                        <radialGradient id={`gradient-${i}`} cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                                            <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                                        </radialGradient>
                                    </defs>
                                ))}
                            </PieChart>
                        </ResponsiveContainer>
                    )}

                    {activeTab === "software" && (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart layout="vertical" data={softwareData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis type="category" dataKey="software" stroke="#6b7280" />
                                <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                                <Bar
                                    dataKey="total"
                                    fill="url(#softwareGradient)"
                                    radius={[0, 8, 8, 0]}
                                    animationDuration={1200}
                                />
                                <defs>
                                    <linearGradient id="softwareGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#86efac" stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}

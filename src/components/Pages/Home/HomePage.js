// src/components/Pages/Home/HomePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import 'echarts-gl'; 
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
    LabelList,
} from "recharts";

export default function HomePage() {
    const [licencas, setLicencas] = useState([]);

    useEffect(() => {
        axios
            .get("http://192.168.200.34:8080/api/v1/licencaquery/GetAllWithDetails")
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

    // Separe as categorias e os valores para o ECharts
    const categories = statusData.map(d => d.status);
    const values = statusData.map(d => d.total);

    // ... (demais códigos)

    // Configuração do gráfico 3D
    const status3DOptions = {
        tooltip: {},
        xAxis3D: {
            type: 'category',
            data: categories,
            name: 'Status',
        },
        yAxis3D: {
            type: 'value',
            name: 'Total',
        },
        zAxis3D: {
            type: 'value',
            name: 'Valor',
            max: Math.max(...values) * 1.2
        },
        grid3D: {
            boxWidth: 300,
            boxDepth: 120,
            // Estilize a aparência da grade 3D
        },
        series: [{
            type: 'bar3D',
            data: statusData.map(d => [d.status, d.total, d.total]),
            shading: 'lambert', // Sombreamento para efeito 3D
            label: {
                show: true,
                formatter: '{c}', // Mostra o valor no topo da barra
                position: 'top',
            },
        }],
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Licenças por Status */}
            <div className="rounded-2xl border bg-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-transform duration-300">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Licenças por Status
                    </h3>
                </div>
                <div className="p-4">
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
                                animationDuration={2100}
                            />
                            <defs>
                                <linearGradient id="statusGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#b1b8f2" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#2039a6" stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Licenças por Cliente */}
            <div className="rounded-2xl border bg-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-transform duration-300">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Licenças por Cliente
                    </h3>
                </div>
                <div className="p-4">
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
                </div>
            </div>

            {/* Licenças por Software */}
            <div className="rounded-2xl border bg-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-transform duration-300">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Licenças por Software
                    </h3>
                </div>
                <div className="p-4">
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
                                    <stop offset="5%" stopColor="#b1b8f2" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#2039a6" stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Espaço reservado para futuros gráficos */}
            {/* Gráfico 3D com ECharts */}
            <div className="rounded-2xl border bg-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-transform duration-300">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Licenças por Status (3D)
                    </h3>
                </div>
                <div className="p-4">
                    <ReactECharts option={status3DOptions} style={{ height: 300 }} />
                </div>
            </div>
        </div>
    );
}

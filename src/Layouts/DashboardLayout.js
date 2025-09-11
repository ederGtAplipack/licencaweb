// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../style.css";

export default function DashboardLayout() {
    const username = localStorage.getItem("username") || "Usuário";
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Detecta se é mobile e ajusta sidebar
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) setSidebarOpen(false);
            else setSidebarOpen(true);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="container">
            {/* Sidebar animada */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        className="sidebar"
                        initial={{ x: -250, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -250, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="logo">
                            <img src="../img/Aplipack_Software.png" alt="Logo" />
                        </div>
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/dashboard/home">Home</Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/licencas">Licenças</Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/anagrafica">Cliente</Link>
                                </li>
                            </ul>
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="main">
                <header className="topbar">
                    <div className="flex items-center">
                        {/* Botão para abrir/fechar no mobile */}
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="mr-4 p-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                ☰
                            </button>
                        )}
                        <h1>Sistema de Licenças - Aplipack</h1>
                    </div>

                    <div className="user-info">
                        <li>
                            <Link to="/dashboard/usuario">Usuários</Link>
                        </li>
                        <div className="icon">
                            <img src="../img/profile_80px.png" alt="Profile" />
                        </div>
                        <span>{username}</span> | <Link to="/login">Logout</Link>
                    </div>
                </header>

                {/* Conteúdo */}
                <div className="content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

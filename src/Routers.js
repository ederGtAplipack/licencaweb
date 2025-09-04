import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import DashboardLayout from "./Layouts/DashboardLayout";
import HomePage from "./components/Pages/Home/HomePage";
import LicencasPage from "./components/Licencas/LicencasPage";
import AnagraficaPage from "./components/Pages/Anagrafica/AnagraficaPage";

/*
  Componente de rotas da aplicação.
  Define as rotas para Login e Dashboard, incluindo redirecionamento.
*/
export default function Routers() {
    return (
        <Router>
            <Routes>
                {/* Redireciona raiz para login */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />

                {/* Rotas do Dashboard com layout fixo */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path="home" element={<HomePage />} />
                    <Route path="licencas" element={<LicencasPage />} />
                    <Route path="anagrafica" element={<AnagraficaPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

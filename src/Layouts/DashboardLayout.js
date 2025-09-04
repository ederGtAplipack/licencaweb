// src/layouts/DashboardLayout.jsx
import React from "react";
import { Link,Outlet } from "react-router-dom";
import "../style.css";

export default function DashboardLayout() {
  const username = localStorage.getItem("username") || "Usu�rio";

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src="../img/Aplipack_Software.png" alt="Logo" />
        </div>   
        <nav>
        <ul>
            <li><Link to="/dashboard/home">Home</Link></li>
            <li><Link to="/dashboard/licencas">Licen�as</Link></li>
            <li><Link to="/dashboard/anagrafica">Anagrafica</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <h1>Sistema de Licen�as - Aplipack</h1>
          <div className="user-info">
            <span>{username}</span> | <Link to="/login">Logout</Link>
          </div>
        </header>

        {/* Aqui as rotas filhas ser�o renderizadas */}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

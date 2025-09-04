// src/Pages/Anagrafica/FilterBar.jsx
import React, { useEffect, useState } from "react";
import AnagraficaModal from "../Anagrafica/AnagraficaModal";

export default function FilterBar({ filtro, setFiltro, total, openCloseModal }) {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <div className="card">
            <div className="card-header">
                <input
                    type="text"
                    placeholder="🔍 Buscar por cliente, MAC ou IP..."
                    className="search-input"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            <div className="card-header-filtro">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div className="card-subheader">
                        Filtrando por: <strong>{filtro || "Todos"}</strong>
                        <span style={{ marginLeft: 12 }}>Total: <strong>{total}</strong></span>
                    </div>

                    <div>
                        <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                            Adicionar Anagrafica
                        </button>                        
                    </div>
                </div>
            </div>
        </div>
    );
}

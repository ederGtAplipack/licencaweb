// src/components/Licencas/FilterBar.jsx
import React from "react";

export default function FilterBar({ filtro, setFiltro, total, openCloseModal }) {
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
                        <button className="btn btn-primary" onClick={openCloseModal}>
                            + Nova Licença
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

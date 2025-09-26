// src/Pages/Anagrafica/FilterBar.jsx
import React from "react";
import "./Revenda_style.css";

export default function FilterBar({ filtro, setFiltro, total = 0, onAdd }) {    
    return (
    <div className="card">
      <div className="card-header">
          <input
                    type="text"
                    placeholder="🔍 Buscar por ID ou Razão..."
                    className="search-input"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
           />
      </div>
      <div className="card-header-filtro">
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%"
                }}
                >
            <div className="card-subheader">
                Filtrando por: <strong>{filtro || "Todos"}</strong>
                <span style={{ marginLeft: 12 }}>
                    Total: <strong>{total}</strong>
                        </span>
            </div>
                    <button className="btn btn-primary-cliente" onClick={() => {
                        if (onAdd) onAdd();
                        }}
                    >
                        + Nova Revenda  
                    </button>
         </div>
         </div>            
    </div>
  );
}

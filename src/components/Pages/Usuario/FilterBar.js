// src/components/Usuario/FilterBar.js
import React from "react";

export default function FilterBar({ filtro, setFiltro, total = 0, onAdd }) {
    return (
        <div className="card">
            <div className="card-header">
                {/* se quiser input de busca, descomente */}
                {/* <input
          type="text"
          placeholder="🔍 Buscar por Usuario ou Descrição..."
          className="search-input"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        /> */}
            </div>

            <div className="card-header-filtro-usuario">
                <div className="card-subheader">
                    {/* Ex.: Filtrando por: <strong>{filtro || "Todos"}</strong> 
                    <span style={{ marginLeft: 12 }}>
                        Total: <strong>{total}</strong>
                    </span>*/}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (onAdd) onAdd();
                    }}
                >
                    + Novo Usuário
                </button>
            </div>
        </div>
    );
}

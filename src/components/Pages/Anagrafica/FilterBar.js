// src/Pages/Anagrafica/FilterBar.jsx
import React from "react";
import "./Cliente_style.css";

export default function FilterBar({ filtro, setFiltro, total = 0, onAdd }) {
    /*const [showModal, setShowModal] = useState(false);  
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [error, setError] = useState("");
    const [anagraficas, setAnagraficas] = useState([]);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/Anagrafica/AllAnagrafica");
            setAnagraficas(response.data);
            setMensagem(`Total de registros: ${response.data.length}`);
            setError("");
        } catch (err) {
            console.error("Erro ao carregar anagráficas:", err);
            setError("Erro ao carregar dados.");
            setMensagem("");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);*/
    
    return (
    <div className="card">
      <div className="card-header">
          <input
                    type="text"
                    placeholder="🔍 Buscar por cliente, Razão ou CNPJ..."
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
                        + Novo Cliente  
                    </button>
         </div>
         </div>            
    </div>
  );
}

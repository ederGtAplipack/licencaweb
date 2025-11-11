// src/pages/Licencas/LicencasPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import LicenseTable from "../../components/Licencas/LicenseTable";
import FilterBar from "../../components/Licencas/FilterBar";
import LicenseModal from "./LicenseModal";

const MessageModal = ({ type, message, onClear, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className={`message-content ${type}`}>
                <p>{message}</p>
                {type === "confirm" ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <button onClick={onConfirm} className="btn-confirm">
                            Sim
                        </button>
                        <button onClick={onClear} className="btn-cancel">
                            Não
                        </button>
                    </div>
                ) : (
                    <button onClick={onClear} className="btn-close-success">
                        Ok!
                    </button>
                )}
            </div>
        </div>
    );
};

/*FUNÇÃO PARA EDITAR UM REGISTRO VINDO DO DTO */
const mapDtoToLicenca = async (numLic, setLoading, setMensagem) => {
    try {
        setLoading(true);
        const response = await api.get(`/api/v1/Licenca/${numLic}`);
        return response.data;
    } catch (err) {
        console.error("Erro ao carregar licença:", err);
        setMensagem({ type: "error", text: "Erro ao carregar dados da licença." });
        return null;
    } finally {
        setLoading(false);
    }
};

export default function LicencasPage() {
    const [licencas, setLicencas] = useState([]);
    const [showModal, setShowModal] = useState(false);  
    const [filtro, setFiltro] = useState("");
    const [mensagem, setMensagem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentLicencas, setCurrentLicencas] = useState(null); // Estado para o cliente a ser editado/cadastrado


    // Filtrar licenças com base no filtro de busca
    const licencasFiltradas = licencas.filter((l) =>
        [l.nomeCliente,
            l.macAddress,
            l.ip].some((c) => c?.toLowerCase().includes(filtro.toLowerCase()))
    );

    /*receber a resposta, a função chama setLicencas,
    que atualiza o estado com os dados retornados da API, 
    permitindo que os dados sejam utilizados no componente.*/
    const loadData = async () => {
        setLoading(true);
        try {
            //const response = await api.get("/api/v1/Licenca/GetAll");
            const response = await api.get("/api/v1/licencaquery/GetAllWithDetails");
            setLicencas(response.data);
        } catch (err) {
            console.error("Erro ao carregar licenças:", err);
            setMensagem({ type: "error", text: "Erro ao carregar dados." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

 /*Quando o usuário clica no botão Editar:
    LicenseTable chama onEdit(l) → envia o objeto l (cada linha da tabela);
    Em LicencasPage, o handleEditLicense recebe esse objeto e faz:*/
    const handleEditLicense = async (licenca) => {
        // 🔧 Correção: garante que o campo numLic exista
        const licencaComNumLic = licenca.numLic ?? licenca.id ?? licenca.idLicenca;

        if (!licencaComNumLic) {
            setMensagem({ type: "error", text: "Número da licença não encontrado para edição." });
            return;
        }

        // Chama a função para mapear o DTO e obter os dados completos da licença
        const dadosCompletos = await mapDtoToLicenca(licencaComNumLic, setLoading, setMensagem);
        if (dadosCompletos) {
            console.log("Editando licença:", dadosCompletos);
            setCurrentLicencas(dadosCompletos);
            setShowModal(true);
        }
    };

    const handleAddLicense = () => {
        setCurrentLicencas(null); 
        setShowModal(true);
    };

    return (
        <div>
            <FilterBar
                filtro={filtro}
                setFiltro={setFiltro}
                onAdd={handleAddLicense}
            /> 
            <LicenseTable
                licencas={licencasFiltradas}
                onEdit={handleEditLicense}
                onRefresh={loadData}
            />
            {showModal && (
                <LicenseModal
                    onClose={() => setShowModal(false)}
                    onSaved={async () => {
                        await loadData();
                        setShowModal(false);
                    }}
                    licencaData={currentLicencas}
                />
            )}
            {/* Modal de confirmação e mensagens de status */}
            {mensagem && (
                <MessageModal
                    type={mensagem.type}
                    message={mensagem.text}
                    onClear={() => setMensagem(null)}
                />
            )}
        </div>
    );
}

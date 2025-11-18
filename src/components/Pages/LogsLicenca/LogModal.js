import React from "react";
import "../LogsLicenca/Log_style.css";
export default function LicencaLogDetailModal({ onClose, logData }) {
    if (!logData) return null;

    // Renderiza o formulário do modal
    return (
        <div className="modal-overlay-Log">
            <div className="modal-Log" style={{ maxWidth: '800px'}}>
                <div className="container-Log">
                    <h2 className="form-title">Detalhes do Log ID: {logData.idLog}</h2>
                    <div className="log-details-grid">
                        <p><strong>Licença:</strong> {logData.numLic} ({logData.chave})</p>
                        <p><strong>Endpoint:</strong> {logData.endPoint}</p>
                        <p><strong>Status HTTP:</strong> {logData.responseCode}</p>
                        <p><strong>Data:</strong> {new Date(logData.createdAt).toLocaleString()}</p>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <h4>Mensagem:</h4>
                        <p style={{ whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9' }}>
                            {logData.mensagem || "N/A"}
                        </p>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <h4>Payload (Requisição):</h4>
                        {/* 🎯 Mostrar Payload em formato JSON legível, se possível */}
                        <pre style={{ overflowX: 'auto', border: '1px solid #ddd', padding: '10px', backgroundColor: '#eee' }}>
                            {logData.requestPayload ?
                                JSON.stringify(JSON.parse(logData.requestPayload), null, 2)
                                : "Payload Vazio/N/A"}
                        </pre>
                    </div>

                    <div className="modal-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Fechar
                        </button>
                    </div>
                </div>
            </div>            
        </div>
    );
}

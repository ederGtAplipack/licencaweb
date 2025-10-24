// src/services/licencaService.js
import api from "./api";

export async function getAllWithDetails() {
    const { data } = await api.get("api/v1/licencaquery/GetAllWithDetails");
    return Array.isArray(data) ? data : [];
}

export async function createLicenca(payload) {
    // payload espera clienteId (number) + macAddress, software, ip, scade (ISO) etc.
    const { data } = await api.post("/CreateNewLin", payload);
    return data;
}

export async function updateLicenca(id, payload) {
    const { data } = await api.put(`api/v1/licenca/${id}`, payload);
    return data;
}

export async function deleteLicenca(id) {
    await api.delete(`api/v1/licenca/${id}`);
}

export async function generateMultipleLicenses(payload) {
    const resp = await fetch(`http://192.168.210.78:14900/api/v1/Licenca/createMultipleLicencas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    // 1. Verifica o Content-Type para garantir que a resposta é JSON
    const contentType = resp.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    let responseBody;

    // 2. Tenta ler como JSON apenas se o header indicar
    if (isJson) {
        // Se a resposta for JSON (sucesso ou erro JSON)
        responseBody = await resp.json();
    } else {
        // Se for HTML (página de erro), lê como texto
        responseBody = await resp.text();
    }

    // 3. Verifica o status HTTP
    if (!resp.ok) {
        let errorMessage;

        if (isJson) {
            // Se for JSON, tenta pegar a mensagem de erro
            errorMessage = responseBody?.message || `Erro JSON sem mensagem: HTTP ${resp.status}`;
        } else {
            // Se for HTML, retorna o início da página HTML/Texto para debug
            errorMessage = `Erro de Servidor (Não-JSON): ${resp.status}. Conteúdo: "${String(responseBody).substring(0, 50)}..."`;
        }

        const err = new Error(errorMessage);
        err.httpStatus = resp.status;
        throw err;
    }

    return responseBody; // Retorna o JSON de sucesso
}

// Lembre-se de aplicar essa lógica também em generateMultipleViaSingleCreates!
export async function generateMultipleViaSingleCreates(payload) {
    const qty = payload.quantidade || 1;
    const created = [];
    const failed = [];

    for (let i = 0; i < qty; i++) {
        const singlePayload = {
            IdSoftware: payload.idSoftware,
            idcontrato: payload.idContrato,
            IdCliente: payload.idCliente,
            DataLic: new Date().toISOString(),
            Scade: payload.scade,
            MaxDevices: payload.maxDevices || 1,
            TipoLic: null,
            Attivo: 0
        };

        try {
            const resp = await fetch(`http://192.168.213.135:14900/api/v1/Licenca/createMultipleLicencas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(singlePayload)
            });

            // 1. VERIFICAÇÃO DE CONTENT-TYPE
            const contentType = resp.headers.get("content-type");
            const isJson = contentType && contentType.includes("application/json");

            let responseBody;

            // 2. Lê como JSON ou como texto (HTML)
            if (isJson) {
                responseBody = await resp.json();
            } else {
                // Se não for JSON, lê como texto para não quebrar no '<'
                responseBody = await resp.text();
            }

            // 3. Verifica o Status HTTP
            if (!resp.ok) {
                let reason;
                if (isJson) {
                    reason = responseBody?.message || `Erro HTTP ${resp.status} (Sem mensagem)`;
                } else {
                    // Erro de Servidor (Retornou HTML/Texto)
                    reason = `Erro de Servidor - Status: ${resp.status}. Resposta: "${String(responseBody).substring(0, 50)}..."`;
                }

                failed.push({ index: i, reason: reason });
            } else {
                // Sucesso
                created.push({ numLic: responseBody.numLic, chave: responseBody.chave, scade: responseBody.scade });
            }
        } catch (ex) {
            // Este catch pega erros de rede ou de parsing inesperado
            failed.push({ index: i, reason: ex.message });
        }
    }
    return { created, failed, remainingContrato: null };
}

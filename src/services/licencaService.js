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

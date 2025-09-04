import api from "../../services/api";

export async function fetchLicencas() {
    const {data} = await api.get("api/v1/licencaquery/getAllWithDetails");
    return data;
}

export async function createLicenca(payload) {
    const { data } = await api.post("/CreateNewLin", payload);
  return data;
}

export async function updateLicenca(id, payload) {
    const { data } = await api.put(`api/v1/licenca/${id}`, payload);
  return data;
}

export async function deleteLicenca(id) {
    const { data } = await api.delete(`api/v1/licenca/${id}`);
    return data;
}
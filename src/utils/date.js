// src/utils/date.js
export function formatDateISOToBR(dateString) {
    if (!dateString) return "";

    // Se já estiver no formato dd/mm/yyyy, retorna direto
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;

    try {
        // Se vier no formato "YYYY-MM-DDTHH:mm:ss" ou "YYYY-MM-DD"
        if (typeof dateString === "string") {
            const datePart = dateString.includes("T")
                ? dateString.substring(0, 10)
                : dateString.substring(0, 10);

            const parts = datePart.split("-");
            if (parts.length === 3) {
                const [yyyy, mm, dd] = parts;
                // evita valores inválidos
                if (yyyy.length === 4 && mm.length >= 1 && dd.length >= 1) {
                    return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
                }
            }
        }

        // Fallback: tenta criar Date e formatar com toLocaleDateString
        const dt = new Date(dateString);
        if (!isNaN(dt.getTime())) {
            return dt.toLocaleDateString("pt-BR");
        }

        // Se tudo falhar, retorna a string original (para debugging)
        return String(dateString);
    } catch (err) {
        // Em caso de erro, não quebrar a UI
        return String(dateString);
    }
}

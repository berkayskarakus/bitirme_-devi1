const apiUrl: string | undefined = import.meta.env.VITE_API_URL;

if (!apiUrl?.trim()) {
    throw new Error(
        "VITE_API_URL ayarı eksik. frontend/.env.local dosyasını kontrol edin."
    );
}

export const API_BASE_URL = apiUrl.trim().replace(/\/+$/, "");
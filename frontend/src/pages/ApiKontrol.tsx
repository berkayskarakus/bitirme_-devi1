import { useState } from 'react';
import { API_BASE_URL } from '../config/api';

export default function ApiKontrol() {
    const [sonuc, setSonuc] = useState('Henüz istek gönderilmedi.');
    const [yukleniyor, setYukleniyor] = useState(false);

    async function kontrolEt() {
        setYukleniyor(true);
        setSonuc('İstek gönderiliyor...');

        try {
            const response = await fetch(`${API_BASE_URL}/api/parcels`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/geo+json, application/json',
                },
            });

            if (response.status === 401 || response.redirected) {
                setSonuc(
                    'Giriş gerekli. Backend’e giriş yap bağlantısını kullanıp tekrar deneyin.'
                );
                return;
            }

            if (!response.ok) {
                setSonuc(`Backend HTTP ${response.status} döndürdü.`);
                return;
            }

            const data: unknown = await response.json();

            setSonuc(
                `HTTP ${response.status}\n${JSON.stringify(data, null, 2)}`
            );
        } catch {
            setSonuc(
                'Yanıt okunamadı. Backend’in çalıştığını ve frontend adresinin CORS izinlerinde bulunduğunu kontrol edin.'
            );
        } finally {
            setYukleniyor(false);
        }
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>API bağlantı kontrolü</h1>

            <p>Frontend adresi: {window.location.origin}</p>
            <p>Backend adresi: {API_BASE_URL}</p>

            <p>
                <a
                    href={`${API_BASE_URL}/login`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Backend’e giriş yap
                </a>
            </p>

            <button onClick={kontrolEt} disabled={yukleniyor}>
                {yukleniyor ? 'Kontrol ediliyor...' : 'Parselleri getir'}
            </button>

            <pre style={{ whiteSpace: 'pre-wrap' }}>{sonuc}</pre>
        </main>
    );
}
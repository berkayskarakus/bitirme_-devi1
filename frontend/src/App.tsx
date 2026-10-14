import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Arazi from './pages/Arazi';
import Anasayfa from './pages/Anasayfa';
import Belgeler from './pages/Belgeler';
import Analiz from './pages/Analiz';
// import Senaryolar from './pages/Senaryolar';

const ApiKontrol = import.meta.env.DEV
    ? lazy(() => import('./pages/ApiKontrol'))
    : null;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {ApiKontrol && (
                    <Route
                        path="/api-kontrol"
                        element={
                            <Suspense fallback={<p>Sayfa yükleniyor...</p>}>
                                <ApiKontrol />
                            </Suspense>
                        }
                    />
                )}

                <Route path="/" element={<Layout />}>
                    {/* Ana dizine girildiğinde Dashboard'a yönlendir */}
                    <Route index element={<Navigate to="/dashboard" replace />} />

                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="arazi" element={<Arazi />} />
                    <Route path="Anasayfa" element={<Anasayfa />} />
                    <Route path="Belgeler" element={<Belgeler />} />
                    <Route path="analiz" element={<Analiz />} />

                    {/*
          <Route path="dokumanlar" element={<Dokumanlar />} />
          <Route path="senaryolar" element={<Senaryolar />} />
          */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
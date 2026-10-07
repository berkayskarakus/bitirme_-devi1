import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Arazi from './pages/Arazi';
import Anasayfa from './pages/Anasayfa'
import Belgeler from './pages/Belgeler';
import Analiz from './pages/Analiz'
// import Senaryolar from './pages/Senaryolar';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Ana dizine girildiğinde Dashboard'a yönlendir */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="arazi" element={<Arazi />} />
              <Route path="Anasayfa" element={<Anasayfa />} />
              <Route path="Belgeler" element={<Belgeler />} />
              <Route path="analiz" element={<Analiz/>} />
            {/*
          <Route path="dokumanlar" element={<Dokumanlar />} />
          <Route path="senaryolar" element={<Senaryolar />} />
          */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="arazi" element={<Arazi />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
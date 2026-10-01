import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import { ComplaintsProvider } from './hooks/ComplaintsContext.jsx'
import BuatPengaduan from './pages/BuatPengaduan.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DetailPengaduan from './pages/DetailPengaduan.jsx'
import PengaduanSaya from './pages/PengaduanSaya.jsx'
import Statistik from './pages/Statistik.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ComplaintsProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="pengaduan/buat" element={<BuatPengaduan />} />
            <Route path="pengaduan" element={<PengaduanSaya />} />
            <Route path="pengaduan/:id" element={<DetailPengaduan />} />
            <Route path="statistik" element={<Statistik />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ComplaintsProvider>
    </BrowserRouter>
  )
}

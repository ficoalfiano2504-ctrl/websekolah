import { ArrowLeft, Bell, ClipboardList, Home, TrendingUp } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Toast from './Toast.jsx'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const pageTitle = pathname === '/admin/pengaduan'
    ? 'Kelola Pengaduan'
    : pathname.includes('/statistik')
      ? 'Statistik Pengaduan'
      : pathname.includes('/pengaduan/')
        ? 'Detail Pengaduan'
        : 'Dashboard Admin'

  return (
    <div className="admin-app-shell">
      <aside className="admin-sidebar">
        <NavLink className="admin-brand" to="/admin">
          <span className="admin-brand-mark"><img src="/logo_navbar.webp" alt="" /></span>
          <span><strong>SuaraSiswa</strong><small>ADMIN PORTAL</small></span>
        </NavLink>
        <span className="admin-nav-label">WORKSPACE</span>
        <nav className="admin-side-nav" aria-label="Navigasi admin">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}><Home size={17} />Dashboard</NavLink>
          <NavLink to="/admin/pengaduan" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}><ClipboardList size={17} />Pengaduan</NavLink>
          <NavLink to="/admin/statistik" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}><TrendingUp size={17} />Statistik</NavLink>
        </nav>
        <NavLink className="admin-return" to="/"><ArrowLeft size={16} />Kembali ke aplikasi siswa</NavLink>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title"><span>RUANG PENGELOLA</span><strong>{pageTitle}</strong></div>
          <div className="admin-user-area">
            <button className="admin-notification" aria-label="Notifikasi"><Bell size={17} /><i /></button>
            <span className="admin-user-avatar">AD</span>
            <span className="admin-user-copy"><strong>Admin Sekolah</strong><small>Pengelola</small></span>
          </div>
        </header>
        <main className="admin-content"><Outlet /></main>
      </div>
      <Toast />
    </div>
  )
}

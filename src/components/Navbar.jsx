import {
  Bell,
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  TrendingUp,
} from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'

const navItems = [
  { label: 'Dashboard', to: '/', icon: Home },
  { label: 'Buat Pengaduan', to: '/pengaduan/buat', icon: FileText },
  { label: 'Pengaduan Saya', to: '/pengaduan', icon: ClipboardList },
  { label: 'Statistik', to: '/statistik', icon: TrendingUp },
]

function isComplaintsActive(pathname) {
  return pathname === '/pengaduan' || (pathname.startsWith('/pengaduan/') && pathname !== '/pengaduan/buat')
}

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { setStatusFilter } = useComplaints()

  function handleNavigate(label) {
    if (label === 'Pengaduan Saya') setStatusFilter('Semua')
  }

  function renderNavItem({ label, to, icon: Icon }) {
    const active = label === 'Pengaduan Saya' ? isComplaintsActive(pathname) : pathname === to
    return (
      <button
        key={label}
        className={`nav-item ${active ? 'active' : ''}`}
        onClick={() => { handleNavigate(label); navigate(to) }}
      >
        <Icon size={15} />{label}
      </button>
    )
  }

  return (
    <>
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand-mark"><img src="/logo_navbar.webp" alt="SuaraSiswa" /></span>
          <span className="brand-copy"><strong>SuaraSiswa</strong><small>Sistem Pengaduan Siswa</small></span>
        </NavLink>
        <nav className="main-nav" aria-label="Navigasi utama">
          {navItems.map(renderNavItem)}
        </nav>
        <div className="account-area">
          <button className="icon-button notification-button" aria-label="Notifikasi"><Bell size={17} /><i /></button>
          <button className="profile-button"><span className="avatar">FP</span><span className="profile-name"><b>Fira Putri</b><small>XII IPA 1</small></span><ChevronDown size={14} /></button>
        </div>
      </header>

      <nav className="mobile-nav" aria-label="Navigasi mobile">
        {navItems.filter((item) => item.label !== 'Statistik').map(({ label, to, icon: Icon }) => (
          <button
            key={label}
            className={(label === 'Pengaduan Saya' ? isComplaintsActive(pathname) : pathname === to) ? 'active' : ''}
            onClick={() => { handleNavigate(label); navigate(to) }}
          >
            <Icon size={18} /><span>{label === 'Buat Pengaduan' ? 'Buat' : label === 'Pengaduan Saya' ? 'Pengaduan' : 'Beranda'}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
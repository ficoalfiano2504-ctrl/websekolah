import {
  ArrowRight,
  CheckCheck,
  Clock3,
  FileText,
  Lightbulb,
  Megaphone,
  Plus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon.jsx'
import StatusPill from '../components/StatusPill.jsx'
import SummaryItem from '../components/SummaryItem.jsx'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'
import { formatDate } from '../utils/formatDate.js'

export default function Dashboard() {
  const { complaints, loading, setStatusFilter } = useComplaints()
  const navigate = useNavigate()
  const myComplaints = complaints
    .filter((item) => item.studentName === 'Fira Putri')
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
  const recent = myComplaints.slice(0, 4)
  const total = myComplaints.length
  const inProgress = myComplaints.filter((item) => item.status === 'Diproses').length
  const completed = myComplaints.filter((item) => item.status === 'Selesai').length

  function openComplaint(id) {
    const complaint = myComplaints.find((item) => item.id === id)
    if (complaint) navigate(`/pengaduan/${id}`, { state: { complaint } })
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-backdrop" aria-hidden="true"><img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2400&q=90" alt="" /></div>
      <section className="welcome-row dashboard-welcome">
        <div><span className="eyebrow">DASHBOARD SISWA <span className="eyebrow-dot" /> XII IPA 1</span><h1>Hai, Fira Putri <span className="wave">👋</span></h1><p>Semangat terus! Suaramu penting untuk sekolah kita.</p></div>
        <button className="primary-button dashboard-cta" onClick={() => navigate('/pengaduan/buat')}><Plus size={16} /> Buat Pengaduan</button>
      </section>

      <section className="summary-card dashboard-summary">
        <SummaryItem color="blue" icon={<FileText size={17} />} label="Pengaduan Saya" value={total} />
        <SummaryItem color="orange" icon={<Clock3 size={17} />} label="Sedang Diproses" value={inProgress} />
        <SummaryItem color="green" icon={<CheckCheck size={17} />} label="Sudah Selesai" value={completed} />
      </section>

      <section className="dashboard-grid">
        <div className="panel recent-panel">
          <div className="panel-heading"><div><h2>Pengaduan Terbaru</h2><p>Pantau perkembangan laporanmu</p></div><button className="text-link" onClick={() => { setStatusFilter('Semua'); navigate('/pengaduan') }}>Lihat semua <ArrowRight size={14} /></button></div>
          <div className="recent-list">{loading ? <div className="empty-inline">Memuat pengaduan...</div> : recent.length ? recent.map((item) => <button className="recent-item" key={item.id} onClick={() => openComplaint(item.id)}><CategoryIcon category={item.category} small /><span className="recent-copy"><b>{item.title}</b><small>{item.category} · {formatDate(item.createdAt)}</small></span><StatusPill status={item.status} /></button>) : <div className="empty-inline">Belum ada pengaduan. Sampaikan masalah yang ingin ditindaklanjuti.</div>}</div>
        </div>

        <aside className="dashboard-aside">
          <div className="campus-banner"><div className="banner-content"><span className="dashboard-promo-icon"><Megaphone size={21} /></span><span className="banner-kicker">Ruang kita, tanggung jawab kita</span><h2>Suaramu, perubahan untuk kita.</h2><p>Temukan masalah di sekolah? Sampaikan pengaduanmu agar dapat ditindaklanjuti.</p><button onClick={() => navigate('/pengaduan/buat')}>Buat Pengaduan <ArrowRight size={14} /></button></div></div>
          <div className="aside-note dashboard-tip"><span className="note-mark"><Lightbulb size={18} /></span><p>TAHUKAH KAMU?</p><b>Kamu dapat melihat perkembangan setiap pengaduan melalui menu Pengaduan Saya.</b></div>
        </aside>
      </section>
      <footer className="page-footer"><span>© 2025 SuaraSiswa</span><span>Dibuat untuk sekolah yang lebih baik <span className="footer-heart">♥</span></span></footer>
    </div>
  )
}
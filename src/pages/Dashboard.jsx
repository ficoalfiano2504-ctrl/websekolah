import {
  ArrowRight,
  CheckCheck,
  Clock3,
  FileText,
  MessageCircle,
  MoreHorizontal,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon.jsx'
import StatusPill from '../components/StatusPill.jsx'
import SummaryItem from '../components/SummaryItem.jsx'
import { categories } from '../constants/categories.js'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'
import { formatDate } from '../utils/formatDate.js'

export default function Dashboard() {
  const { complaints, loading, totals, setStatusFilter } = useComplaints()
  const navigate = useNavigate()

  const categoryCounts = categories.map((category) => ({
    ...category,
    count: complaints.filter((item) => item.category === category.name).length,
  }))
  const recent = complaints.slice(0, 4)
  const chartStops = categoryCounts.map((item, index) => {
    const start = categoryCounts.slice(0, index).reduce((sum, previous) => sum + previous.count, 0) / Math.max(totals.all, 1) * 100
    const end = (start * Math.max(totals.all, 1) + item.count) / Math.max(totals.all, 1) * 100
    return `${['#4385f5', '#9574e8', '#37b98b', '#ffb541', '#ec6780'][index]} ${start}% ${end}%`
  }).join(', ')

  function openComplaint(id) {
    const complaint = complaints.find((item) => item.id === id)
    if (complaint) navigate(`/pengaduan/${id}`, { state: { complaint } })
  }

  return (
    <>
      <section className="welcome-row">
        <div><span className="eyebrow">Kamis, 12 September 2025 <span className="eyebrow-dot" /> Tahun ajaran 2025/26</span><h1>Halo, Fira Putri <span className="wave">✋</span></h1><p>Semangat terus! Suaramu penting untuk sekolah kita.</p></div>
        <button className="text-link welcome-link" onClick={() => navigate('/pengaduan/buat')}><span className="plus-icon">+</span> Sampaikan aspirasi <ArrowRight size={15} /></button>
      </section>

      <section className="hero-grid">
        <div className="summary-card">
          <SummaryItem color="blue" icon={<FileText size={17} />} label="Total Pengaduan" value={totals.all} trend="20% dari bulan lalu" />
          <SummaryItem color="orange" icon={<Clock3 size={17} />} label="Diproses" value={totals.progress} trend="33% minggu ini" />
          <SummaryItem color="green" icon={<CheckCheck size={17} />} label="Selesai" value={totals.done} trend="14% minggu ini" />
        </div>
        <div className="welcome-art">
          <div className="art-copy"><span>Suaramu,</span><b>perubahan<br />untuk kita.</b><button onClick={() => navigate('/pengaduan/buat')}>Laporkan sekarang <ArrowRight size={14} /></button></div>
          <div className="art-scene"><div className="sun-shape" /><div className="speech-bubble"><MessageCircle size={19} fill="currentColor" /></div><div className="student-illustration"><span className="hair" /><span className="face" /><span className="neck" /><span className="body" /><span className="book" /></div><div className="chat-lines"><i /><i /><i /></div></div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel category-panel">
          <div className="panel-heading"><div><h2>Kategori Pengaduan</h2><p>Distribusi laporan yang kamu kirim</p></div><button className="more-button" aria-label="Pilihan lainnya"><MoreHorizontal size={19} /></button></div>
          <div className="category-chart-row">
            <div className="donut-chart" style={{ '--chart': chartStops }}><span><b>{totals.all}</b><small>Total</small></span></div>
            <div className="legend-list">{categoryCounts.map((item, index) => <div className="legend-row" key={item.name}><i className={`legend-dot dot-${index}`} /><span>{item.name}</span><b>{totals.all ? Math.round(item.count / totals.all * 100) : 0}%</b></div>)}</div>
          </div>
        </div>

        <div className="panel recent-panel">
          <div className="panel-heading"><div><h2>Pengaduan Terbaru</h2><p>Perkembangan laporanmu</p></div><button className="text-link" onClick={() => { setStatusFilter('Semua'); navigate('/pengaduan') }}>Lihat semua <ArrowRight size={14} /></button></div>
          <div className="recent-list">{loading ? <div className="empty-inline">Memuat pengaduan...</div> : recent.map((item) => <button className="recent-item" key={item.id} onClick={() => openComplaint(item.id)}><CategoryIcon category={item.category} small /><span className="recent-copy"><b>{item.title}</b><small>{item.category} · {formatDate(item.createdAt)}</small></span><StatusPill status={item.status} /></button>)}</div>
        </div>

        <div className="campus-banner"><img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=850&q=85" alt="Gedung sekolah" /><div className="banner-overlay" /><div className="banner-content"><span className="banner-kicker">Ruang kita, tanggung jawab kita</span><h2>Bersama kita<br />wujudkan sekolah<br />yang lebih baik.</h2><button onClick={() => navigate('/pengaduan/buat')}>Buat Pengaduan <ArrowRight size={14} /></button></div><span className="banner-stamp"><Users size={17} /> Suara kita<br />berarti</span></div>
      </section>
      <footer className="page-footer"><span>© 2025 SuaraSiswa</span><span>Dibuat untuk sekolah yang lebih baik <span className="footer-heart">♥</span></span></footer>
    </>
  )
}
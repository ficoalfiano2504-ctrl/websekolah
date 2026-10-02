import { ArrowRight, CheckCheck, ClipboardList, Clock3, Download, FileText, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon.jsx'
import StatusPill from '../components/StatusPill.jsx'
import SummaryItem from '../components/SummaryItem.jsx'
import { categories } from '../constants/categories.js'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'
import { formatDate } from '../utils/formatDate.js'

export default function AdminDashboard() {
  const { complaints, loading } = useComplaints()
  const navigate = useNavigate()
  const submitted = complaints.filter((item) => item.status === 'Diajukan').length
  const inProgress = complaints.filter((item) => item.status === 'Diproses').length
  const completed = complaints.filter((item) => item.status === 'Selesai').length
  const latestComplaints = [...complaints]
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
    .slice(0, 6)
  const categoryCounts = categories.map((category) => ({
    ...category,
    count: complaints.filter((item) => item.category === category.name).length,
  }))
  const maxCategoryCount = Math.max(...categoryCounts.map((item) => item.count), 1)

  function openComplaint(complaint) {
    navigate(`/admin/pengaduan/${complaint.id}`, { state: { complaint } })
  }

  return (
    <div className="admin-page">
      <section className="page-heading admin-heading">
        <div>
          <span className="eyebrow">RUANG PENGELOLA</span>
          <h1>Dashboard Admin</h1>
          <p>Pantau laporan masuk dan tindak lanjut dari seluruh sekolah.</p>
        </div>
        <div className="admin-heading-actions">
          <button className="secondary-button" onClick={() => navigate('/admin/pengaduan')}><ClipboardList size={15} /> Kelola Pengaduan</button>
          <button className="secondary-button" onClick={() => window.print()}><Download size={15} /> Ekspor PDF</button>
        </div>
      </section>

      <section className="admin-kpis" aria-label="Ringkasan pengaduan sekolah">
        <div className="panel admin-kpi"><SummaryItem color="blue" icon={<FileText size={17} />} label="Total Pengaduan" value={complaints.length} trend="Seluruh laporan" /></div>
        <div className="panel admin-kpi"><SummaryItem color="orange" icon={<Clock3 size={17} />} label="Belum Ditinjau" value={submitted} trend="Menunggu pemeriksaan" /></div>
        <div className="panel admin-kpi"><SummaryItem color="orange" icon={<TrendingUp size={17} />} label="Sedang Diproses" value={inProgress} trend="Dalam tindak lanjut" /></div>
        <div className="panel admin-kpi"><SummaryItem color="green" icon={<CheckCheck size={17} />} label="Sudah Selesai" value={completed} trend="Telah ditangani" /></div>
      </section>

      <section className="admin-workspace">
        <div className="panel admin-reports">
          <div className="panel-heading">
            <div><h2>Antrean Pengaduan</h2><p>Laporan terbaru dari seluruh siswa</p></div>
            <span className="admin-count">{complaints.length} laporan</span>
          </div>
          <div className="admin-report-list">
            {loading ? <div className="empty-inline">Memuat pengaduan...</div> : latestComplaints.length ? latestComplaints.map((item) => (
              <button className="admin-report-row" key={item.id} onClick={() => openComplaint(item)}>
                <CategoryIcon category={item.category} small />
                <span className="admin-report-main"><b>{item.title}</b><small>{item.studentName} · {item.studentClass}</small></span>
                <span className="admin-report-category"><span>{item.category}</span><small>{formatDate(item.createdAt)}</small></span>
                <StatusPill status={item.status} />
                <ArrowRight className="admin-report-arrow" size={15} />
              </button>
            )) : <div className="empty-inline">Belum ada pengaduan masuk.</div>}
          </div>
        </div>

        <aside className="panel admin-categories">
          <div className="panel-heading"><div><h2>Pengaduan per Kategori</h2><p>Distribusi seluruh laporan</p></div></div>
          <div className="admin-category-list">
            {categoryCounts.map((item, index) => (
              <div className="admin-category-row" key={item.name}>
                <div className="admin-category-heading"><CategoryIcon category={item.name} small /><span>{item.name}</span><b>{item.count}</b></div>
                <div className="admin-category-track"><span className={`fill-${index}`} style={{ width: `${item.count / maxCategoryCount * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <button className="text-link admin-analysis-link" onClick={() => navigate('/admin/statistik')}>Buka analisis lengkap <ArrowRight size={14} /></button>
        </aside>
      </section>
    </div>
  )
}

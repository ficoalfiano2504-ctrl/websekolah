import { useMemo } from 'react'
import { ArrowRight, FileText, Filter, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'
import { formatDate } from '../utils/formatDate.js'

const filters = ['Semua', 'Diajukan', 'Diproses', 'Selesai']

export default function PengaduanSaya() {
  const { complaints, loading, statusFilter, setStatusFilter, query, setQuery } = useComplaints()
  const navigate = useNavigate()
  const visibleComplaints = useMemo(() => complaints.filter((item) => {
    const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter
    const matchesQuery = `${item.title} ${item.category} ${item.id}`.toLowerCase().includes(query.toLowerCase())
    return matchesStatus && matchesQuery
  }), [complaints, query, statusFilter])

  return (
    <div className="list-page">
      <div className="page-heading list-heading"><div><span className="eyebrow">PUSAT LAPORAN</span><h1>Pengaduan Saya</h1><p>Lihat dan pantau status pengaduan yang telah kamu kirim.</p></div><button className="primary-button" onClick={() => navigate('/pengaduan/buat')}><FileText size={15} /> Buat Pengaduan</button></div>
      <div className="list-toolbar"><div className="filter-tabs">{filters.map((label) => <button key={label} className={statusFilter === label ? 'active' : ''} onClick={() => setStatusFilter(label)}>{label}</button>)}</div><div className="list-actions"><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul pengaduan..." /><kbd>⌘ K</kbd></label><button className="filter-button" onClick={() => setStatusFilter('Semua')}><Filter size={15} /> Filter</button></div></div>
      <div className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>No.</th><th>Judul Pengaduan</th><th>Kategori</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="empty-cell">Memuat pengaduan...</td></tr> : visibleComplaints.length === 0 ? <tr><td colSpan="6" className="empty-cell">Belum ada pengaduan yang cocok dengan pencarian ini.</td></tr> : visibleComplaints.map((item, index) => <tr key={item.id}><td>{String(index + 1).padStart(2, '0')}</td><td><span className="table-title"><CategoryIcon category={item.category} small /><b>{item.title}</b></span></td><td>{item.category}</td><td>{formatDate(item.createdAt)}</td><td><StatusPill status={item.status} /></td><td><button className="outline-small" onClick={() => navigate(`/pengaduan/${item.id}`, { state: { complaint: item } })}>Lihat <ArrowRight size={13} /></button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Menampilkan {visibleComplaints.length ? 1 : 0}–{visibleComplaints.length} pengaduan</span><div className="pagination"><button aria-label="Sebelumnya" disabled>‹</button><button className="current">1</button><button aria-label="Berikutnya" disabled>›</button></div></div></div>
    </div>
  )
}
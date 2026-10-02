import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'
import { formatDate } from '../utils/formatDate.js'

const statusOptions = ['Diajukan', 'Diproses', 'Selesai']
const statusFilters = ['Semua', ...statusOptions]

export default function AdminComplaints() {
  const { complaints, loading, updateComplaintStatus } = useComplaints()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [query, setQuery] = useState('')
  const [updatingId, setUpdatingId] = useState('')
  const [error, setError] = useState('')

  const visibleComplaints = useMemo(() => [...complaints]
    .filter((item) => statusFilter === 'Semua' || item.status === statusFilter)
    .filter((item) => `${item.title} ${item.studentName} ${item.category} ${item.id}`.toLowerCase().includes(query.toLowerCase()))
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)), [complaints, query, statusFilter])

  async function changeStatus(id, status) {
    setUpdatingId(id)
    setError('')
    try {
      await updateComplaintStatus(id, status)
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <div className="admin-page admin-complaints-page">
      <section className="page-heading admin-heading">
        <div>
          <span className="eyebrow">RUANG PENGELOLA</span>
          <h1>Kelola Pengaduan</h1>
          <p>Tinjau laporan dan perbarui status tindak lanjutnya.</p>
        </div>
        <button className="secondary-button admin-export-button" onClick={() => window.print()}><Download size={15} /> Ekspor PDF</button>
      </section>

      <div className="admin-manage-toolbar">
        <div className="filter-tabs" aria-label="Filter status pengaduan">
          {statusFilters.map((status) => <button key={status} className={statusFilter === status ? 'active' : ''} onClick={() => setStatusFilter(status)}>{status}</button>)}
        </div>
        <label className="admin-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari laporan atau siswa..." /></label>
      </div>

      {error && <div className="form-error admin-status-error" role="alert">{error}</div>}
      <section className="panel admin-management-panel" aria-label="Daftar pengaduan sekolah">
        <div className="admin-table-head"><span>Pengaduan</span><span>Pelapor</span><span>Kategori & tanggal</span><span>Status tindak lanjut</span></div>
        <div className="admin-management-list">
          {loading ? <div className="empty-inline">Memuat pengaduan...</div> : visibleComplaints.length ? visibleComplaints.map((item) => (
            <div className="admin-management-row" key={item.id}>
              <div className="admin-complaint-cell"><CategoryIcon category={item.category} small /><span><button className="admin-complaint-title" onClick={() => navigate(`/admin/pengaduan/${item.id}`, { state: { complaint: item } })}>{item.title}</button><small>#{item.id}</small></span></div>
              <div className="admin-reporter-cell"><b>{item.studentName}</b><small>{item.studentClass}</small></div>
              <div className="admin-category-cell"><span>{item.category}</span><small>{formatDate(item.createdAt)}</small></div>
              <div className="admin-status-cell"><StatusPill status={item.status} /><select className="admin-status-select" aria-label={`Ubah status ${item.title}`} value={item.status} disabled={updatingId === item.id} onChange={(event) => changeStatus(item.id, event.target.value)}>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
            </div>
          )) : <div className="empty-inline admin-no-results">Tidak ada laporan yang cocok dengan filter ini.</div>}
        </div>
        <footer className="admin-management-footer">Menampilkan {visibleComplaints.length} dari {complaints.length} pengaduan</footer>
      </section>
    </div>
  )
}

import { CheckCheck, Clock3, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon.jsx'
import SummaryItem from '../components/SummaryItem.jsx'
import { categories } from '../constants/categories.js'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'

export default function Statistik() {
  const { complaints, totals } = useComplaints()
  const navigate = useNavigate()
  const categoriesWithTotals = categories.map((item) => ({
    ...item,
    count: complaints.filter((complaint) => complaint.category === item.name).length,
  }))
  const max = Math.max(...categoriesWithTotals.map((item) => item.count), 1)

  return <div className="stats-page"><div className="page-heading list-heading"><div><span className="eyebrow">RINGKASAN DATA</span><h1>Statistik Pengaduan</h1><p>Gambaran pengaduan yang telah disampaikan ke sekolah.</p></div><button className="primary-button" onClick={() => navigate('/pengaduan/buat')}><FileText size={15} /> Buat Pengaduan</button></div><div className="stats-cards"><SummaryItem color="blue" icon={<FileText size={17} />} label="Total Pengaduan" value={totals.all} trend="Semua laporan" /><SummaryItem color="orange" icon={<Clock3 size={17} />} label="Sedang Diproses" value={totals.progress} trend="Menunggu tindak lanjut" /><SummaryItem color="green" icon={<CheckCheck size={17} />} label="Selesai" value={totals.done} trend="Sudah ditangani" /></div><div className="panel stats-breakdown"><div className="panel-heading"><div><h2>Pengaduan per Kategori</h2><p>Jumlah laporan pada setiap kategori</p></div><span className="stats-tag">Semua waktu</span></div><div className="bar-list">{categoriesWithTotals.map((item, index) => <div className="bar-row" key={item.name}><div className="bar-label"><CategoryIcon category={item.name} small /><span>{item.name}</span><b>{item.count}</b></div><div className="bar-track"><i className={`bar-fill fill-${index}`} style={{ width: `${item.count / max * 100}%` }} /></div></div>)}</div></div></div>
}
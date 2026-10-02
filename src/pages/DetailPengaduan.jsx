import { useEffect, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MessageCircle,
  Send,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'
import { getComplaint } from '../services/api.js'
import { formatDate } from '../utils/formatDate.js'

export default function DetailPengaduan() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isAdminView = location.pathname.startsWith('/admin/')
  const initialComplaint = location.state?.complaint?.id === id ? location.state.complaint : null
  const [complaint, setComplaint] = useState(initialComplaint)
  const [loading, setLoading] = useState(!initialComplaint)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const { submitMessage, setStatusFilter } = useComplaints()

  useEffect(() => {
    let active = true
    const routeComplaint = location.state?.complaint?.id === id ? location.state.complaint : null
    setComplaint(routeComplaint)
    setLoading(!routeComplaint)
    setError('')

    getComplaint(id)
      .then((result) => { if (active) setComplaint(result) })
      .catch((loadError) => { if (active) setError(loadError.message) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [id, location.state])

  async function submit(event) {
    event.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError('')
    try {
      const result = await submitMessage(id, message)
      setComplaint(result)
      setMessage('')
    } catch (sendError) {
      setError(sendError.message)
    } finally {
      setSending(false)
    }
  }

  function goBack() {
    setStatusFilter('Semua')
    navigate(isAdminView ? '/admin' : '/pengaduan')
  }

  if (!complaint) {
    return <div className="detail-page">{loading ? 'Memuat pengaduan...' : error}</div>
  }

  const timeline = complaint.updates ?? []

  return (
    <div className="detail-page">
      <div className="page-heading"><button className="back-button" onClick={goBack} aria-label="Kembali"><ArrowLeft size={17} /></button><div><span className="eyebrow">{isAdminView ? 'ANTREAN ADMIN' : 'PENGADUAN SAYA'} / {complaint.id}</span><h1>Detail Pengaduan</h1><p>{isAdminView ? 'Tinjau detail dan riwayat tindak lanjut pengaduan.' : 'Pantau perkembangan dan tanggapan untuk laporanmu.'}</p></div></div>
      <div className="detail-layout">
        <div className="detail-main">
          <section className="panel detail-summary"><div className="detail-title-row"><CategoryIcon category={complaint.category} /><div><span className="detail-id">#{complaint.id}</span><h2>{complaint.title}</h2><span className="detail-category">{complaint.category} <i /> {formatDate(complaint.createdAt)}</span></div><StatusPill status={complaint.status} /></div><div className="detail-divider" /><span className="field-label">Isi Pengaduan</span><p className="detail-description">{complaint.description}</p><div className="detail-meta"><span><UserRound size={14} /> {complaint.studentName} · {complaint.studentClass}</span><span><ArrowDownLeft size={14} /> {complaint.location}</span></div>{complaint.photo && <div className="proof-photo"><span className="field-label">Foto Bukti</span><img src={complaint.photo} alt="Foto bukti pengaduan" /></div>}</section>
          <section className="panel timeline-panel"><div className="panel-heading"><div><h2>Riwayat Tanggapan</h2><p>Update terbaru dari tim sekolah</p></div><span className="history-icon"><Clock3 size={16} /></span></div><div className="timeline">{timeline.map((update, index) => <div className={`timeline-item ${index === 0 ? 'latest' : ''}`} key={`${update.title}-${update.at}`}><span className="timeline-dot">{index === 0 && <Check size={11} />}</span><div><b>{update.title}</b><p>{update.detail}</p><small>{formatDate(update.at)} · {new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(update.at))}</small></div></div>)}{(complaint.messages ?? []).map((item, index) => <div className="timeline-item" key={`${item.at}-${index}`}><span className="timeline-dot" /><div><b>Pesan dari {item.sender}</b><p>{item.text}</p><small>{formatDate(item.at)}</small></div></div>)}</div><form className="reply-box" onSubmit={submit}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tulis pesan atau pertanyaan..." aria-label="Tulis pesan" /><button type="submit" disabled={sending || !message.trim()} aria-label="Kirim pesan"><Send size={16} /></button></form>{error && <div className="form-error">{error}</div>}</section>
        </div>
        <aside className="detail-aside"><div className="panel detail-help"><span className="help-graphic"><MessageCircle size={22} /></span><h3>Butuh bantuan?</h3><p>Admin sekolah siap membantu menjawab pertanyaan seputar pengaduanmu.</p><button onClick={() => document.querySelector('.reply-box input')?.focus()}>Hubungi admin <ArrowRight size={14} /></button></div><div className="privacy-note"><ShieldCheck size={16} /><span>Identitas dan isi pengaduanmu dijaga kerahasiaannya.</span></div></aside>
      </div>
    </div>
  )
}
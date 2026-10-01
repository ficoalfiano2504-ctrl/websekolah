import { useRef, useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  CloudUpload,
  ImagePlus,
  Megaphone,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon.jsx'
import { categories } from '../constants/categories.js'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'

export default function BuatPengaduan() {
  const [form, setForm] = useState({ title: '', category: '', description: '', location: '' })
  const [photo, setPhoto] = useState('')
  const [fileName, setFileName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { submitComplaint } = useComplaints()

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Pilih file gambar seperti JPG, PNG, atau WEBP.')
    if (file.size > 3 * 1024 * 1024) return setError('Ukuran foto maksimal 3 MB.')
    const reader = new FileReader()
    reader.onload = () => { setPhoto(String(reader.result)); setFileName(file.name); setError('') }
    reader.readAsDataURL(file)
  }

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const complaint = await submitComplaint({ ...form, photo, studentName: 'Fira Putri', studentClass: 'XII IPA 1' })
      navigate(`/pengaduan/${complaint.id}`, { state: { complaint } })
    } catch (submitError) {
      setError(submitError.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <div className="page-heading"><button className="back-button" onClick={() => navigate('/')} aria-label="Kembali"><ArrowLeft size={17} /></button><div><span className="eyebrow">RUANG ASPIRASI</span><h1>Buat Pengaduan</h1><p>Sampaikan keluhanmu dengan jelas dan sopan. Kami akan menindaklanjutinya secepatnya.</p></div></div>
      <div className="form-layout">
        <form className="panel complaint-form" onSubmit={submit}>
          <label className="field-label" htmlFor="title">Judul Pengaduan <em>*</em></label>
          <input id="title" value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Contoh: Fasilitas toilet rusak" required maxLength={90} />
          <label className="field-label" htmlFor="category">Kategori <em>*</em></label>
          <div className="select-wrap"><select id="category" value={form.category} onChange={(event) => update('category', event.target.value)} required><option value="" disabled>Pilih kategori</option>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select><ChevronDown size={15} /></div>
          <label className="field-label" htmlFor="location">Lokasi <span>(opsional)</span></label>
          <input id="location" value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Contoh: Ruang kelas XII IPA 1" maxLength={100} />
          <label className="field-label" htmlFor="description">Isi Pengaduan <em>*</em></label>
          <textarea id="description" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Jelaskan pengaduan kamu secara detail agar kami bisa membantu..." required rows={5} maxLength={1000} />
          <div className="character-count">{form.description.length}/1000</div>
          <label className="field-label upload-label">Upload Foto <span>(opsional)</span></label>
          <input className="visually-hidden" ref={inputRef} type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
          <button type="button" className={`upload-zone ${photo ? 'has-photo' : ''}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleFile(event.dataTransfer.files?.[0]) }}>
            {photo ? <><img src={photo} alt="Pratinjau foto" /><span className="upload-text"><b>{fileName}</b><small>Klik untuk mengganti foto</small></span><span className="replace-photo"><ImagePlus size={16} /></span></> : <><CloudUpload size={25} /><b>Klik untuk mengunggah foto</b><small>atau drag &amp; drop di sini</small></>}
          </button>
          <div className="upload-hint">Format: JPG, PNG, WEBP · Maks. 3 MB</div>
          {error && <div className="form-error"><ShieldCheck size={15} />{error}</div>}
          <div className="form-bottom"><span><ShieldCheck size={15} /> Identitasmu hanya dapat dilihat oleh admin.</span><button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Mengirim...' : <><Send size={15} /> Kirim Pengaduan</>}</button></div>
        </form>
        <aside className="form-aside">
          <div className="panel category-aside"><h2>Kategori Pengaduan</h2><div className="aside-categories">{categories.map((category) => <div className="aside-category" key={category.name}><CategoryIcon category={category.name} /><span><b>{category.name}</b><small>{category.description}</small></span></div>)}</div></div>
          <div className="aside-note"><span className="note-mark"><Megaphone size={23} /></span><p>Setiap suara punya arti.</p><b>Bersama membangun<br />sekolah kita.</b></div>
        </aside>
      </div>
    </div>
  )
}
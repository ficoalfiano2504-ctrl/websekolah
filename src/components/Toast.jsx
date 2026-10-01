import { Check, X } from 'lucide-react'
import { useComplaints } from '../hooks/ComplaintsContext.jsx'

export default function Toast() {
  const { toast, setToast } = useComplaints()
  if (!toast) return null

  return <div className="toast"><Check size={17} />{toast}<button onClick={() => setToast('')} aria-label="Tutup"><X size={15} /></button></div>
}
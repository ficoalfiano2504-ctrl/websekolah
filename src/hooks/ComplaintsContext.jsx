import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createComplaint as createComplaintRequest,
  getComplaints,
  sendComplaintMessage,
  updateComplaintStatus as updateComplaintStatusRequest,
} from '../services/api.js'

const ComplaintsContext = createContext(null)

export function ComplaintsProvider({ children }) {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [query, setQuery] = useState('')
  const totals = useMemo(() => ({
    all: complaints.length,
    progress: complaints.filter((item) => item.status === 'Diproses' || item.status === 'Diajukan').length,
    done: complaints.filter((item) => item.status === 'Selesai').length,
  }), [complaints])

  async function refreshComplaints() {
    const result = await getComplaints()
    setComplaints(result)
    return result
  }

  useEffect(() => {
    refreshComplaints()
      .catch((error) => setToast(error.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  async function submitComplaint(formData) {
    const result = await createComplaintRequest(formData)
    await refreshComplaints()
    setToast('Pengaduan berhasil dikirim. Terima kasih sudah bersuara!')
    return result
  }

  async function submitMessage(id, text) {
    const result = await sendComplaintMessage(id, text)
    setComplaints((current) => current.map((item) => item.id === result.id ? result : item))
    return result
  }

  async function updateComplaintStatus(id, status) {
    const result = await updateComplaintStatusRequest(id, status)
    setComplaints((current) => current.map((item) => item.id === result.id ? result : item))
    setToast(`Status pengaduan diperbarui menjadi ${result.status}.`)
    return result
  }

  const value = {
    complaints,
    loading,
    totals,
    toast,
    setToast,
    statusFilter,
    setStatusFilter,
    query,
    setQuery,
    refreshComplaints,
    submitComplaint,
    submitMessage,
    updateComplaintStatus,
  }

  return <ComplaintsContext.Provider value={value}>{children}</ComplaintsContext.Provider>
}

export function useComplaints() {
  const context = useContext(ComplaintsContext)
  if (!context) throw new Error('useComplaints harus digunakan di dalam ComplaintsProvider.')
  return context
}
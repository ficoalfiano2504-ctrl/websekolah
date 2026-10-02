async function request(url, options, fallbackMessage) {
  const response = await fetch(url, options)
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || fallbackMessage)
  return result
}

export function getComplaints() {
  return request('/api/complaints', undefined, 'Data pengaduan tidak dapat dimuat.')
}

export function getComplaint(id) {
  return request(`/api/complaints/${id}`, undefined, 'Pengaduan tidak ditemukan.')
}

export function updateComplaintStatus(id, status) {
  return request(`/api/complaints/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }, 'Status pengaduan gagal diperbarui.')
}

export function createComplaint(formData) {
  return request('/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  }, 'Pengaduan gagal dikirim.')
}

export function sendComplaintMessage(id, text) {
  return request(`/api/complaints/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }, 'Pesan gagal dikirim.')
}
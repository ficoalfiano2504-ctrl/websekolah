import express from 'express'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT) || 3001
const root = path.dirname(fileURLToPath(import.meta.url))
const dataPath = path.join(root, 'data', 'complaints.json')

app.use(express.json({ limit: '6mb' }))

async function readComplaints() {
  return JSON.parse(await readFile(dataPath, 'utf8'))
}

async function saveComplaints(complaints) {
  await writeFile(dataPath, `${JSON.stringify(complaints, null, 2)}\n`)
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'SuaraSiswa API' })
})

app.get('/api/complaints', async (_request, response) => {
  response.json(await readComplaints())
})

app.get('/api/complaints/:id', async (request, response) => {
  const complaints = await readComplaints()
  const complaint = complaints.find((item) => item.id === request.params.id)
  if (!complaint) return response.status(404).json({ message: 'Pengaduan tidak ditemukan.' })
  response.json(complaint)
})

app.post('/api/complaints', async (request, response) => {
  const { title, category, description, location, studentName, studentClass, photo } = request.body
  if (![title, category, description].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ message: 'Judul, kategori, dan isi pengaduan wajib diisi.' })
  }

  const complaints = await readComplaints()
  const complaint = {
    id: `SS-${String(Date.now()).slice(-6)}`,
    title: title.trim(),
    category,
    description: description.trim(),
    location: location?.trim() || 'Belum ditentukan',
    studentName: studentName?.trim() || 'Fira Putri',
    studentClass: studentClass?.trim() || 'XII IPA 1',
    photo: typeof photo === 'string' && photo.startsWith('data:image/') ? photo : '',
    status: 'Diproses',
    createdAt: new Date().toISOString(),
    updates: [
      { title: 'Pengaduan diterima', detail: 'Laporan berhasil dikirim dan menunggu tindak lanjut.', at: new Date().toISOString() },
    ],
    messages: [],
  }

  complaints.unshift(complaint)
  await saveComplaints(complaints)
  response.status(201).json(complaint)
})

app.post('/api/complaints/:id/messages', async (request, response) => {
  const text = typeof request.body.text === 'string' ? request.body.text.trim() : ''
  if (!text) return response.status(400).json({ message: 'Pesan tidak boleh kosong.' })

  const complaints = await readComplaints()
  const complaint = complaints.find((item) => item.id === request.params.id)
  if (!complaint) return response.status(404).json({ message: 'Pengaduan tidak ditemukan.' })
  complaint.messages ??= []
  complaint.messages.push({ text, sender: 'Fira Putri', at: new Date().toISOString() })
  await saveComplaints(complaints)
  response.status(201).json(complaint)
})

app.patch('/api/complaints/:id/status', async (request, response) => {
  const allowed = ['Diajukan', 'Diproses', 'Selesai']
  if (!allowed.includes(request.body.status)) {
    return response.status(400).json({ message: 'Status pengaduan tidak valid.' })
  }

  const complaints = await readComplaints()
  const complaint = complaints.find((item) => item.id === request.params.id)
  if (!complaint) return response.status(404).json({ message: 'Pengaduan tidak ditemukan.' })
  complaint.status = request.body.status
  complaint.updates ??= []
  complaint.updates.unshift({ title: complaint.status, detail: 'Status diperbarui oleh admin sekolah.', at: new Date().toISOString() })
  await saveComplaints(complaints)
  response.json(complaint)
})

app.listen(port, () => {
  console.log(`SuaraSiswa API berjalan di http://localhost:${port}`)
})
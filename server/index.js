import 'dotenv/config'
import express from 'express'
import { createClient } from '@supabase/supabase-js'

const app = express()
const port = Number(process.env.PORT) || 3002
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di file .env.')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

app.use(express.json({ limit: '6mb' }))

function fromDatabase(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    location: row.location,
    studentName: row.student_name,
    studentClass: row.student_class,
    photo: row.photo,
    status: row.status,
    createdAt: row.created_at,
    updates: row.updates,
    messages: row.messages,
  }
}

function toDatabase(complaint) {
  return {
    id: complaint.id,
    title: complaint.title,
    category: complaint.category,
    description: complaint.description,
    location: complaint.location,
    student_name: complaint.studentName,
    student_class: complaint.studentClass,
    photo: complaint.photo,
    status: complaint.status,
    created_at: complaint.createdAt,
    updates: complaint.updates,
    messages: complaint.messages,
  }
}

function handleDatabaseError(error, response) {
  console.error('Supabase error:', error.message)
  response.status(500).json({ message: 'Terjadi kesalahan saat mengakses database.' })
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'SuaraSiswa API' })
})

app.get('/api/complaints', async (_request, response) => {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return handleDatabaseError(error, response)
  response.json(data.map(fromDatabase))
})

app.get('/api/complaints/:id', async (request, response) => {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', request.params.id)
    .maybeSingle()
  if (error) return handleDatabaseError(error, response)
  const complaint = data && fromDatabase(data)
  if (!complaint) return response.status(404).json({ message: 'Pengaduan tidak ditemukan.' })
  response.json(complaint)
})

app.post('/api/complaints', async (request, response) => {
  const { title, category, description, location, studentName, studentClass, photo } = request.body
  if (![title, category, description].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ message: 'Judul, kategori, dan isi pengaduan wajib diisi.' })
  }

  const createdAt = new Date().toISOString()
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
    createdAt,
    updates: [
      { title: 'Pengaduan diterima', detail: 'Laporan berhasil dikirim dan menunggu tindak lanjut.', at: createdAt },
    ],
    messages: [],
  }

  const { data, error } = await supabase
    .from('complaints')
    .insert(toDatabase(complaint))
    .select('*')
    .single()
  if (error) return handleDatabaseError(error, response)
  response.status(201).json(fromDatabase(data))
})

app.post('/api/complaints/:id/messages', async (request, response) => {
  const text = typeof request.body.text === 'string' ? request.body.text.trim() : ''
  if (!text) return response.status(400).json({ message: 'Pesan tidak boleh kosong.' })

  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', request.params.id)
    .maybeSingle()
  if (error) return handleDatabaseError(error, response)
  const complaint = data && fromDatabase(data)
  if (!complaint) return response.status(404).json({ message: 'Pengaduan tidak ditemukan.' })
  complaint.messages ??= []
  complaint.messages.push({ text, sender: 'Fira Putri', at: new Date().toISOString() })
  const { data: updated, error: updateError } = await supabase
    .from('complaints')
    .update({ messages: complaint.messages })
    .eq('id', request.params.id)
    .select('*')
    .single()
  if (updateError) return handleDatabaseError(updateError, response)
  response.status(201).json(fromDatabase(updated))
})

app.patch('/api/complaints/:id/status', async (request, response) => {
  const allowed = ['Diajukan', 'Diproses', 'Selesai']
  if (!allowed.includes(request.body.status)) {
    return response.status(400).json({ message: 'Status pengaduan tidak valid.' })
  }

  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', request.params.id)
    .maybeSingle()
  if (error) return handleDatabaseError(error, response)
  const complaint = data && fromDatabase(data)
  if (!complaint) return response.status(404).json({ message: 'Pengaduan tidak ditemukan.' })
  complaint.status = request.body.status
  complaint.updates ??= []
  complaint.updates.unshift({ title: complaint.status, detail: 'Status diperbarui oleh admin sekolah.', at: new Date().toISOString() })
  const { data: updated, error: updateError } = await supabase
    .from('complaints')
    .update({ status: complaint.status, updates: complaint.updates })
    .eq('id', request.params.id)
    .select('*')
    .single()
  if (updateError) return handleDatabaseError(updateError, response)
  response.json(fromDatabase(updated))
})

app.use((error, _request, response, _next) => {
  console.error('API error:', error)
  response.status(500).json({ message: 'Terjadi kesalahan pada server.' })
})

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`SuaraSiswa API berjalan di http://localhost:${port}`)
  })
}

export default app
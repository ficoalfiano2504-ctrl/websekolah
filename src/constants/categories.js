import {
  BookOpen,
  ClipboardList,
  Lightbulb,
  Sparkles,
  Toilet,
} from 'lucide-react'

export const categories = [
  { name: 'Fasilitas Sekolah', description: 'Kebersihan fasilitas, sarana prasarana', color: 'blue', icon: Toilet },
  { name: 'Guru & Pembelajaran', description: 'Metode belajar, kinerja guru', color: 'violet', icon: BookOpen },
  { name: 'Lingkungan Sekolah', description: 'Kebersihan, keamanan, kenyamanan', color: 'teal', icon: Sparkles },
  { name: 'Administrasi', description: 'Surat, jadwal, jadwal dll', color: 'orange', icon: ClipboardList },
  { name: 'Lainnya', description: 'Saran, kritik, dan lainnya', color: 'yellow', icon: Lightbulb },
]
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Toast from './Toast.jsx'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-wrap"><Outlet /></main>
      <Toast />
    </div>
  )
}
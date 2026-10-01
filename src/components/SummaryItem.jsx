import { TrendingUp } from 'lucide-react'

export default function SummaryItem({ color, icon, label, value, trend }) {
  return <div className="summary-item"><span className={`summary-icon ${color}`}>{icon}</span><div className="summary-label">{label}</div><strong>{value}</strong><small><TrendingUp size={11} /> {trend}</small></div>
}
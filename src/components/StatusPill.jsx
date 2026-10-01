export default function StatusPill({ status }) {
  const style = status === 'Selesai' ? 'done' : status === 'Diajukan' ? 'new' : 'progress'
  return <span className={`status-pill ${style}`}><span />{status}</span>
}
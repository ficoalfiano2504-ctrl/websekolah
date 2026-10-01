import { categories } from '../constants/categories.js'

export default function CategoryIcon({ category, small = false }) {
  const item = categories.find(({ name }) => name === category) ?? categories[0]
  const Icon = item.icon
  return <span className={`category-icon ${item.color} ${small ? 'small' : ''}`}><Icon size={small ? 14 : 17} strokeWidth={2.3} /></span>
}
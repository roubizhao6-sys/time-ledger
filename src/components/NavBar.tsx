import { BookOpen, CalendarDays, Home, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/dashboard', label: '首页', icon: Home },
  { to: '/timeline', label: '时间轴', icon: CalendarDays },
  { to: '/yearbook', label: '年度册', icon: BookOpen },
  { to: '/settings', label: '我的', icon: Settings },
]

export function NavBar() {
  return (
    <nav className="bottom-nav" aria-label="主要导航">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            <Icon size={20} strokeWidth={2.2} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

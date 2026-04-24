import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Monitor, Menu, X } from 'lucide-react'
import { CONFIG } from '@/constants'

const navItems = [
  { path: '/dashboard', label: '管理后台', icon: LayoutDashboard },
  { path: '/large-screen', label: '数字展厅', icon: Monitor },
]

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-12 bg-background-panel border-b border-border/30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-bold text-primary glow-text">
            {CONFIG.APP_TITLE}
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path === '/dashboard' && location.pathname === '/')
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'text-muted-foreground hover:text-primary hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </header>

      <div className="flex-1 flex relative overflow-hidden">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}
        
        <aside
          className={`fixed md:relative z-50 h-full w-48 bg-background-panel border-r border-border/30 transition-transform duration-300 md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = location.pathname === item.path ||
                (item.path === '/dashboard' && location.pathname === '/')
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'text-muted-foreground hover:text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}

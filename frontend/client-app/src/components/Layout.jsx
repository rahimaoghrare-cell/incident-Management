import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout, getCurrentUser } from '../services/api'

const TABS = [
  { path:'/chat',      icon:'🤖', label:'Assistant' },
  { path:'/incidents', icon:'📋', label:'Mes tickets' },
  { path:'/creer',     icon:'➕', label:'Nouveau' },
  { path:'/profil',    icon:'👤', label:'Profil' },
]

export function Layout({ children }) {
  const loc = useLocation()
  const user = getCurrentUser()

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#F8FAFC', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <header style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg,#0F766E,#065F46)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px' }}>🖥</div>
          <span style={{ fontWeight:'700', fontSize:'15px', color:'#111827' }}>Support USMS</span>
        </div>
        {user && (
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:'linear-gradient(135deg,#0F766E,#065F46)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700', color:'#fff' }}>
              {user.avatar}
            </div>
            <span style={{ color:'#374151', fontSize:'13px', fontWeight:'500' }}>{user.prenom}</span>
          </div>
        )}
      </header>

      {/* Contenu */}
      <main style={{ flex:1, overflowY:'auto' }}>{children}</main>

      {/* Navigation bas */}
      <nav style={{ background:'#fff', borderTop:'1px solid #E5E7EB', display:'flex', position:'sticky', bottom:0 }}>
        {TABS.map(t => {
          const active = loc.pathname === t.path
          return (
            <Link key={t.path} to={t.path} style={{
              flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 0 8px',
              textDecoration:'none', color: active ? '#0F766E' : '#9CA3AF',
              borderTop: active ? '2px solid #0F766E' : '2px solid transparent',
              background: active ? '#F0FDF4' : 'transparent',
              transition:'all 0.15s'
            }}>
              <span style={{ fontSize:'18px', lineHeight:1 }}>{t.icon}</span>
              <span style={{ fontSize:'10px', fontWeight: active?'600':'400', marginTop:'3px', letterSpacing:'0.02em' }}>{t.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

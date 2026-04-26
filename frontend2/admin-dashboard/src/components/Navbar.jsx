import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout, getCurrentUser } from '../services/api'

const LINKS = [
  { path:'/',          icon:'▦',  label:'Dashboard' },
  { path:'/incidents', icon:'⚠',  label:'Incidents' },
  { path:'/users',     icon:'👥', label:'Utilisateurs' },
  { path:'/profil',    icon:'👤', label:'Mon profil'  },
]

export function Navbar() {
  const loc      = useLocation()
  const navigate = useNavigate()
  const user     = getCurrentUser()

  return (
    <nav style={{ width:'220px', minHeight:'100vh', background:'#080F1E', display:'flex', flexDirection:'column', flexShrink:0, borderRight:'1px solid #0F1F3D' }}>
      {/* Logo */}
      <div style={{ padding:'22px 20px 18px', borderBottom:'1px solid #0F1F3D' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'34px', height:'34px', borderRadius:'8px', background:'linear-gradient(135deg,#2563EB,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>🛡</div>
          <div>
            <div style={{ color:'#F8FAFC', fontSize:'14px', fontWeight:'700' }}>GestIncident</div>
            <div style={{ color:'#334155', fontSize:'10px' }}>Admin — USMS</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ flex:1, padding:'12px 10px' }}>
        <p style={{ color:'#1E293B', fontSize:'10px', fontWeight:'600', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0 10px', marginBottom:'6px' }}>Navigation</p>
        {LINKS.map(l => {
          const active = loc.pathname === l.path
          return (
            <Link key={l.path} to={l.path} style={{
              display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px',
              borderRadius:'8px', marginBottom:'2px', textDecoration:'none', fontSize:'13px',
              fontWeight: active ? '600' : '400',
              color: active ? '#F8FAFC' : '#475569',
              background: active ? '#0F2657' : 'transparent',
              borderLeft: active ? '3px solid #2563EB' : '3px solid transparent',
              transition:'all 0.15s'
            }}>
              <span style={{ fontSize:'15px', width:'18px', textAlign:'center' }}>{l.icon}</span>
              {l.label}
            </Link>
          )
        })}
      </div>

      {/* User */}
      {user && (
        <div style={{ padding:'12px', borderTop:'1px solid #0F1F3D' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'8px', background:'#0F172A', marginBottom:'8px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg,#1E3A5F,#2563EB)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700', color:'#93C5FD', flexShrink:0 }}>
              {user.avatar}
            </div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ color:'#F1F5F9', fontSize:'12px', fontWeight:'600', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.prenom} {user.nom}</div>
              <div style={{ color:'#334155', fontSize:'10px' }}>{user.role}</div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login') }}
            style={{ width:'100%', padding:'8px', borderRadius:'7px', background:'transparent', border:'1px solid #1E293B', color:'#475569', cursor:'pointer', fontSize:'12px', transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#EF4444'; e.currentTarget.style.color='#EF4444' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#1E293B'; e.currentTarget.style.color='#475569' }}>
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  )
}

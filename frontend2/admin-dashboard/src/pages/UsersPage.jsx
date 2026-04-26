import { useState, useEffect } from 'react'
import { getUsers } from '../services/api'

export default function UsersPage() {
  const [users, setUsers]         = useState([])
  const [recherche, setRecherche] = useState('')
  const [filtreRole, setFR]       = useState('Tous')

  useEffect(() => { getUsers().then(setUsers) }, [])

  const filtered = users.filter(u => {
    const q = recherche.toLowerCase()
    return `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(q)
      && (filtreRole === 'Tous' || u.role === filtreRole)
  })

  return (
    <div style={{ padding:'32px', fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#050B18', minHeight:'100vh' }}>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ color:'#F8FAFC', fontSize:'22px', fontWeight:'800', margin:'0 0 4px', letterSpacing:'-0.3px' }}>Utilisateurs</h1>
        <p style={{ color:'#475569', fontSize:'13px', margin:0 }}>{filtered.length} utilisateur(s)</p>
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
        <div style={{ position:'relative', flex:1 }}>
          <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#334155' }}>🔍</span>
          <input type="text" placeholder="Rechercher..." value={recherche} onChange={e => setRecherche(e.target.value)}
            style={{ width:'100%', padding:'9px 12px 9px 34px', background:'#0A1628', border:'1px solid #0F1F3D', borderRadius:'9px', color:'#F8FAFC', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
        </div>
        <select value={filtreRole} onChange={e => setFR(e.target.value)}
          style={{ padding:'9px 12px', background:'#0A1628', border:'1px solid #0F1F3D', borderRadius:'9px', color:'#F8FAFC', fontSize:'13px', outline:'none', cursor:'pointer' }}>
          {['Tous','Technicien','Utilisateur'].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Grille */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'14px' }}>
        {filtered.map(u => (
          <div key={u.id} style={{ background:'#0A1628', borderRadius:'12px', padding:'20px', border:'1px solid #0F1F3D', transition:'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#2563EB'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#0F1F3D'}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'50%', background: u.role==='Technicien' ? 'linear-gradient(135deg,#1E3A5F,#2563EB)' : 'linear-gradient(135deg,#0F2A1A,#166534)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'700', color: u.role==='Technicien' ? '#93C5FD' : '#4ADE80', flexShrink:0 }}>
                {u.avatar}
              </div>
              <div>
                <p style={{ color:'#F1F5F9', fontSize:'14px', fontWeight:'600', margin:'0 0 3px' }}>{u.prenom} {u.nom}</p>
                <span style={{ padding:'2px 10px', borderRadius:'12px', fontSize:'10px', fontWeight:'600', background: u.role==='Technicien'?'#0F2657':'#0F2A1A', color: u.role==='Technicien'?'#60A5FA':'#4ADE80' }}>{u.role}</span>
              </div>
            </div>
            {[['Email', u.email], ['Département', u.departement], ['Incidents', `${u.nb_incidents}`]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #0F1F3D' }}>
                <span style={{ color:'#334155', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</span>
                <span style={{ color:'#64748B', fontSize:'12px' }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

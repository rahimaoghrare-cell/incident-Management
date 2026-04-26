import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout, getIncidents } from '../services/api'

export default function ProfileAdminPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [preview, setPreview]   = useState(null)
  const [avatar, setAvatar]     = useState(null)
  const [sauvegarde, setSave]   = useState(false)
  const [mesIncidents, setMesInc] = useState([])

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    getIncidents().then(list =>
      setMesInc(list.filter(i => i.technicien_nom === `${user.prenom} ${user.nom}`).slice(0, 5))
    )
  }, [])

  if (!user) return null

  const handleAvatar = (e) => {
    const f = e.target.files[0]
    if (!f || !f.type.startsWith('image/')) return
    setAvatar(f); setPreview(URL.createObjectURL(f))
  }

  const handleSave = () => {
    setSave(true)
    setTimeout(() => setSave(false), 2000)
  }

  const SC = { Nouveau:'#3B82F6', Assigné:'#F97316', 'En cours':'#F59E0B', Résolu:'#22C55E', Fermé:'#6B7280' }

  return (
    <div style={{ padding:'32px', fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#050B18', minHeight:'100vh' }}>
      <h1 style={{ color:'#F8FAFC', fontSize:'22px', fontWeight:'800', margin:'0 0 24px', letterSpacing:'-0.3px' }}>Mon profil</h1>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:'20px', alignItems:'start' }}>
        {/* Colonne gauche */}
        <div>
          {/* Card identité */}
          <div style={{ background:'#0A1628', borderRadius:'14px', padding:'24px', border:'1px solid #0F1F3D', marginBottom:'16px', textAlign:'center' }}>
            <div style={{ position:'relative', display:'inline-block', marginBottom:'14px' }}>
              {preview
                ? <img src={preview} alt="avatar" style={{ width:'80px', height:'80px', borderRadius:'50%', objectFit:'cover', border:'3px solid #1E293B' }} />
                : <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg,#1E3A5F,#2563EB)', border:'3px solid #0F1F3D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', fontWeight:'800', color:'#93C5FD', margin:'0 auto' }}>{user.avatar}</div>
              }
              <button onClick={() => document.getElementById('av-adm').click()}
                style={{ position:'absolute', bottom:0, right:0, width:'26px', height:'26px', borderRadius:'50%', background:'#2563EB', border:'2px solid #0A1628', color:'#fff', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                ✎
              </button>
            </div>
            <input id="av-adm" type="file" accept="image/*" onChange={handleAvatar} style={{ display:'none' }} />
            <h2 style={{ color:'#F8FAFC', fontSize:'18px', fontWeight:'700', margin:'0 0 6px' }}>{user.prenom} {user.nom}</h2>
            <span style={{ padding:'3px 12px', borderRadius:'20px', fontSize:'12px', background:'#0F2657', color:'#60A5FA', fontWeight:'600' }}>{user.role}</span>

            {avatar && (
              <button onClick={handleSave}
                style={{ width:'100%', marginTop:'16px', padding:'10px', background: sauvegarde ? '#22C55E' : 'linear-gradient(135deg,#2563EB,#1d4ed8)', color:'#fff', border:'none', borderRadius:'9px', fontSize:'13px', fontWeight:'600', cursor:'pointer', transition:'background 0.3s' }}>
                {sauvegarde ? '✓ Avatar mis à jour !' : 'Sauvegarder l\'avatar'}
              </button>
            )}
          </div>

          {/* Infos */}
          <div style={{ background:'#0A1628', borderRadius:'14px', padding:'20px', border:'1px solid #0F1F3D', marginBottom:'16px' }}>
            <p style={{ color:'#334155', fontSize:'10px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 14px' }}>Informations</p>
            {[['Email', user.email], ['Département', user.departement || 'IT'], ['Rôle', user.role]].map(([l, v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #0F1F3D' }}>
                <span style={{ color:'#475569', fontSize:'12px' }}>{l}</span>
                <span style={{ color:'#94A3B8', fontSize:'12px', fontWeight:'500', maxWidth:'180px', textAlign:'right', overflow:'hidden', textOverflow:'ellipsis' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Déconnexion */}
          <button onClick={() => { logout(); navigate('/login') }}
            style={{ width:'100%', padding:'11px', background:'transparent', border:'1px solid #EF444440', borderRadius:'9px', color:'#EF4444', cursor:'pointer', fontSize:'13px', fontWeight:'500', transition:'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            Déconnexion
          </button>
        </div>

        {/* Colonne droite */}
        <div>
          {/* Stats rapides */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px' }}>
            {[
              { label:'Incidents assignés',  value: user.nb_incidents || 0,     color:'#3B82F6' },
              { label:'Résolus ce mois',     value: mesIncidents.filter(i => i.statut==='Résolu').length, color:'#22C55E' },
              { label:'En cours',            value: mesIncidents.filter(i => i.statut==='En cours').length, color:'#F59E0B' },
            ].map(s => (
              <div key={s.label} style={{ background:'#0A1628', borderRadius:'12px', padding:'18px', border:`1px solid ${s.color}22`, borderTop:`3px solid ${s.color}` }}>
                <p style={{ color:'#334155', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 8px' }}>{s.label}</p>
                <p style={{ color:'#F8FAFC', fontSize:'28px', fontWeight:'800', margin:0, letterSpacing:'-1px' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Historique activité */}
          <div style={{ background:'#0A1628', borderRadius:'14px', border:'1px solid #0F1F3D' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #0F1F3D' }}>
              <h3 style={{ color:'#F8FAFC', fontSize:'14px', fontWeight:'600', margin:0 }}>Historique d'activité</h3>
            </div>
            <div style={{ padding:'8px 20px' }}>
              {mesIncidents.length === 0 ? (
                <p style={{ color:'#334155', fontSize:'13px', textAlign:'center', padding:'24px 0' }}>Aucune activité récente</p>
              ) : mesIncidents.map((inc, i) => {
                const c = SC[inc.statut] || '#6B7280'
                return (
                  <div key={inc.id} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'13px 0', borderBottom: i < mesIncidents.length-1 ? '1px solid #0F1F3D' : 'none' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'9px', background:`${c}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:c }} />
                    </div>
                    <div style={{ flex:1, overflow:'hidden' }}>
                      <p style={{ color:'#CBD5E1', fontSize:'13px', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inc.titre}</p>
                      <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                        <span style={{ color:'#2563EB', fontSize:'11px', fontFamily:'monospace' }}>{inc.id}</span>
                        <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'#334155', display:'inline-block' }} />
                        <span style={{ color:'#334155', fontSize:'11px' }}>{new Date(inc.date_creation).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <span style={{ padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background:`${c}20`, color:c, border:`1px solid ${c}40`, flexShrink:0 }}>{inc.statut}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

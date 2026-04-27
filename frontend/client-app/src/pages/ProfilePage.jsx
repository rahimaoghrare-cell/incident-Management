import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout, getMesIncidents } from '../services/api'

const SC = { Nouveau:'#3B82F6', Assigné:'#F97316', 'En cours':'#F59E0B', Résolu:'#22C55E', Fermé:'#6B7280' }

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [preview, setPreview]   = useState(null)
  const [avatar, setAvatar]     = useState(null)
  const [sauvegarde, setSave]   = useState(false)
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    getMesIncidents().then(setIncidents)
  }, [])

  if (!user) return null

  const handleAvatar = (e) => {
    const f = e.target.files[0]
    if (!f || !f.type.startsWith('image/')) return
    setAvatar(f); setPreview(URL.createObjectURL(f))
  }

  const stats = {
    total:    incidents.length,
    enCours:  incidents.filter(i => i.statut === 'En cours').length,
    resolus:  incidents.filter(i => i.statut === 'Résolu').length,
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:'calc(100vh - 120px)', background:'#F8FAFC' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0F766E,#065F46)', padding:'28px 20px 60px' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ position:'relative', display:'inline-block', marginBottom:'12px' }}>
            {preview
              ? <img src={preview} alt="avatar" style={{ width:'72px', height:'72px', borderRadius:'50%', objectFit:'cover', border:'3px solid rgba(255,255,255,0.4)' }} />
              : <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', border:'3px solid rgba(255,255,255,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:'800', color:'#fff', margin:'0 auto' }}>{user.avatar}</div>
            }
            <button onClick={() => document.getElementById('av-cli').click()}
              style={{ position:'absolute', bottom:0, right:0, width:'24px', height:'24px', borderRadius:'50%', background:'#fff', border:'2px solid #0F766E', color:'#0F766E', fontSize:'11px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              ✎
            </button>
          </div>
          <input id="av-cli" type="file" accept="image/*" onChange={handleAvatar} style={{ display:'none' }} />
          <h2 style={{ color:'#fff', fontSize:'18px', fontWeight:'700', margin:'0 0 4px' }}>{user.prenom} {user.nom}</h2>
          <span style={{ padding:'2px 12px', borderRadius:'20px', fontSize:'11px', background:'rgba(255,255,255,0.2)', color:'#fff' }}>{user.role}</span>
        </div>
      </div>

      <div style={{ padding:'0 16px', marginTop:'-32px' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'16px' }}>
          {[['Total', stats.total, '#3B82F6'], ['En cours', stats.enCours, '#F59E0B'], ['Résolus', stats.resolus, '#22C55E']].map(([l,v,c]) => (
            <div key={l} style={{ background:'#fff', borderRadius:'12px', padding:'14px', textAlign:'center', border:'1px solid #E5E7EB', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ color:c, fontSize:'24px', fontWeight:'800', margin:'0 0 3px', letterSpacing:'-1px' }}>{v}</p>
              <p style={{ color:'#9CA3AF', fontSize:'11px', margin:0 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Infos */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'16px', border:'1px solid #E5E7EB', marginBottom:'14px' }}>
          <h3 style={{ color:'#111827', fontSize:'14px', fontWeight:'600', margin:'0 0 12px' }}>Informations</h3>
          {[['Email', user.email], ['Département', user.departement || '—']].map(([l,v]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #F3F4F6' }}>
              <span style={{ color:'#6B7280', fontSize:'13px' }}>{l}</span>
              <span style={{ color:'#111827', fontSize:'13px', fontWeight:'500', maxWidth:'220px', textAlign:'right', overflow:'hidden', textOverflow:'ellipsis' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Historique */}
        <div style={{ background:'#fff', borderRadius:'12px', border:'1px solid #E5E7EB', marginBottom:'14px' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #F3F4F6' }}>
            <h3 style={{ color:'#111827', fontSize:'14px', fontWeight:'600', margin:0 }}>Historique d'activité</h3>
          </div>
          <div style={{ padding:'8px 16px' }}>
            {incidents.length === 0
              ? <p style={{ color:'#9CA3AF', fontSize:'13px', textAlign:'center', padding:'16px 0' }}>Aucune activité</p>
              : incidents.slice(0, 5).map((inc, i) => {
                  const c = SC[inc.statut] || '#6B7280'
                  return (
                    <div key={inc.id} style={{ display:'flex', gap:'12px', alignItems:'center', padding:'11px 0', borderBottom: i < Math.min(incidents.length, 5)-1 ? '1px solid #F3F4F6' : 'none' }}>
                      <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:c, flexShrink:0 }} />
                      <div style={{ flex:1, overflow:'hidden' }}>
                        <p style={{ color:'#111827', fontSize:'13px', fontWeight:'500', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inc.titre}</p>
                        <p style={{ color:'#9CA3AF', fontSize:'11px', margin:0 }}>
                          <span style={{ color:'#0F766E', fontFamily:'monospace' }}>{inc.id}</span>
                          {' · '}{new Date(inc.date_creation).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span style={{ padding:'2px 8px', borderRadius:'12px', fontSize:'10px', fontWeight:'600', background:`${c}18`, color:c, flexShrink:0 }}>{inc.statut}</span>
                    </div>
                  )
                })
            }
          </div>
        </div>

        {/* Boutons */}
        {avatar && (
          <button onClick={() => setSave(true)}
            style={{ width:'100%', marginBottom:'10px', padding:'12px', background: sauvegarde ? '#22C55E' : 'linear-gradient(135deg,#0F766E,#065F46)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer', transition:'background 0.3s' }}>
            {sauvegarde ? '✓ Avatar mis à jour !' : 'Sauvegarder l\'avatar'}
          </button>
        )}
        <button onClick={() => { logout(); navigate('/login') }}
          style={{ width:'100%', marginBottom:'20px', padding:'12px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'10px', color:'#DC2626', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>
          Déconnexion
        </button>
      </div>
    </div>
  )
}

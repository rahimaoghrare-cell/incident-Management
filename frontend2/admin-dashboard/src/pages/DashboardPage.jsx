import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats2, getIncidents } from '../services/api'

const STATUT_COLOR = { Nouveau:'#3B82F6', Assigné:'#F97316', 'En cours':'#F59E0B', Résolu:'#22C55E', Fermé:'#6B7280' }
const PRIORITE_COLOR = { Haute:'#EF4444', Moyenne:'#F59E0B', Basse:'#22C55E' }

function Badge({ value, type='statut' }) {
  const c = (type==='priorite' ? PRIORITE_COLOR : STATUT_COLOR)[value] || '#6B7280'
  return <span style={{ padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background:`${c}20`, color:c, border:`1px solid ${c}40` }}>{value}</span>
}

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{ background:'#0A1628', borderRadius:'12px', padding:'20px', border:`1px solid ${color}22`, borderTop:`3px solid ${color}`, flex:1, minWidth:'140px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <p style={{ color:'#475569', fontSize:'12px', margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
          <p style={{ color:'#F8FAFC', fontSize:'30px', fontWeight:'800', margin:0, letterSpacing:'-1px' }}>{value}</p>
          {sub && <p style={{ color:'#334155', fontSize:'11px', margin:'4px 0 0' }}>{sub}</p>}
        </div>
        <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>{icon}</div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats]       = useState(null)
  const [incidents, setIncidents] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getStats2().then(setStats)
    getIncidents().then(d => setIncidents(d.slice(0, 6)))
  }, [])

  if (!stats) return <div style={{ padding:'40px', color:'#475569', fontFamily:'sans-serif' }}>Chargement...</div>

  const total = Object.values(stats).reduce((a,b) => a+b, 0)

  return (
    <div style={{ padding:'32px', fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#050B18', minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ color:'#F8FAFC', fontSize:'22px', fontWeight:'800', margin:'0 0 4px', letterSpacing:'-0.3px' }}>Tableau de bord</h1>
        <p style={{ color:'#475569', fontSize:'13px', margin:0 }}>{new Date().toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>

      {/* Stats cards */}
      <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'28px' }}>
        <StatCard icon="📋" label="Total"    value={total}              color="#60A5FA" sub="tous statuts" />
        <StatCard icon="🆕" label="Nouveaux" value={stats['Nouveau']}   color="#3B82F6" sub="en attente" />
        <StatCard icon="⚙"  label="En cours" value={stats['En cours']}  color="#F59E0B" sub="traitement" />
        <StatCard icon="✅" label="Résolus"  value={stats['Résolu']}    color="#22C55E" sub="cette semaine" />
        <StatCard icon="🔒" label="Fermés"   value={stats['Fermé']}     color="#6B7280" sub="archivés" />
      </div>

      {/* Barre de progression par statut */}
      <div style={{ background:'#0A1628', borderRadius:'12px', padding:'20px', border:'1px solid #0F1F3D', marginBottom:'24px' }}>
        <p style={{ color:'#94A3B8', fontSize:'12px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 14px' }}>Répartition</p>
        <div style={{ display:'flex', height:'8px', borderRadius:'20px', overflow:'hidden', gap:'2px' }}>
          {Object.entries(stats).filter(([,v]) => v > 0).map(([k, v]) => (
            <div key={k} title={`${k}: ${v}`} style={{ flex:v, background: STATUT_COLOR[k], borderRadius:'4px', transition:'flex 0.5s' }} />
          ))}
        </div>
        <div style={{ display:'flex', gap:'16px', marginTop:'10px', flexWrap:'wrap' }}>
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: STATUT_COLOR[k] }} />
              <span style={{ color:'#475569', fontSize:'11px' }}>{k} ({v})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Derniers incidents */}
      <div style={{ background:'#0A1628', borderRadius:'12px', border:'1px solid #0F1F3D', overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #0F1F3D', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ color:'#F8FAFC', fontSize:'14px', fontWeight:'700', margin:0 }}>Incidents récents</h2>
          <button onClick={() => navigate('/incidents')} style={{ color:'#2563EB', background:'none', border:'none', fontSize:'12px', cursor:'pointer', fontWeight:'500' }}>Voir tout →</button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#080F1E' }}>
              {['Référence','Titre','Utilisateur','Priorité','Statut','Date'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', color:'#334155', fontSize:'10px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incidents.map(inc => (
              <tr key={inc.id} onClick={() => navigate(`/incidents/${inc.id}`)}
                style={{ borderTop:'1px solid #0F1F3D', cursor:'pointer', transition:'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background='#0F172A'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'12px 16px', color:'#2563EB', fontSize:'12px', fontFamily:'monospace' }}>{inc.id}</td>
                <td style={{ padding:'12px 16px', color:'#CBD5E1', fontSize:'13px', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inc.titre}</td>
                <td style={{ padding:'12px 16px', color:'#64748B', fontSize:'12px' }}>{inc.utilisateur_nom}</td>
                <td style={{ padding:'12px 16px' }}><Badge value={inc.priorite} type="priorite" /></td>
                <td style={{ padding:'12px 16px' }}><Badge value={inc.statut} /></td>
                <td style={{ padding:'12px 16px', color:'#334155', fontSize:'11px' }}>{new Date(inc.date_creation).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

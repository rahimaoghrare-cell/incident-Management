import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getIncidentById, getCommentaires, ajouterCommentaire, updateStatut, supprimerCommentaire } from '../services/api'
import { useNotif } from '../components/Notifications'

const SC = { Nouveau:'#3B82F6', Assigné:'#F97316', 'En cours':'#F59E0B', Résolu:'#22C55E', Fermé:'#6B7280' }
const PC = { Haute:'#EF4444', Moyenne:'#F59E0B', Basse:'#22C55E' }
const STATUTS = ['Nouveau','Assigné','En cours','Résolu','Fermé']

function Badge({ value, type='statut', size='sm' }) {
  const c = (type==='priorite' ? PC : SC)[value] || '#6B7280'
  const pad = size==='lg' ? '5px 14px' : '2px 10px'
  return <span style={{ padding:pad, borderRadius:'20px', fontSize: size==='lg'?'13px':'11px', fontWeight:'600', background:`${c}20`, color:c, border:`1px solid ${c}40` }}>{value}</span>
}

export default function IncidentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [incident, setIncident]       = useState(null)
  const [commentaires, setCommentaires] = useState([])
  const [message, setMessage]         = useState('')
  const [envoi, setEnvoi]             = useState(false)

  const notify = useNotif()

  const load = async () => {
    const [inc, cmts] = await Promise.all([getIncidentById(id), getCommentaires(id)])
    setIncident(inc); setCommentaires(cmts)
  }

  useEffect(() => { load() }, [id])

  const handleStatut = async (s) => {
    await updateStatut(id, s)
    notify(`Statut changé → ${s}`, s === 'Résolu' ? 'success' : s === 'Fermé' ? 'info' : 'warning')
    load()
  }
  const handleEnvoyer = async () => {
    if (!message.trim()) return
    setEnvoi(true)
    await ajouterCommentaire(id, message)
    notify('Commentaire ajouté', 'success')
    setMessage(''); load(); setEnvoi(false)
  }
  const handleDeleteComment = async (cid) => {
    await supprimerCommentaire(cid)
    notify('Commentaire supprimé', 'info')
    load()
  }

  if (!incident) return <div style={{ padding:'40px', color:'#475569' }}>Chargement...</div>

  return (
    <div style={{ padding:'32px', fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#050B18', minHeight:'100vh' }}>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', fontSize:'13px' }}>
        <button onClick={() => navigate('/incidents')} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', padding:0 }}>Incidents</button>
        <span style={{ color:'#1E293B' }}>›</span>
        <span style={{ color:'#2563EB', fontFamily:'monospace' }}>{id}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'20px', alignItems:'start' }}>
        {/* Colonne principale */}
        <div>
          {/* Header incident */}
          <div style={{ background:'#0A1628', borderRadius:'12px', padding:'24px', border:'1px solid #0F1F3D', marginBottom:'16px' }}>
            <div style={{ display:'flex', gap:'8px', marginBottom:'12px', flexWrap:'wrap' }}>
              <Badge value={incident.statut} size="lg" />
              <Badge value={incident.priorite} type="priorite" size="lg" />
              <span style={{ padding:'5px 14px', borderRadius:'20px', fontSize:'13px', background:'#1E293B', color:'#64748B' }}>{incident.categorie}</span>
            </div>
            <h1 style={{ color:'#F8FAFC', fontSize:'20px', fontWeight:'700', margin:'0 0 16px', letterSpacing:'-0.3px' }}>{incident.titre}</h1>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', paddingTop:'16px', borderTop:'1px solid #0F1F3D' }}>
              {[['Signalé par', incident.utilisateur_nom], ['Technicien', incident.technicien_nom || 'Non assigné'], ['Date', new Date(incident.date_creation).toLocaleDateString('fr-FR')]].map(([l,v]) => (
                <div key={l}>
                  <p style={{ color:'#334155', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 3px' }}>{l}</p>
                  <p style={{ color:'#94A3B8', fontSize:'13px', margin:0 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ background:'#0A1628', borderRadius:'12px', padding:'20px', border:'1px solid #0F1F3D', marginBottom:'16px' }}>
            <p style={{ color:'#334155', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 10px' }}>Description</p>
            <p style={{ color:'#94A3B8', fontSize:'14px', lineHeight:'1.6', margin:0 }}>{incident.description}</p>
          </div>

          {/* Commentaires */}
          <div style={{ background:'#0A1628', borderRadius:'12px', border:'1px solid #0F1F3D' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #0F1F3D' }}>
              <h2 style={{ color:'#F8FAFC', fontSize:'14px', fontWeight:'600', margin:0 }}>Commentaires ({commentaires.length})</h2>
            </div>
            <div style={{ padding:'16px 20px' }}>
              {commentaires.length === 0 ? (
                <p style={{ color:'#334155', fontSize:'13px', textAlign:'center', padding:'20px 0' }}>Aucun commentaire</p>
              ) : commentaires.map(c => (
                <div key={c.id} style={{ display:'flex', gap:'10px', marginBottom:'14px' }}>
                  <div style={{ width:'34px', height:'34px', borderRadius:'50%', background: c.role==='Technicien' ? '#0F2657' : '#0F1F3D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700', color: c.role==='Technicien' ? '#60A5FA' : '#64748B', flexShrink:0 }}>
                    {c.auteur.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'5px' }}>
                      <span style={{ color:'#F1F5F9', fontSize:'12px', fontWeight:'600' }}>{c.auteur}</span>
                      <span style={{ padding:'1px 8px', borderRadius:'10px', fontSize:'10px', background: c.role==='Technicien'?'#0F2657':'#0F1F3D', color: c.role==='Technicien'?'#60A5FA':'#64748B' }}>{c.role}</span>
                      <span style={{ color:'#334155', fontSize:'10px' }}>{new Date(c.date).toLocaleString('fr-FR')}</span>
                      <button onClick={() => handleDeleteComment(c.id)} style={{ marginLeft:'auto', background:'none', border:'none', color:'#334155', cursor:'pointer', fontSize:'12px', padding:'0 4px' }}
                        onMouseEnter={e => e.currentTarget.style.color='#EF4444'} onMouseLeave={e => e.currentTarget.style.color='#334155'}>🗑</button>
                    </div>
                    <p style={{ background:'#080F1E', borderRadius:'8px', padding:'9px 12px', color:'#94A3B8', fontSize:'13px', margin:0, lineHeight:'1.5', border:'1px solid #0F1F3D' }}>{c.message}</p>
                  </div>
                </div>
              ))}
              {/* Saisie */}
              <div style={{ marginTop:'16px', paddingTop:'14px', borderTop:'1px solid #0F1F3D' }}>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Écrire un commentaire..."
                  style={{ width:'100%', padding:'10px 14px', background:'#080F1E', border:'1.5px solid #0F1F3D', borderRadius:'9px', color:'#F8FAFC', fontSize:'13px', outline:'none', resize:'vertical', boxSizing:'border-box', fontFamily:'inherit', lineHeight:'1.5' }} />
                <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'8px' }}>
                  <button onClick={handleEnvoyer} disabled={envoi || !message.trim()}
                    style={{ padding:'9px 20px', background: envoi||!message.trim() ? '#1E293B' : 'linear-gradient(135deg,#2563EB,#1d4ed8)', color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
                    {envoi ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne latérale */}
        <div>
          {/* Actions */}
          <div style={{ background:'#0A1628', borderRadius:'12px', padding:'18px', border:'1px solid #0F1F3D', marginBottom:'14px' }}>
            <p style={{ color:'#334155', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 12px' }}>Actions</p>
            <button onClick={() => navigate(`/incidents/${id}/modifier`)}
              style={{ width:'100%', padding:'10px', background:'#080F1E', border:'1px solid #1E293B', borderRadius:'8px', color:'#F59E0B', fontSize:'13px', cursor:'pointer', marginBottom:'8px', fontWeight:'500' }}>
              ✎ Modifier l'incident
            </button>
            <button onClick={() => navigate(`/incidents/${id}/assigner`)}
              style={{ width:'100%', padding:'10px', background:'#080F1E', border:'1px solid #1E293B', borderRadius:'8px', color:'#60A5FA', fontSize:'13px', cursor:'pointer', fontWeight:'500' }}>
              👤 Assigner un technicien
            </button>
          </div>

          {/* Changer statut */}
          <div style={{ background:'#0A1628', borderRadius:'12px', padding:'18px', border:'1px solid #0F1F3D' }}>
            <p style={{ color:'#334155', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 12px' }}>Changer le statut</p>
            {STATUTS.map(s => {
              const c = SC[s]
              const active = incident.statut === s
              return (
                <button key={s} onClick={() => handleStatut(s)}
                  style={{ width:'100%', padding:'9px 12px', marginBottom:'6px', borderRadius:'8px', border:`1px solid ${active ? c : '#0F1F3D'}`, background: active ? `${c}20` : '#080F1E', color: active ? c : '#475569', fontSize:'12px', cursor:'pointer', fontWeight: active ? '600' : '400', textAlign:'left', transition:'all 0.15s', display:'flex', alignItems:'center', gap:'8px' }}>
                  <div style={{ width:'7px', height:'7px', borderRadius:'50%', background: active ? c : '#1E293B' }} />
                  {s}
                  {active && <span style={{ marginLeft:'auto', fontSize:'11px' }}>✓ actuel</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

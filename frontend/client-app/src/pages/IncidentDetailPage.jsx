import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getIncidentById, getCommentaires, ajouterCommentaire } from '../services/api'

const SC = { Nouveau:'#3B82F6', Assigné:'#F97316', 'En cours':'#F59E0B', Résolu:'#22C55E', Fermé:'#6B7280' }
const PC = { Haute:'#EF4444', Moyenne:'#F59E0B', Basse:'#22C55E' }

function Badge({ value, type='statut' }) {
  const c = (type==='priorite' ? PC : SC)[value] || '#6B7280'
  return <span style={{ padding:'4px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background:`${c}18`, color:c, border:`1px solid ${c}33` }}>{value}</span>
}

export default function IncidentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [incident, setIncident]     = useState(null)
  const [commentaires, setComments] = useState([])
  const [message, setMessage]       = useState('')
  const [envoi, setEnvoi]           = useState(false)

  const load = async () => {
    const [inc, cmts] = await Promise.all([getIncidentById(id), getCommentaires(id)])
    setIncident(inc); setComments(cmts)
  }

  useEffect(() => { load() }, [id])

  const handleEnvoyer = async () => {
    if (!message.trim()) return
    setEnvoi(true)
    await ajouterCommentaire(id, message)
    setMessage(''); load(); setEnvoi(false)
  }

  if (!incident) return <div style={{ padding:'40px', textAlign:'center', color:'#9CA3AF' }}>Chargement...</div>

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:'calc(100vh - 120px)', background:'#F8FAFC' }}>
      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'12px 20px', display:'flex', alignItems:'center', gap:'10px' }}>
        <button onClick={() => navigate('/incidents')} style={{ background:'none', border:'none', color:'#6B7280', cursor:'pointer', fontSize:'14px', padding:0 }}>←</button>
        <span style={{ color:'#0F766E', fontSize:'12px', fontFamily:'monospace', fontWeight:'600' }}>{id}</span>
      </div>

      <div style={{ padding:'16px 20px' }}>
        {/* Info incident */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'18px', border:'1px solid #E5E7EB', marginBottom:'14px' }}>
          <div style={{ display:'flex', gap:'6px', marginBottom:'10px', flexWrap:'wrap' }}>
            <Badge value={incident.statut} />
            <Badge value={incident.priorite} type="priorite" />
          </div>
          <h1 style={{ fontSize:'16px', fontWeight:'700', color:'#111827', margin:'0 0 14px', lineHeight:'1.3' }}>{incident.titre}</h1>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {[['Technicien', incident.technicien_nom||'En attente'], ['Catégorie', incident.categorie], ['Date', new Date(incident.date_creation).toLocaleDateString('fr-FR')]].map(([l,v]) => (
              <div key={l}>
                <p style={{ color:'#9CA3AF', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 2px' }}>{l}</p>
                <p style={{ color:'#374151', fontSize:'13px', margin:0, fontWeight:'500' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'16px', border:'1px solid #E5E7EB', marginBottom:'14px' }}>
          <p style={{ color:'#9CA3AF', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 8px' }}>Description</p>
          <p style={{ color:'#374151', fontSize:'14px', lineHeight:'1.6', margin:0 }}>{incident.description}</p>
        </div>

        {/* Commentaires */}
        <div style={{ background:'#fff', borderRadius:'12px', border:'1px solid #E5E7EB' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #F3F4F6' }}>
            <h2 style={{ fontSize:'14px', fontWeight:'600', color:'#111827', margin:0 }}>Suivi ({commentaires.length})</h2>
          </div>
          <div style={{ padding:'14px 16px' }}>
            {commentaires.length === 0
              ? <p style={{ color:'#9CA3AF', fontSize:'13px', textAlign:'center', padding:'16px 0' }}>Aucun commentaire</p>
              : commentaires.map(c => (
                  <div key={c.id} style={{ display:'flex', gap:'10px', marginBottom:'12px' }}>
                    <div style={{ width:'30px', height:'30px', borderRadius:'50%', background: c.role==='Technicien' ? '#EFF6FF' : '#F9FAFB', border:'1px solid #E5E7EB', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'700', color: c.role==='Technicien'?'#1D4ED8':'#6B7280', flexShrink:0 }}>
                      {c.auteur.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:'6px', alignItems:'center', marginBottom:'4px' }}>
                        <span style={{ fontSize:'12px', fontWeight:'600', color:'#111827' }}>{c.auteur}</span>
                        {c.role==='Technicien' && <span style={{ padding:'1px 7px', borderRadius:'10px', fontSize:'10px', background:'#EFF6FF', color:'#1D4ED8' }}>Tech</span>}
                        <span style={{ fontSize:'10px', color:'#9CA3AF' }}>{new Date(c.date).toLocaleString('fr-FR')}</span>
                      </div>
                      <p style={{ background:'#F9FAFB', borderRadius:'8px', padding:'8px 12px', color:'#374151', fontSize:'13px', margin:0, lineHeight:'1.5', border:'1px solid #F3F4F6' }}>{c.message}</p>
                    </div>
                  </div>
                ))
            }
            {/* Saisie */}
            <div style={{ marginTop:'14px', paddingTop:'12px', borderTop:'1px solid #F3F4F6' }}>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="Ajouter un commentaire..."
                style={{ width:'100%', padding:'10px 14px', background:'#F9FAFB', border:'1.5px solid #E5E7EB', borderRadius:'9px', color:'#111827', fontSize:'13px', outline:'none', resize:'none', boxSizing:'border-box', fontFamily:'inherit', lineHeight:'1.5' }} />
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'8px' }}>
                <button onClick={handleEnvoyer} disabled={envoi || !message.trim()}
                  style={{ padding:'8px 18px', background: envoi||!message.trim() ? '#E5E7EB' : 'linear-gradient(135deg,#0F766E,#065F46)', color: envoi||!message.trim()?'#9CA3AF':'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
                  {envoi ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

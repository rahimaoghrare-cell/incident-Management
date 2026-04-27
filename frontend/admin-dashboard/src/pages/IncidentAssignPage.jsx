import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getIncidentById, getUsers, assignerTechnicien } from '../services/api'
import { useNotif } from '../components/Notifications'

export default function IncidentAssignPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notify = useNotif()

  const [incident, setIncident]       = useState(null)
  const [techniciens, setTechniciens] = useState([])
  const [choix, setChoix]             = useState('')
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    getIncidentById(id).then(inc => {
      setIncident(inc)
      setChoix(inc?.technicien_nom || '')
    })
    getUsers().then(users => setTechniciens(users.filter(u => u.role === 'Technicien')))
  }, [id])

  const handleAssigner = async () => {
    if (!choix) return
    setLoading(true)
    try {
      await assignerTechnicien(id, choix)
      notify(`Incident ${id} assigné à ${choix}`, 'success')
      navigate(`/incidents/${id}`)
    } catch {
      notify('Erreur lors de l\'assignation', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!incident) return (
    <div style={{ padding:'40px', color:'#475569', fontFamily:"'Segoe UI',sans-serif" }}>Chargement...</div>
  )

  return (
    <div style={{ padding:'32px', fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#050B18', minHeight:'100vh' }}>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'24px', fontSize:'13px' }}>
        <button onClick={() => navigate('/incidents')} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', padding:0 }}>Incidents</button>
        <span style={{ color:'#1E293B' }}>›</span>
        <button onClick={() => navigate(`/incidents/${id}`)} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', padding:0, fontFamily:'monospace' }}>{id}</button>
        <span style={{ color:'#1E293B' }}>›</span>
        <span style={{ color:'#60A5FA' }}>Assigner</span>
      </div>

      <h1 style={{ color:'#F8FAFC', fontSize:'20px', fontWeight:'700', margin:'0 0 4px', letterSpacing:'-0.3px' }}>
        Assigner un technicien
      </h1>
      <p style={{ color:'#475569', fontSize:'13px', margin:'0 0 28px' }}>{incident.titre}</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'20px', alignItems:'start' }}>
        {/* Liste techniciens */}
        <div style={{ background:'#0A1628', borderRadius:'12px', padding:'20px', border:'1px solid #0F1F3D' }}>
          <p style={{ color:'#64748B', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 16px' }}>
            Choisir un technicien
          </p>

          {/* Option : non assigné */}
          <div onClick={() => setChoix('')}
            style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', borderRadius:'10px', marginBottom:'8px', cursor:'pointer', border:`1.5px solid ${choix === '' ? '#475569' : '#0F1F3D'}`, background: choix === '' ? '#1E293B' : '#080F1E', transition:'all 0.15s' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'#1E293B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>—</div>
            <div>
              <p style={{ color:'#64748B', fontSize:'13px', margin:0 }}>Non assigné</p>
              <p style={{ color:'#334155', fontSize:'11px', margin:'2px 0 0' }}>Retirer l'assignation</p>
            </div>
            {choix === '' && <span style={{ marginLeft:'auto', color:'#6B7280', fontSize:'14px' }}>✓</span>}
          </div>

          {techniciens.map(t => {
            const nom = `${t.prenom} ${t.nom}`
            const selected = choix === nom
            return (
              <div key={t.id} onClick={() => setChoix(nom)}
                style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', borderRadius:'10px', marginBottom:'8px', cursor:'pointer', border:`1.5px solid ${selected ? '#2563EB' : '#0F1F3D'}`, background: selected ? '#0F2657' : '#080F1E', transition:'all 0.15s' }}
                onMouseEnter={e => { if(!selected) e.currentTarget.style.borderColor='#1E3A5F' }}
                onMouseLeave={e => { if(!selected) e.currentTarget.style.borderColor='#0F1F3D' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:`linear-gradient(135deg,#1E3A5F,#2563EB)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', color:'#93C5FD', flexShrink:0 }}>
                  {t.avatar}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:'#F1F5F9', fontSize:'13px', fontWeight:'600', margin:0 }}>{nom}</p>
                  <p style={{ color:'#334155', fontSize:'11px', margin:'2px 0 0' }}>
                    {t.departement} · {t.nb_incidents} incident(s) en charge
                  </p>
                </div>
                {selected && <span style={{ color:'#2563EB', fontSize:'16px', flexShrink:0 }}>✓</span>}
              </div>
            )
          })}
        </div>

        {/* Résumé + bouton */}
        <div>
          <div style={{ background:'#0A1628', borderRadius:'12px', padding:'20px', border:'1px solid #0F1F3D', marginBottom:'12px' }}>
            <p style={{ color:'#64748B', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 14px' }}>Résumé incident</p>
            {[
              ['Référence', id],
              ['Statut', incident.statut],
              ['Priorité', incident.priorite],
              ['Actuel', incident.technicien_nom || 'Non assigné'],
            ].map(([l, v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #0F1F3D' }}>
                <span style={{ color:'#334155', fontSize:'12px' }}>{l}</span>
                <span style={{ color:'#94A3B8', fontSize:'12px', fontFamily: l==='Référence' ? 'monospace' : 'inherit' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background:'#0A1628', borderRadius:'12px', padding:'20px', border:`1px solid ${choix ? '#2563EB33' : '#0F1F3D'}` }}>
            <p style={{ color:'#64748B', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 10px' }}>Nouvelle assignation</p>
            <p style={{ color: choix ? '#60A5FA' : '#334155', fontSize:'14px', fontWeight:'600', margin:'0 0 16px' }}>
              {choix || 'Non assigné'}
            </p>
            <button onClick={handleAssigner} disabled={loading}
              style={{ width:'100%', padding:'12px', background: loading ? '#1E293B' : 'linear-gradient(135deg,#2563EB,#1d4ed8)', color:'#fff', border:'none', borderRadius:'9px', fontSize:'13px', fontWeight:'600', cursor: loading ? 'not-allowed' : 'pointer', transition:'opacity 0.2s' }}>
              {loading ? 'Assignation...' : 'Confirmer l\'assignation'}
            </button>
            <button onClick={() => navigate(`/incidents/${id}`)}
              style={{ width:'100%', marginTop:'8px', padding:'10px', background:'transparent', border:'1px solid #1E293B', borderRadius:'9px', color:'#475569', fontSize:'13px', cursor:'pointer' }}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

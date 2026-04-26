import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIncidents, deleteIncident } from '../services/api'

const SC = { Nouveau:'#3B82F6', Assigné:'#F97316', 'En cours':'#F59E0B', Résolu:'#22C55E', Fermé:'#6B7280' }
const PC = { Haute:'#EF4444', Moyenne:'#F59E0B', Basse:'#22C55E' }

function Badge({ value, type='statut' }) {
  const c = (type==='priorite' ? PC : SC)[value] || '#6B7280'
  return <span style={{ padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background:`${c}20`, color:c, border:`1px solid ${c}40` }}>{value}</span>
}

export default function IncidentsListPage() {
  const [incidents, setIncidents]     = useState([])
  const [recherche, setRecherche]     = useState('')
  const [filtreStatut, setFS]         = useState('Tous')
  const [filtrePriorite, setFP]       = useState('Toutes')
  const [confirmDelete, setConfirmDel] = useState(null)
  const navigate = useNavigate()

  const load = () => getIncidents().then(setIncidents)
  useEffect(() => { load() }, [])

  const filtered = incidents.filter(i => {
    const q = recherche.toLowerCase()
    return (i.titre.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.utilisateur_nom.toLowerCase().includes(q))
      && (filtreStatut === 'Tous' || i.statut === filtreStatut)
      && (filtrePriorite === 'Toutes' || i.priorite === filtrePriorite)
  })

  const handleDelete = async (id) => {
    await deleteIncident(id)
    setConfirmDel(null)
    load()
  }

  return (
    <div style={{ padding:'32px', fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#050B18', minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
        <div>
          <h1 style={{ color:'#F8FAFC', fontSize:'22px', fontWeight:'800', margin:'0 0 4px', letterSpacing:'-0.3px' }}>Incidents</h1>
          <p style={{ color:'#475569', fontSize:'13px', margin:0 }}>{filtered.length} incident(s)</p>
        </div>
        <button onClick={() => navigate('/incidents/nouveau')}
          style={{ padding:'10px 18px', background:'linear-gradient(135deg,#2563EB,#1d4ed8)', color:'#fff', border:'none', borderRadius:'9px', fontSize:'13px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
          + Nouvel incident
        </button>
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'18px' }}>
        <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
          <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#334155', fontSize:'13px' }}>🔍</span>
          <input type="text" placeholder="Rechercher..." value={recherche} onChange={e => setRecherche(e.target.value)}
            style={{ width:'100%', padding:'9px 12px 9px 34px', background:'#0A1628', border:'1px solid #0F1F3D', borderRadius:'9px', color:'#F8FAFC', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
        </div>
        {[['Tous','Nouveau','Assigné','En cours','Résolu','Fermé'], ['Toutes','Haute','Moyenne','Basse']].map((opts, idx) => (
          <select key={idx} value={idx===0 ? filtreStatut : filtrePriorite} onChange={e => idx===0 ? setFS(e.target.value) : setFP(e.target.value)}
            style={{ padding:'9px 12px', background:'#0A1628', border:'1px solid #0F1F3D', borderRadius:'9px', color:'#F8FAFC', fontSize:'13px', outline:'none', cursor:'pointer' }}>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'#0A1628', borderRadius:'12px', border:'1px solid #0F1F3D', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#080F1E' }}>
              {['ID','Titre','Catégorie','Signalé par','Technicien','Priorité','Statut','Date','Actions'].map(h => (
                <th key={h} style={{ padding:'11px 14px', textAlign:'left', color:'#334155', fontSize:'10px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ padding:'48px', textAlign:'center', color:'#334155', fontSize:'14px' }}>Aucun incident trouvé</td></tr>
            ) : filtered.map(inc => (
              <tr key={inc.id} style={{ borderTop:'1px solid #0F1F3D', transition:'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background='#0F172A'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'11px 14px', color:'#2563EB', fontSize:'11px', fontFamily:'monospace', cursor:'pointer' }} onClick={() => navigate(`/incidents/${inc.id}`)}>{inc.id}</td>
                <td style={{ padding:'11px 14px', color:'#CBD5E1', fontSize:'12px', maxWidth:'180px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', cursor:'pointer' }} onClick={() => navigate(`/incidents/${inc.id}`)}>{inc.titre}</td>
                <td style={{ padding:'11px 14px', color:'#475569', fontSize:'12px' }}>{inc.categorie}</td>
                <td style={{ padding:'11px 14px', color:'#64748B', fontSize:'12px' }}>{inc.utilisateur_nom}</td>
                <td style={{ padding:'11px 14px', color:'#64748B', fontSize:'12px' }}>{inc.technicien_nom || <span style={{ color:'#1E293B', fontStyle:'italic' }}>Non assigné</span>}</td>
                <td style={{ padding:'11px 14px' }}><Badge value={inc.priorite} type="priorite" /></td>
                <td style={{ padding:'11px 14px' }}><Badge value={inc.statut} /></td>
                <td style={{ padding:'11px 14px', color:'#334155', fontSize:'11px', whiteSpace:'nowrap' }}>{new Date(inc.date_creation).toLocaleDateString('fr-FR')}</td>
                <td style={{ padding:'11px 14px' }}>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <button onClick={() => navigate(`/incidents/${inc.id}`)}
                      style={{ padding:'5px 10px', background:'#0F172A', border:'1px solid #1E293B', borderRadius:'6px', color:'#60A5FA', fontSize:'11px', cursor:'pointer' }}>Voir</button>
                    <button onClick={() => navigate(`/incidents/${inc.id}/modifier`)}
                      style={{ padding:'5px 10px', background:'#0F172A', border:'1px solid #1E293B', borderRadius:'6px', color:'#F59E0B', fontSize:'11px', cursor:'pointer' }}>✎</button>
                    <button onClick={() => setConfirmDel(inc.id)}
                      style={{ padding:'5px 10px', background:'#0F172A', border:'1px solid #1E293B', borderRadius:'6px', color:'#EF4444', fontSize:'11px', cursor:'pointer' }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(4px)' }}>
          <div style={{ background:'#0A1628', borderRadius:'14px', padding:'28px', maxWidth:'380px', width:'90%', border:'1px solid #1E293B' }}>
            <div style={{ fontSize:'32px', marginBottom:'12px', textAlign:'center' }}>⚠</div>
            <h3 style={{ color:'#F8FAFC', fontSize:'17px', fontWeight:'700', margin:'0 0 8px', textAlign:'center' }}>Supprimer l'incident ?</h3>
            <p style={{ color:'#64748B', fontSize:'13px', textAlign:'center', margin:'0 0 24px' }}>Cette action est irréversible. L'incident <strong style={{ color:'#2563EB' }}>{confirmDelete}</strong> sera définitivement supprimé.</p>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setConfirmDel(null)}
                style={{ flex:1, padding:'10px', background:'#0F172A', border:'1px solid #1E293B', borderRadius:'8px', color:'#94A3B8', cursor:'pointer', fontSize:'13px' }}>Annuler</button>
              <button onClick={() => handleDelete(confirmDelete)}
                style={{ flex:1, padding:'10px', background:'#EF4444', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

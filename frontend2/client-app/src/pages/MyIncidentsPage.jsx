import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMesIncidents, deleteIncident } from '../services/api'

const SC = { Nouveau:'#3B82F6', Assigné:'#F97316', 'En cours':'#F59E0B', Résolu:'#22C55E', Fermé:'#6B7280' }
const PC = { Haute:'#EF4444', Moyenne:'#F59E0B', Basse:'#22C55E' }

function Badge({ value, type='statut' }) {
  const c = (type==='priorite' ? PC : SC)[value] || '#6B7280'
  return <span style={{ padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background:`${c}18`, color:c, border:`1px solid ${c}33` }}>{value}</span>
}

export default function MyIncidentsPage() {
  const [incidents, setIncidents]   = useState([])
  const [confirmDel, setConfirmDel] = useState(null)
  const [filtre, setFiltre]         = useState('Tous')
  const navigate = useNavigate()

  const load = () => getMesIncidents().then(setIncidents)
  useEffect(() => { load() }, [])

  const STATUTS = ['Tous', 'Nouveau', 'Assigné', 'En cours', 'Résolu', 'Fermé']
  const filtered = filtre === 'Tous' ? incidents : incidents.filter(i => i.statut === filtre)

  const handleDelete = async (id) => {
    await deleteIncident(id)
    setConfirmDel(null)
    load()
  }

  return (
    <div style={{ padding:'20px', fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:'calc(100vh - 120px)', background:'#F8FAFC' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <div>
          <h1 style={{ fontSize:'18px', fontWeight:'700', color:'#111827', margin:'0 0 2px' }}>Mes tickets</h1>
          <p style={{ color:'#9CA3AF', fontSize:'13px', margin:0 }}>{filtered.length} incident(s)</p>
        </div>
        <button onClick={() => navigate('/creer')}
          style={{ padding:'8px 16px', background:'linear-gradient(135deg,#0F766E,#065F46)', color:'#fff', border:'none', borderRadius:'9px', fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>
          + Nouveau
        </button>
      </div>

      {/* Filtres statut */}
      <div style={{ display:'flex', gap:'6px', overflowX:'auto', marginBottom:'16px', paddingBottom:'4px' }}>
        {STATUTS.map(s => (
          <button key={s} onClick={() => setFiltre(s)}
            style={{ padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'500', border:`1px solid ${filtre===s ? '#0F766E' : '#E5E7EB'}`, background: filtre===s ? '#F0FDF4' : '#fff', color: filtre===s ? '#0F766E' : '#6B7280', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            {s}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>📭</div>
          <p style={{ color:'#9CA3AF', fontSize:'14px', marginBottom:'16px' }}>Aucun incident trouvé</p>
          <button onClick={() => navigate('/creer')}
            style={{ padding:'10px 20px', background:'linear-gradient(135deg,#0F766E,#065F46)', color:'#fff', border:'none', borderRadius:'9px', fontSize:'13px', cursor:'pointer' }}>
            Signaler un problème
          </button>
        </div>
      ) : (
        filtered.map(inc => (
          <div key={inc.id} style={{ background:'#fff', borderRadius:'12px', padding:'14px 16px', border:'1px solid #E5E7EB', marginBottom:'10px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px' }}>
              <div style={{ flex:1, cursor:'pointer' }} onClick={() => navigate(`/incidents/${inc.id}`)}>
                <div style={{ display:'flex', gap:'6px', marginBottom:'6px', flexWrap:'wrap' }}>
                  <span style={{ color:'#0F766E', fontSize:'11px', fontFamily:'monospace', fontWeight:'600' }}>{inc.id}</span>
                  <Badge value={inc.statut} />
                  <Badge value={inc.priorite} type="priorite" />
                </div>
                <p style={{ color:'#111827', fontSize:'14px', fontWeight:'600', margin:'0 0 4px', lineHeight:'1.3' }}>{inc.titre}</p>
                <p style={{ color:'#9CA3AF', fontSize:'12px', margin:0 }}>
                  {inc.technicien_nom ? `Technicien : ${inc.technicien_nom}` : 'En attente d\'assignation'}
                  {' · '}{new Date(inc.date_creation).toLocaleDateString('fr-FR')}
                </p>
              </div>
              {/* Actions */}
              <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                <button onClick={() => navigate(`/incidents/${inc.id}/modifier`)}
                  style={{ padding:'6px 10px', background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:'7px', color:'#D97706', fontSize:'12px', cursor:'pointer' }}>✎</button>
                <button onClick={() => setConfirmDel(inc.id)}
                  style={{ padding:'6px 10px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'7px', color:'#DC2626', fontSize:'12px', cursor:'pointer' }}>🗑</button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modal suppression */}
      {confirmDel && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(4px)', padding:'20px' }}>
          <div style={{ background:'#fff', borderRadius:'14px', padding:'24px', maxWidth:'340px', width:'100%' }}>
            <div style={{ fontSize:'28px', textAlign:'center', marginBottom:'12px' }}>⚠</div>
            <h3 style={{ color:'#111827', fontSize:'16px', fontWeight:'700', margin:'0 0 8px', textAlign:'center' }}>Supprimer ce ticket ?</h3>
            <p style={{ color:'#6B7280', fontSize:'13px', textAlign:'center', margin:'0 0 20px' }}>Cette action est irréversible.</p>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setConfirmDel(null)}
                style={{ flex:1, padding:'10px', background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:'8px', color:'#374151', cursor:'pointer', fontSize:'13px' }}>Annuler</button>
              <button onClick={() => handleDelete(confirmDel)}
                style={{ flex:1, padding:'10px', background:'#EF4444', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

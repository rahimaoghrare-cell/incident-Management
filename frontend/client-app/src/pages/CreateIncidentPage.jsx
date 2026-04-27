import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createIncident, updateIncident, getIncidentById } from '../services/api'

const CATEGORIES = ['Matériel','Logiciel','Réseau','Sécurité','Autre']
const PRIORITES  = ['Basse','Moyenne','Haute']

export default function CreateIncidentPage() {
  const navigate    = useNavigate()
  const { id }      = useParams()
  const isEdit      = !!id && id !== 'nouveau'

  const [form, setForm]       = useState({ titre:'', description:'', categorie:'Logiciel', priorite:'Moyenne' })
  const [fichier, setFichier] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erreurs, setErreurs] = useState({})
  const [succes, setSucces]   = useState(null)

  useEffect(() => {
    if (isEdit) getIncidentById(id).then(inc => inc && setForm({ titre:inc.titre, description:inc.description, categorie:inc.categorie, priorite:inc.priorite }))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }))

  const valider = () => {
    const e = {}
    if (!form.titre.trim())           e.titre       = 'Titre obligatoire'
    if (form.titre.length > 100)      e.titre       = 'Max 100 caractères'
    if (!form.description.trim())     e.description = 'Description obligatoire'
    if (form.description.length < 10) e.description = 'Minimum 10 caractères'
    return e
  }

  const handleFichier = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { alert('Seulement les images PNG/JPG'); return }
    if (f.size > 5*1024*1024)         { alert('Image trop grande (max 5 Mo)'); return }
    setFichier(f); setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = valider()
    if (Object.keys(errs).length) { setErreurs(errs); return }
    setErreurs({}); setLoading(true)
    try {
      if (isEdit) {
        await updateIncident(id, form)
        navigate('/incidents')
      } else {
        const inc = await createIncident({ ...form, capture: fichier?.name || null })
        setSucces(inc)
      }
    } finally { setLoading(false) }
  }

  // Écran succès
  if (succes) return (
    <div style={{ minHeight:'calc(100vh - 120px)', background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background:'#fff', borderRadius:'16px', padding:'32px', maxWidth:'380px', width:'100%', textAlign:'center', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'#F0FDF4', border:'2px solid #BBF7D0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'24px' }}>✓</div>
        <h2 style={{ color:'#111827', fontSize:'18px', fontWeight:'700', margin:'0 0 8px' }}>Ticket créé !</h2>
        <p style={{ color:'#6B7280', fontSize:'13px', margin:'0 0 20px' }}>Un technicien vous contactera dans les 2 heures.</p>
        <div style={{ background:'#F9FAFB', borderRadius:'10px', padding:'14px', marginBottom:'20px', border:'1px solid #E5E7EB', textAlign:'left' }}>
          {[['Référence',succes.id],['Titre',succes.titre],['Priorité',succes.priorite],['Statut','Nouveau']].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{ color:'#9CA3AF', fontSize:'12px' }}>{k}</span>
              <span style={{ color:'#111827', fontSize:'12px', fontWeight:'500' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={() => navigate('/incidents')}
            style={{ flex:1, padding:'10px', background:'linear-gradient(135deg,#0F766E,#065F46)', color:'#fff', border:'none', borderRadius:'9px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
            Voir mes tickets
          </button>
          <button onClick={() => { setSucces(null); setForm({ titre:'', description:'', categorie:'Logiciel', priorite:'Moyenne' }); setFichier(null); setPreview(null) }}
            style={{ flex:1, padding:'10px', background:'#F9FAFB', color:'#374151', border:'1px solid #E5E7EB', borderRadius:'9px', fontSize:'13px', cursor:'pointer' }}>
            Nouveau ticket
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:'calc(100vh - 120px)', background:'#F8FAFC' }}>
      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'12px 20px', display:'flex', alignItems:'center', gap:'10px' }}>
        <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'#6B7280', cursor:'pointer', fontSize:'14px', padding:0 }}>←</button>
        <span style={{ fontWeight:'600', fontSize:'15px', color:'#111827' }}>
          {isEdit ? 'Modifier le ticket' : 'Nouveau ticket'}
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ padding:'16px 20px' }}>

        {/* Titre */}
        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'block', color:'#374151', fontSize:'12px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'7px' }}>
            Titre <span style={{ color:'#EF4444' }}>*</span>
          </label>
          <input type="text" value={form.titre} onChange={e => set('titre', e.target.value)}
            placeholder="Ex : Imprimante ne fonctionne plus"
            maxLength={100}
            style={{ width:'100%', padding:'11px 14px', borderRadius:'10px', background:'#fff', border:`1.5px solid ${erreurs.titre?'#EF4444':'#E5E7EB'}`, color:'#111827', fontSize:'14px', outline:'none', boxSizing:'border-box' }} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'4px' }}>
            {erreurs.titre ? <p style={{ color:'#EF4444', fontSize:'11px', margin:0 }}>{erreurs.titre}</p> : <span/>}
            <p style={{ color:'#9CA3AF', fontSize:'11px', margin:0 }}>{form.titre.length}/100</p>
          </div>
        </div>

        {/* Catégorie + Priorité */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' }}>
          {[{label:'Catégorie', field:'categorie', opts:CATEGORIES}, {label:'Priorité', field:'priorite', opts:PRIORITES}].map(({label,field,opts}) => (
            <div key={field}>
              <label style={{ display:'block', color:'#374151', fontSize:'12px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'7px' }}>{label}</label>
              <select value={form[field]} onChange={e => set(field, e.target.value)}
                style={{ width:'100%', padding:'11px 12px', borderRadius:'10px', background:'#fff', border:'1.5px solid #E5E7EB', color:'#111827', fontSize:'13px', outline:'none', cursor:'pointer' }}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'block', color:'#374151', fontSize:'12px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'7px' }}>
            Description <span style={{ color:'#EF4444' }}>*</span>
          </label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={5}
            placeholder="Décrivez le problème : depuis quand, sur quel appareil, ce que vous avez déjà essayé..."
            style={{ width:'100%', padding:'11px 14px', borderRadius:'10px', background:'#fff', border:`1.5px solid ${erreurs.description?'#EF4444':'#E5E7EB'}`, color:'#111827', fontSize:'14px', outline:'none', resize:'vertical', boxSizing:'border-box', fontFamily:'inherit', lineHeight:'1.5' }} />
          {erreurs.description && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>{erreurs.description}</p>}
        </div>

        {/* Upload capture d'écran */}
        {!isEdit && (
          <div style={{ marginBottom:'20px' }}>
            <label style={{ display:'block', color:'#374151', fontSize:'12px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'7px' }}>
              Capture d'écran <span style={{ color:'#9CA3AF', fontWeight:'400', textTransform:'none', letterSpacing:'normal', fontSize:'12px' }}>(optionnel)</span>
            </label>
            <div onClick={() => document.getElementById('cap-cli').click()}
              style={{ border:`2px dashed ${preview?'#0F766E':'#D1D5DB'}`, borderRadius:'12px', padding:'20px', textAlign:'center', cursor:'pointer', background: preview?'#F0FDF4':'#F9FAFB', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#0F766E'}
              onMouseLeave={e => e.currentTarget.style.borderColor= preview ? '#0F766E' : '#D1D5DB'}>
              {preview ? (
                <div>
                  <img src={preview} alt="preview" style={{ maxHeight:'140px', maxWidth:'100%', borderRadius:'8px', marginBottom:'8px' }} />
                  <p style={{ color:'#0F766E', fontSize:'12px', margin:0 }}>{fichier.name} — cliquer pour changer</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize:'26px', margin:'0 0 6px' }}>📎</p>
                  <p style={{ color:'#374151', fontSize:'13px', fontWeight:'500', margin:'0 0 4px' }}>Cliquer pour ajouter une image</p>
                  <p style={{ color:'#9CA3AF', fontSize:'12px', margin:0 }}>PNG, JPG — max 5 Mo</p>
                </div>
              )}
            </div>
            <input id="cap-cli" type="file" accept="image/*" onChange={handleFichier} style={{ display:'none' }} />
            {fichier && (
              <button type="button" onClick={() => { setFichier(null); setPreview(null) }}
                style={{ marginTop:'6px', background:'none', border:'none', color:'#EF4444', fontSize:'12px', cursor:'pointer', padding:0 }}>
                ✕ Supprimer l'image
              </button>
            )}
          </div>
        )}

        <button type="submit" disabled={loading}
          style={{ width:'100%', padding:'13px', background: loading ? '#9CA3AF' : 'linear-gradient(135deg,#0F766E,#065F46)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor: loading?'not-allowed':'pointer' }}>
          {loading ? 'Enregistrement...' : isEdit ? 'Sauvegarder les modifications' : 'Créer le ticket'}
        </button>
        <p style={{ textAlign:'center', color:'#9CA3AF', fontSize:'12px', marginTop:'10px' }}>
          {isEdit ? '' : 'Un technicien prendra en charge votre incident dans les 2 heures.'}
        </p>
      </form>
    </div>
  )
}

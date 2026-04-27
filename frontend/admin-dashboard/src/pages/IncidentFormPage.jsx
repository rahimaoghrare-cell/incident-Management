import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createIncident, updateIncident, getIncidentById, getUsers } from '../services/api'

const CATEGORIES = ['Matériel','Logiciel','Réseau','Sécurité','Autre']
const PRIORITES  = ['Basse','Moyenne','Haute']
const STATUTS    = ['Nouveau','Assigné','En cours','Résolu','Fermé']

export default function IncidentFormPage() {
  const { id } = useParams()
  const isEdit  = !!id && id !== 'nouveau'
  const navigate = useNavigate()

  const [form, setForm]         = useState({ titre:'', description:'', categorie:'Logiciel', priorite:'Moyenne', statut:'Nouveau', technicien_nom:'' })
  const [techniciens, setTechs] = useState([])
  const [loading, setLoading]   = useState(false)
  const [erreurs, setErreurs]   = useState({})
  const [fichier, setFichier]   = useState(null)
  const [preview, setPreview]   = useState(null)

  useEffect(() => {
    getUsers().then(u => setTechs(u.filter(x => x.role === 'Technicien')))
    if (isEdit) getIncidentById(id).then(inc => inc && setForm({ titre:inc.titre, description:inc.description, categorie:inc.categorie, priorite:inc.priorite, statut:inc.statut, technicien_nom:inc.technicien_nom||'' }))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const valider = () => {
    const e = {}
    if (!form.titre.trim())            e.titre       = 'Titre obligatoire'
    if (form.titre.length > 100)       e.titre       = 'Max 100 caractères'
    if (!form.description.trim())      e.description = 'Description obligatoire'
    if (form.description.length < 10)  e.description = 'Min 10 caractères'
    return e
  }

  const handleFichier = (e) => {
    const f = e.target.files[0]
    if (!f || !f.type.startsWith('image/')) return
    if (f.size > 5*1024*1024) { alert('Image max 5 Mo'); return }
    setFichier(f); setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = valider()
    if (Object.keys(errs).length) { setErreurs(errs); return }
    setErreurs({}); setLoading(true)
    try {
      if (isEdit) await updateIncident(id, form)
      else await createIncident({ ...form, capture: fichier?.name || null })
      navigate('/incidents')
    } finally { setLoading(false) }
  }

  const Input = ({ label, field, placeholder, maxLen, required }) => (
    <div style={{ marginBottom:'18px' }}>
      <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'7px' }}>
        {label} {required && <span style={{ color:'#EF4444' }}>*</span>}
      </label>
      <input type="text" value={form[field]} onChange={e => set(field, e.target.value)} placeholder={placeholder} maxLength={maxLen}
        style={{ width:'100%', padding:'11px 14px', borderRadius:'9px', background:'#080F1E', border:`1.5px solid ${erreurs[field] ? '#EF4444' : '#0F1F3D'}`, color:'#F8FAFC', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
      {erreurs[field] && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>{erreurs[field]}</p>}
      {maxLen && <p style={{ color:'#334155', fontSize:'10px', margin:'3px 0 0', textAlign:'right' }}>{form[field].length}/{maxLen}</p>}
    </div>
  )

  return (
    <div style={{ padding:'32px', fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#050B18', minHeight:'100vh' }}>
      <button onClick={() => navigate('/incidents')} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:'13px', padding:0, marginBottom:'20px', display:'flex', alignItems:'center', gap:'6px' }}>
        ← Retour aux incidents
      </button>

      <h1 style={{ color:'#F8FAFC', fontSize:'22px', fontWeight:'800', margin:'0 0 24px', letterSpacing:'-0.3px' }}>
        {isEdit ? `Modifier — ${id}` : 'Nouvel incident'}
      </h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'20px', alignItems:'start' }}>
        {/* Colonne principale */}
        <form onSubmit={handleSubmit}>
          <div style={{ background:'#0A1628', borderRadius:'12px', padding:'24px', border:'1px solid #0F1F3D', marginBottom:'16px' }}>
            <h3 style={{ color:'#64748B', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 18px' }}>Informations principales</h3>
            <Input label="Titre" field="titre" placeholder="Ex: Imprimante ne fonctionne plus" maxLen={100} required />
            <div style={{ marginBottom:'18px' }}>
              <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'7px' }}>
                Description <span style={{ color:'#EF4444' }}>*</span>
              </label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={5}
                placeholder="Décrivez le problème en détail..."
                style={{ width:'100%', padding:'11px 14px', borderRadius:'9px', background:'#080F1E', border:`1.5px solid ${erreurs.description ? '#EF4444' : '#0F1F3D'}`, color:'#F8FAFC', fontSize:'13px', outline:'none', resize:'vertical', boxSizing:'border-box', fontFamily:'inherit', lineHeight:'1.5' }} />
              {erreurs.description && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>{erreurs.description}</p>}
            </div>

            {/* Upload capture */}
            <div>
              <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'7px' }}>
                Capture d'écran <span style={{ color:'#334155', fontWeight:'400', textTransform:'none' }}>(optionnel)</span>
              </label>
              <div onClick={() => document.getElementById('cap-input').click()}
                style={{ border:`2px dashed ${preview ? '#2563EB' : '#1E293B'}`, borderRadius:'10px', padding:'20px', textAlign:'center', cursor:'pointer', background:'#080F1E', transition:'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='#2563EB'}
                onMouseLeave={e => e.currentTarget.style.borderColor= preview ? '#2563EB' : '#1E293B'}>
                {preview ? (
                  <div>
                    <img src={preview} alt="preview" style={{ maxHeight:'120px', maxWidth:'100%', borderRadius:'6px', marginBottom:'6px' }} />
                    <p style={{ color:'#60A5FA', fontSize:'12px', margin:0 }}>{fichier.name} — cliquer pour changer</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize:'24px', margin:'0 0 6px' }}>📎</p>
                    <p style={{ color:'#475569', fontSize:'12px', margin:0 }}>Glisser une image ou cliquer — PNG, JPG, max 5 Mo</p>
                  </div>
                )}
              </div>
              <input id="cap-input" type="file" accept="image/*" onChange={handleFichier} style={{ display:'none' }} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'13px', background: loading ? '#1E3A5F' : 'linear-gradient(135deg,#2563EB,#1d4ed8)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : 'Créer l\'incident'}
          </button>
        </form>

        {/* Colonne latérale */}
        <div>
          <div style={{ background:'#0A1628', borderRadius:'12px', padding:'20px', border:'1px solid #0F1F3D', marginBottom:'16px' }}>
            <h3 style={{ color:'#64748B', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 16px' }}>Paramètres</h3>
            {[
              { label:'Catégorie', field:'categorie', opts:CATEGORIES },
              { label:'Priorité',  field:'priorite',  opts:PRIORITES },
              ...(isEdit ? [{ label:'Statut', field:'statut', opts:STATUTS }] : []),
            ].map(({ label, field, opts }) => (
              <div key={field} style={{ marginBottom:'14px' }}>
                <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>{label}</label>
                <select value={form[field]} onChange={e => set(field, e.target.value)}
                  style={{ width:'100%', padding:'10px 12px', background:'#080F1E', border:'1.5px solid #0F1F3D', borderRadius:'9px', color:'#F8FAFC', fontSize:'13px', outline:'none', cursor:'pointer' }}>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Assignation technicien */}
          <div style={{ background:'#0A1628', borderRadius:'12px', padding:'20px', border:'1px solid #0F1F3D' }}>
            <h3 style={{ color:'#64748B', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 14px' }}>Assigner à</h3>
            <div onClick={() => set('technicien_nom', '')}
              style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'8px', marginBottom:'6px', cursor:'pointer', border:`1px solid ${!form.technicien_nom ? '#2563EB' : '#0F1F3D'}`, background: !form.technicien_nom ? '#0F2657' : 'transparent' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'#1E293B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px' }}>—</div>
              <span style={{ color:'#64748B', fontSize:'12px' }}>Non assigné</span>
            </div>
            {techniciens.map(t => (
              <div key={t.id} onClick={() => set('technicien_nom', `${t.prenom} ${t.nom}`)}
                style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'8px', marginBottom:'6px', cursor:'pointer', border:`1px solid ${form.technicien_nom === `${t.prenom} ${t.nom}` ? '#2563EB' : '#0F1F3D'}`, background: form.technicien_nom === `${t.prenom} ${t.nom}` ? '#0F2657' : 'transparent', transition:'all 0.15s' }}>
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,#1E3A5F,#2563EB)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'700', color:'#93C5FD' }}>{t.avatar}</div>
                <div>
                  <p style={{ color:'#CBD5E1', fontSize:'12px', fontWeight:'500', margin:0 }}>{t.prenom} {t.nom}</p>
                  <p style={{ color:'#334155', fontSize:'10px', margin:0 }}>{t.nb_incidents} incidents</p>
                </div>
                {form.technicien_nom === `${t.prenom} ${t.nom}` && <span style={{ marginLeft:'auto', color:'#2563EB', fontSize:'14px' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

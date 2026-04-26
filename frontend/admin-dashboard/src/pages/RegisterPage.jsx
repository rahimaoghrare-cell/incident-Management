// Inscription Technicien — Dashboard Admin
// Département fixé : Service Informatique (seul département possible)
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const emailValide = (e) => /^[^\s@]+@usms\.ac\.ma$/i.test(e)
const mdpFort     = (p) => p.length >= 8

const suggererEmail = (prenom, nom) => {
  if (!prenom || !nom) return ''
  const clean = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '')
  return `${clean(prenom)}.${clean(nom)}@usms.ac.ma`
}

export default function RegisterPage() {
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ prenom:'', nom:'', email:'', password:'', confirm:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [erreurs, setErreurs] = useState({})
  const [loading, setLoading] = useState(false)
  const [succes, setSucces]   = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleNomBlur = () => {
    if (form.prenom && form.nom && !form.email) {
      set('email', suggererEmail(form.prenom, form.nom))
    }
  }

  const valider = () => {
    const e = {}
    if (!form.prenom.trim())            e.prenom   = 'Prénom obligatoire'
    if (!form.nom.trim())               e.nom      = 'Nom obligatoire'
    if (!emailValide(form.email))       e.email    = 'Adresse email invalide'
    if (!mdpFort(form.password))        e.password = 'Minimum 8 caractères'
    if (form.password !== form.confirm) e.confirm  = 'Mots de passe différents'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = valider()
    if (Object.keys(errs).length) { setErreurs(errs); return }
    setErreurs({}); setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    // Production : POST /api/users/register (Membre 2 — Keycloak)
    setLoading(false); setSucces(true)
  }

  if (succes) return (
    <div style={{ minHeight:'100vh', background:'#050B18', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ background:'#0A1628', borderRadius:'16px', padding:'48px 40px', maxWidth:'440px', width:'90%', textAlign:'center', border:'1px solid #1E293B' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(34,197,94,0.15)', border:'2px solid #22C55E', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'28px' }}>✓</div>
        <h2 style={{ color:'#F8FAFC', fontSize:'22px', fontWeight:'700', margin:'0 0 12px' }}>Demande envoyée !</h2>
        <p style={{ color:'#64748B', fontSize:'14px', margin:'0 0 6px' }}>Votre demande de compte technicien a été soumise pour</p>
        <p style={{ color:'#60A5FA', fontSize:'14px', fontFamily:'monospace', margin:'0 0 16px' }}>{form.email}</p>
        <div style={{ background:'#0F172A', borderRadius:'10px', padding:'14px', border:'1px solid #1E293B', marginBottom:'24px', textAlign:'left' }}>
          <p style={{ color:'#94A3B8', fontSize:'12px', margin:'0 0 6px', fontWeight:'600' }}>Informations du compte :</p>
          <p style={{ color:'#64748B', fontSize:'12px', margin:'0 0 3px' }}>Rôle : <span style={{ color:'#60A5FA' }}>Technicien</span></p>
          <p style={{ color:'#64748B', fontSize:'12px', margin:0 }}>Département : <span style={{ color:'#60A5FA' }}>Service Informatique</span></p>
        </div>
        <p style={{ color:'#475569', fontSize:'13px', margin:'0 0 24px', lineHeight:'1.5' }}>
          Un administrateur va valider votre accès. Vous recevrez un email de confirmation.
        </p>
        <button onClick={() => navigate('/login')}
          style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#2563EB,#1d4ed8)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
          Retour à la connexion
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#050B18', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 16px', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ width:'100%', maxWidth:'480px' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'9px', background:'linear-gradient(135deg,#2563EB,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'17px' }}>🛡</div>
            <span style={{ color:'#F8FAFC', fontSize:'16px', fontWeight:'700' }}>GestIncident — ENSA</span>
          </div>
          <h1 style={{ color:'#F8FAFC', fontSize:'22px', fontWeight:'700', margin:'0 0 6px' }}>Créer un compte technicien</h1>
          <p style={{ color:'#64748B', fontSize:'13px', margin:0 }}>Réservé au personnel du Service Informatique</p>
        </div>

        <div style={{ background:'#0A1628', borderRadius:'14px', padding:'28px', border:'1px solid #1E293B' }}>

          {/* Badge département fixé */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 14px', background:'#0F2657', borderRadius:'10px', border:'1px solid #1E3A5F', marginBottom:'24px' }}>
            <span style={{ fontSize:'18px' }}>🏢</span>
            <div>
              <p style={{ color:'#94A3B8', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 2px' }}>Département assigné automatiquement</p>
              <p style={{ color:'#60A5FA', fontSize:'14px', fontWeight:'600', margin:0 }}>Service Informatique</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Prénom + Nom */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              {[['prenom','Prénom','Hasnae'],['nom','Nom','Zouhiri']].map(([f,l,p]) => (
                <div key={f} style={{ marginBottom:'16px' }}>
                  <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                    {l} <span style={{ color:'#EF4444' }}>*</span>
                  </label>
                  <input type="text" value={form[f]} onChange={e => set(f, e.target.value)}
                    onBlur={f==='nom' ? handleNomBlur : undefined}
                    placeholder={p}
                    style={{ width:'100%', padding:'11px 12px', borderRadius:'9px', background:'#0F172A', border:`1.5px solid ${erreurs[f]?'#EF4444':'#1E293B'}`, color:'#F8FAFC', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
                  {erreurs[f] && <p style={{ color:'#EF4444', fontSize:'11px', margin:'3px 0 0' }}>{erreurs[f]}</p>}
                </div>
              ))}
            </div>

            {/* Email */}
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                Email institutionnel <span style={{ color:'#EF4444' }}>*</span>
              </label>
              <input type="text" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="prenom.nom@usms.ac.ma"
                style={{ width:'100%', padding:'11px 14px', borderRadius:'9px', background:'#0F172A', border:`1.5px solid ${erreurs.email?'#EF4444':emailValide(form.email)&&form.email?'#22C55E':'#1E293B'}`, color:'#F8FAFC', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
              {erreurs.email  && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>{erreurs.email}</p>}
              {!erreurs.email && emailValide(form.email) && form.email && <p style={{ color:'#22C55E', fontSize:'11px', margin:'4px 0 0' }}>✓ Format valide</p>}
              {!form.email && form.prenom && form.nom && <p style={{ color:'#475569', fontSize:'11px', margin:'4px 0 0' }}>Suggestion : {suggererEmail(form.prenom, form.nom)}</p>}
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                Mot de passe <span style={{ color:'#EF4444' }}>*</span>
              </label>
              <div style={{ position:'relative' }}>
                <input type={showPwd?'text':'password'} value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="Minimum 8 caractères"
                  style={{ width:'100%', padding:'11px 40px 11px 14px', borderRadius:'9px', background:'#0F172A', border:`1.5px solid ${erreurs.password?'#EF4444':mdpFort(form.password)&&form.password?'#22C55E':'#1E293B'}`, color:'#F8FAFC', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:'14px' }}>
                  {showPwd?'🙈':'👁'}
                </button>
              </div>
              {form.password && (
                <div style={{ display:'flex', gap:'3px', marginTop:'6px' }}>
                  {[...Array(4)].map((_,i) => (
                    <div key={i} style={{ flex:1, height:'3px', borderRadius:'2px', background: i < Math.min(Math.floor(form.password.length/3),4) ? (form.password.length<8?'#EF4444':form.password.length<12?'#F59E0B':'#22C55E') : '#1E293B' }} />
                  ))}
                </div>
              )}
              {erreurs.password && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>{erreurs.password}</p>}
            </div>

            {/* Confirmation */}
            <div style={{ marginBottom:'24px' }}>
              <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                Confirmer le mot de passe <span style={{ color:'#EF4444' }}>*</span>
              </label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                placeholder="Répéter le mot de passe"
                style={{ width:'100%', padding:'11px 14px', borderRadius:'9px', background:'#0F172A', border:`1.5px solid ${erreurs.confirm?'#EF4444':form.confirm&&form.confirm===form.password?'#22C55E':'#1E293B'}`, color:'#F8FAFC', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
              {erreurs.confirm && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>{erreurs.confirm}</p>}
              {form.confirm && form.confirm===form.password && form.password && <p style={{ color:'#22C55E', fontSize:'11px', margin:'4px 0 0' }}>✓ Mots de passe identiques</p>}
            </div>

            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'13px', background:loading?'#1E3A5F':'linear-gradient(135deg,#2563EB,#1d4ed8)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:loading?'not-allowed':'pointer', marginBottom:'16px' }}>
              {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
            </button>

            <p style={{ textAlign:'center', color:'#475569', fontSize:'13px', margin:0 }}>
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color:'#60A5FA', fontWeight:'600', textDecoration:'none' }}>Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

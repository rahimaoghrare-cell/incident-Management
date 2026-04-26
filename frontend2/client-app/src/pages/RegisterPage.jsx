// Inscription Utilisateur — App Client
// Utilisateur = n'importe quelle personne de l'ENSA
// (étudiant, professeur, personnel administratif)
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { DEPARTEMENTS_UTILISATEUR } from '../services/mockData'

const emailValide = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const mdpFort     = (p) => p.length >= 8

const suggererEmail = (prenom, nom) => {
  if (!prenom || !nom) return ''
  const clean = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'')
  return `${clean(prenom)}.${clean(nom)}@ensa.ma`
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ prenom:'', nom:'', email:'', password:'', confirm:'', departement:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [erreurs, setErreurs] = useState({})
  const [loading, setLoading] = useState(false)
  const [succes, setSucces]   = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleNomBlur = () => {
    if (form.prenom && form.nom && !form.email)
      set('email', suggererEmail(form.prenom, form.nom))
  }

  const valider = () => {
    const e = {}
    if (!form.prenom.trim())            e.prenom      = 'Prénom obligatoire'
    if (!form.nom.trim())               e.nom         = 'Nom obligatoire'
    if (!emailValide(form.email))       e.email       = 'Email invalide'
    if (!mdpFort(form.password))        e.password    = 'Minimum 8 caractères'
    if (form.password !== form.confirm) e.confirm     = 'Mots de passe différents'
    if (!form.departement)              e.departement = 'Choisissez un département'
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
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#EFF6FF,#F0FDF4)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ background:'#fff', borderRadius:'16px', padding:'48px 40px', maxWidth:'440px', width:'90%', textAlign:'center', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'#F0FDF4', border:'2px solid #10B981', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'28px' }}>✓</div>
        <h2 style={{ color:'#111827', fontSize:'22px', fontWeight:'700', margin:'0 0 12px' }}>Compte créé !</h2>
        <p style={{ color:'#6B7280', fontSize:'14px', margin:'0 0 6px' }}>Email de confirmation envoyé à</p>
        <p style={{ color:'#0F766E', fontSize:'14px', fontFamily:'monospace', margin:'0 0 16px' }}>{form.email}</p>
        <div style={{ background:'#F9FAFB', borderRadius:'10px', padding:'14px', border:'1px solid #E5E7EB', marginBottom:'20px', textAlign:'left' }}>
          <p style={{ color:'#6B7280', fontSize:'12px', margin:'0 0 4px', fontWeight:'600' }}>Informations du compte :</p>
          <p style={{ color:'#374151', fontSize:'12px', margin:'0 0 2px' }}>Rôle : <span style={{ color:'#0F766E', fontWeight:'600' }}>Utilisateur</span></p>
          <p style={{ color:'#374151', fontSize:'12px', margin:0 }}>Département : <span style={{ color:'#0F766E', fontWeight:'600' }}>{form.departement}</span></p>
        </div>
        <p style={{ color:'#6B7280', fontSize:'13px', margin:'0 0 24px', lineHeight:'1.5' }}>
          Vous pouvez vous connecter dès maintenant pour signaler vos incidents.
        </p>
        <button onClick={() => navigate('/login')}
          style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#0F766E,#065F46)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
          Se connecter
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#EFF6FF,#F0FDF4)', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 16px', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ width:'100%', maxWidth:'500px' }}>
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'9px', background:'linear-gradient(135deg,#0F766E,#065F46)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'17px' }}>🖥</div>
            <span style={{ color:'#111827', fontSize:'16px', fontWeight:'700' }}>Support ENSA</span>
          </div>
          <h1 style={{ color:'#111827', fontSize:'22px', fontWeight:'700', margin:'0 0 6px' }}>Créer un compte</h1>
          <p style={{ color:'#6B7280', fontSize:'13px', margin:0 }}>Pour signaler et suivre vos incidents informatiques</p>
        </div>

        <div style={{ background:'#fff', borderRadius:'14px', padding:'28px', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', border:'1px solid #E5E7EB' }}>
          <form onSubmit={handleSubmit}>

            {/* Prénom + Nom */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              {[['prenom','Prénom','Chaymae'],['nom','Nom','Alaoui']].map(([f,l,p]) => (
                <div key={f} style={{ marginBottom:'16px' }}>
                  <label style={{ display:'block', color:'#374151', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                    {l} <span style={{ color:'#EF4444' }}>*</span>
                  </label>
                  <input type="text" value={form[f]} onChange={e => set(f, e.target.value)}
                    onBlur={f==='nom' ? handleNomBlur : undefined}
                    placeholder={p}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', background:'#F9FAFB', border:`1.5px solid ${erreurs[f]?'#EF4444':'#E5E7EB'}`, color:'#111827', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
                  {erreurs[f] && <p style={{ color:'#EF4444', fontSize:'11px', margin:'3px 0 0' }}>{erreurs[f]}</p>}
                </div>
              ))}
            </div>

            {/* Email — libre */}
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', color:'#374151', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                Email <span style={{ color:'#EF4444' }}>*</span>
              </label>
              <input type="text" value={form.email} onChange={e => set('email', e.target.value)} placeholder="votre.email@ensa.ma"
                style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', background:'#F9FAFB', border:`1.5px solid ${erreurs.email?'#EF4444':emailValide(form.email)&&form.email?'#10B981':'#E5E7EB'}`, color:'#111827', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
              {erreurs.email && <p style={{ color:'#EF4444', fontSize:'11px', margin:'3px 0 0' }}>{erreurs.email}</p>}
              {!erreurs.email && emailValide(form.email) && form.email && <p style={{ color:'#10B981', fontSize:'11px', margin:'3px 0 0' }}>✓ Email valide</p>}
              {!form.email && form.prenom && form.nom && (
                <p style={{ color:'#6B7280', fontSize:'11px', margin:'3px 0 0', cursor:'pointer' }}
                  onClick={() => set('email', suggererEmail(form.prenom, form.nom))}>
                  Suggestion : <span style={{ color:'#0F766E', textDecoration:'underline' }}>{suggererEmail(form.prenom, form.nom)}</span>
                </p>
              )}
            </div>

            {/* Département — tous les départements ENSA */}
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', color:'#374151', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                Département <span style={{ color:'#EF4444' }}>*</span>
              </label>
              <select value={form.departement} onChange={e => set('departement', e.target.value)}
                style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', background:'#F9FAFB', border:`1.5px solid ${erreurs.departement?'#EF4444':'#E5E7EB'}`, color:form.departement?'#111827':'#9CA3AF', fontSize:'13px', outline:'none', cursor:'pointer', boxSizing:'border-box' }}>
                <option value="" disabled>-- Choisir votre département --</option>
                {DEPARTEMENTS_UTILISATEUR.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {erreurs.departement && <p style={{ color:'#EF4444', fontSize:'11px', margin:'3px 0 0' }}>{erreurs.departement}</p>}
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', color:'#374151', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                Mot de passe <span style={{ color:'#EF4444' }}>*</span>
              </label>
              <div style={{ position:'relative' }}>
                <input type={showPwd?'text':'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 caractères"
                  style={{ width:'100%', padding:'10px 40px 10px 12px', borderRadius:'8px', background:'#F9FAFB', border:`1.5px solid ${erreurs.password?'#EF4444':mdpFort(form.password)&&form.password?'#10B981':'#E5E7EB'}`, color:'#111827', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#9CA3AF', cursor:'pointer', fontSize:'13px' }}>{showPwd?'🙈':'👁'}</button>
              </div>
              {form.password && <div style={{ display:'flex', gap:'3px', marginTop:'5px' }}>{[...Array(4)].map((_,i) => <div key={i} style={{ flex:1, height:'3px', borderRadius:'2px', background:i<Math.min(Math.floor(form.password.length/3),4)?(form.password.length<8?'#EF4444':form.password.length<12?'#F59E0B':'#10B981'):'#E5E7EB' }} />)}</div>}
              {erreurs.password && <p style={{ color:'#EF4444', fontSize:'11px', margin:'3px 0 0' }}>{erreurs.password}</p>}
            </div>

            {/* Confirmation */}
            <div style={{ marginBottom:'24px' }}>
              <label style={{ display:'block', color:'#374151', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                Confirmer <span style={{ color:'#EF4444' }}>*</span>
              </label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Répéter le mot de passe"
                style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', background:'#F9FAFB', border:`1.5px solid ${erreurs.confirm?'#EF4444':form.confirm&&form.confirm===form.password?'#10B981':'#E5E7EB'}`, color:'#111827', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
              {erreurs.confirm && <p style={{ color:'#EF4444', fontSize:'11px', margin:'3px 0 0' }}>{erreurs.confirm}</p>}
              {form.confirm && form.confirm===form.password && form.password && <p style={{ color:'#10B981', fontSize:'11px', margin:'3px 0 0' }}>✓ Mots de passe identiques</p>}
            </div>

            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'13px', background:loading?'#9CA3AF':'linear-gradient(135deg,#0F766E,#065F46)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:loading?'not-allowed':'pointer', marginBottom:'14px' }}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>

            <p style={{ textAlign:'center', color:'#6B7280', fontSize:'13px', margin:0 }}>
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color:'#0F766E', fontWeight:'600', textDecoration:'none' }}>Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'

// Validation : n'importe quel email valide accepté
const emailValide = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [erreur, setErreur]     = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const emailOk = emailValide(email)
  const mdpOk   = password.length >= 8

  const handleSubmit = async (e) => {
    e.preventDefault(); setErreur('')
    if (!emailOk) { setErreur('Adresse email invalide'); return }
    if (!mdpOk)   { setErreur('Mot de passe : minimum 8 caractères'); return }
    setLoading(true)
    try { await login(email, password); navigate('/') }
    catch (err) { setErreur(err.message || 'Identifiants incorrects') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#050B18', display:'flex', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Panneau gauche */}
      <div style={{ flex:'0 0 42%', background:'linear-gradient(135deg,#0F2657 0%,#1a3a8f 60%,#0d2240 100%)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 50px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'320px', height:'320px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'280px', height:'280px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'48px' }}>
            <div style={{ width:'42px', height:'42px', borderRadius:'10px', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', border:'1px solid rgba(255,255,255,0.15)' }}>🛡</div>
            <span style={{ color:'#fff', fontSize:'18px', fontWeight:'700' }}>GestIncident</span>
          </div>
          <h1 style={{ color:'#fff', fontSize:'32px', fontWeight:'800', lineHeight:'1.2', margin:'0 0 16px', letterSpacing:'-0.5px' }}>Espace<br/>Technicien</h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'14px', lineHeight:'1.6', margin:'0 0 40px' }}>
            Gérez les incidents, assignez les tâches et suivez les résolutions en temps réel.
          </p>
          {[{ icon:'⚡', label:'Traitement en temps réel' },{ icon:'🔒', label:'Sécurisé via Keycloak' },{ icon:'📊', label:'Tableau de bord analytique' }].map(f => (
            <div key={f.label} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
              <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px' }}>{f.icon}</div>
              <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'13px' }}>{f.label}</span>
            </div>
          ))}
          <div style={{ marginTop:'40px', paddingTop:'24px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'12px', margin:'0 0 8px' }}>Vous êtes utilisateur ?</p>
            <a href="http://localhost:3001" style={{ color:'#60A5FA', fontSize:'13px', fontWeight:'500', textDecoration:'none' }}>
              → Accéder à l'espace utilisateur
            </a>
          </div>
        </div>
      </div>

      {/* Panneau droit */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 32px' }}>
        <div style={{ width:'100%', maxWidth:'400px' }}>
          <div style={{ marginBottom:'32px' }}>
            <h2 style={{ color:'#F8FAFC', fontSize:'26px', fontWeight:'700', margin:'0 0 8px', letterSpacing:'-0.3px' }}>Connexion</h2>
            <p style={{ color:'#64748B', fontSize:'14px', margin:0 }}>Espace réservé aux techniciens</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'18px' }}>
              <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'7px' }}>Email</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color:'#475569', fontSize:'15px' }}>✉</span>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre.email@ensa.ma"
                  style={{ width:'100%', padding:'12px 14px 12px 40px', borderRadius:'10px', background:'#0F172A', border:`1.5px solid ${email&&!emailOk?'#EF4444':email&&emailOk?'#22C55E':'#1E293B'}`, color:'#F8FAFC', fontSize:'14px', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }} />
              </div>
              {email && !emailOk && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>Format email invalide</p>}
            </div>

            <div style={{ marginBottom:'8px' }}>
              <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'7px' }}>Mot de passe</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color:'#475569', fontSize:'15px' }}>🔑</span>
                <input type={showPwd?'text':'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 caractères"
                  style={{ width:'100%', padding:'12px 44px 12px 40px', borderRadius:'10px', background:'#0F172A', border:`1.5px solid ${password&&!mdpOk?'#EF4444':password&&mdpOk?'#22C55E':'#1E293B'}`, color:'#F8FAFC', fontSize:'14px', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:'15px' }}>{showPwd?'🙈':'👁'}</button>
              </div>
              {password && !mdpOk && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>{8-password.length} caractère(s) manquant(s)</p>}
            </div>

            <div style={{ textAlign:'right', marginBottom:'20px' }}>
              <Link to="/mot-de-passe-oublie" style={{ color:'#60A5FA', fontSize:'12px', textDecoration:'none' }}>Mot de passe oublié ?</Link>
            </div>

            {erreur && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'11px 14px', color:'#FCA5A5', fontSize:'13px', marginBottom:'20px', display:'flex', gap:'8px', alignItems:'center' }}><span>⚠</span>{erreur}</div>}

            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'13px', borderRadius:'10px', background:loading?'#1E3A5F':'linear-gradient(135deg,#2563EB,#1d4ed8)', color:'#fff', border:'none', fontSize:'15px', fontWeight:'600', cursor:loading?'not-allowed':'pointer', marginBottom:'16px' }}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <div style={{ textAlign:'center', padding:'16px', background:'#0F172A', borderRadius:'10px', border:'1px solid #1E293B' }}>
            <p style={{ color:'#64748B', fontSize:'13px', margin:'0 0 8px' }}>Pas encore de compte ?</p>
            <Link to="/inscription" style={{ color:'#60A5FA', fontSize:'13px', fontWeight:'600', textDecoration:'none' }}>Créer un compte technicien →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

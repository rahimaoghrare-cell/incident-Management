import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'

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
    try { await login(email, password); navigate('/chat') }
    catch (err) { setErreur(err.message || 'Identifiants incorrects') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#EFF6FF 0%,#F0FDF4 100%)', display:'flex', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Panneau gauche */}
      <div style={{ flex:'0 0 42%', background:'linear-gradient(135deg,#0F766E 0%,#065F46 100%)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 50px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'260px', height:'260px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-40px', width:'300px', height:'300px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'48px' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>🖥</div>
            <span style={{ color:'#fff', fontSize:'17px', fontWeight:'700' }}>Support ENSA</span>
          </div>
          <h1 style={{ color:'#fff', fontSize:'32px', fontWeight:'800', lineHeight:'1.2', margin:'0 0 14px', letterSpacing:'-0.5px' }}>Signalez vos<br/>incidents facilement</h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'14px', lineHeight:'1.6', margin:'0 0 36px' }}>Notre bot IA cherche des solutions existantes avant de créer un ticket.</p>
          {[{ icon:'🤖', label:'Bot IA pour solutions rapides' },{ icon:'📋', label:'Suivi en temps réel' },{ icon:'💬', label:'Communication avec les techniciens' }].map(f => (
            <div key={f.label} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
              <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px' }}>{f.icon}</div>
              <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'13px' }}>{f.label}</span>
            </div>
          ))}
          <div style={{ marginTop:'36px', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'12px', margin:'0 0 8px' }}>Vous êtes technicien ?</p>
            <a href="http://localhost:3000" style={{ color:'#A7F3D0', fontSize:'13px', fontWeight:'500', textDecoration:'none' }}>→ Accéder au Dashboard Admin</a>
          </div>
        </div>
      </div>

      {/* Panneau droit */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 32px' }}>
        <div style={{ width:'100%', maxWidth:'400px' }}>
          <div style={{ marginBottom:'28px' }}>
            <h2 style={{ color:'#111827', fontSize:'26px', fontWeight:'700', margin:'0 0 8px', letterSpacing:'-0.3px' }}>Connexion</h2>
            <p style={{ color:'#6B7280', fontSize:'14px', margin:0 }}>Accédez à votre espace de support</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', color:'#374151', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'7px' }}>Email</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', fontSize:'14px' }}>✉</span>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre.email@ensa.ma"
                  style={{ width:'100%', padding:'12px 14px 12px 38px', borderRadius:'10px', background:'#F9FAFB', border:`1.5px solid ${email&&!emailOk?'#EF4444':email&&emailOk?'#10B981':'#E5E7EB'}`, color:'#111827', fontSize:'14px', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }} />
              </div>
              {email && !emailOk && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>Format email invalide</p>}
            </div>

            <div style={{ marginBottom:'8px' }}>
              <label style={{ display:'block', color:'#374151', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'7px' }}>Mot de passe</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', fontSize:'14px' }}>🔑</span>
                <input type={showPwd?'text':'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 caractères"
                  style={{ width:'100%', padding:'12px 40px 12px 38px', borderRadius:'10px', background:'#F9FAFB', border:`1.5px solid ${password&&!mdpOk?'#EF4444':password&&mdpOk?'#10B981':'#E5E7EB'}`, color:'#111827', fontSize:'14px', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#9CA3AF', cursor:'pointer', fontSize:'14px' }}>{showPwd?'🙈':'👁'}</button>
              </div>
              {password && !mdpOk && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>{8-password.length} caractère(s) manquant(s)</p>}
            </div>

            <div style={{ textAlign:'right', marginBottom:'20px' }}>
              <Link to="/mot-de-passe-oublie" style={{ color:'#0F766E', fontSize:'12px', textDecoration:'none', fontWeight:'500' }}>Mot de passe oublié ?</Link>
            </div>

            {erreur && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'10px', padding:'11px 14px', color:'#DC2626', fontSize:'13px', marginBottom:'18px', display:'flex', gap:'8px' }}><span>⚠</span>{erreur}</div>}

            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'13px', borderRadius:'10px', background:loading?'#9CA3AF':'linear-gradient(135deg,#0F766E,#065F46)', color:'#fff', border:'none', fontSize:'15px', fontWeight:'600', cursor:loading?'not-allowed':'pointer', marginBottom:'16px' }}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <div style={{ textAlign:'center', padding:'16px', background:'#F0FDF4', borderRadius:'10px', border:'1px solid #D1FAE5' }}>
            <p style={{ color:'#6B7280', fontSize:'13px', margin:'0 0 8px' }}>Pas encore de compte ?</p>
            <Link to="/inscription" style={{ color:'#0F766E', fontSize:'13px', fontWeight:'600', textDecoration:'none' }}>Créer un compte →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

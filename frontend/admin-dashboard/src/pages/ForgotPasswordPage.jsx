import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [loading, setLoading] = useState(false)

  const emailOk = /^[^\s@]+@usms\.ac\.ma$/.test(email.toLowerCase())

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!emailOk) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    // En production : POST /api/auth/forgot-password (Keycloak gère l'envoi email)
    setLoading(false); setEnvoye(true)
  }

  if (envoye) return (
    <div style={{ minHeight:'100vh', background:'#050B18', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ background:'#0A1628', borderRadius:'16px', padding:'48px 40px', maxWidth:'420px', width:'90%', textAlign:'center', border:'1px solid #1E293B' }}>
        <div style={{ fontSize:'48px', marginBottom:'20px' }}>📧</div>
        <h2 style={{ color:'#F8FAFC', fontSize:'22px', fontWeight:'700', margin:'0 0 12px' }}>Email envoyé !</h2>
        <p style={{ color:'#64748B', fontSize:'14px', margin:'0 0 8px' }}>Consultez votre boîte mail :</p>
        <p style={{ color:'#60A5FA', fontSize:'14px', fontFamily:'monospace', margin:'0 0 20px' }}>{email}</p>
        <p style={{ color:'#475569', fontSize:'13px', lineHeight:'1.5', margin:'0 0 28px' }}>
          Cliquez sur le lien dans l'email pour réinitialiser votre mot de passe. Le lien expire dans <strong style={{ color:'#F59E0B' }}>15 minutes</strong>.
        </p>
        <p style={{ color:'#334155', fontSize:'12px', margin:'0 0 20px' }}>
          Vous n'avez pas reçu l'email ? Vérifiez vos spams ou{' '}
          <button onClick={() => setEnvoye(false)} style={{ background:'none', border:'none', color:'#60A5FA', cursor:'pointer', fontSize:'12px', padding:0 }}>
            réessayer
          </button>
        </p>
        <Link to="/login" style={{ display:'block', padding:'12px', background:'#1E293B', color:'#94A3B8', borderRadius:'10px', textDecoration:'none', fontSize:'13px' }}>
          Retour à la connexion
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#050B18', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 16px', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔐</div>
          <h1 style={{ color:'#F8FAFC', fontSize:'24px', fontWeight:'700', margin:'0 0 8px' }}>Mot de passe oublié</h1>
          <p style={{ color:'#64748B', fontSize:'13px', margin:0 }}>
            Entrez votre email — nous vous enverrons un lien de réinitialisation
          </p>
        </div>

        <div style={{ background:'#0A1628', borderRadius:'14px', padding:'28px', border:'1px solid #1E293B' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'20px' }}>
              <label style={{ display:'block', color:'#94A3B8', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'7px' }}>
                Email institutionnel
              </label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color:'#475569' }}>✉</span>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="prenom.nom@usms.ac.ma"
                  style={{ width:'100%', padding:'12px 14px 12px 40px', borderRadius:'9px', background:'#0F172A', border:`1.5px solid ${email&&!emailOk?'#EF4444':email&&emailOk?'#22C55E':'#1E293B'}`, color:'#F8FAFC', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
              </div>
              {email && !emailOk && <p style={{ color:'#EF4444', fontSize:'11px', margin:'4px 0 0' }}>Format attendu : prenom.nom@usms.ac.ma</p>}
              {email && emailOk  && <p style={{ color:'#22C55E', fontSize:'11px', margin:'4px 0 0' }}>✓ Email valide</p>}
            </div>

            <button type="submit" disabled={loading || !emailOk}
              style={{ width:'100%', padding:'13px', background:!emailOk||loading?'#1E293B':'linear-gradient(135deg,#2563EB,#1d4ed8)', color: !emailOk||loading?'#475569':'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:!emailOk||loading?'not-allowed':'pointer', marginBottom:'16px' }}>
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>

            <p style={{ textAlign:'center', color:'#475569', fontSize:'13px', margin:0 }}>
              <Link to="/login" style={{ color:'#60A5FA', textDecoration:'none' }}>← Retour à la connexion</Link>
            </p>
          </form>
        </div>

        <div style={{ marginTop:'16px', padding:'14px', background:'#0A1628', borderRadius:'10px', border:'1px solid #1E293B' }}>
          <p style={{ color:'#475569', fontSize:'12px', margin:'0 0 4px', fontWeight:'600' }}>Comment ça fonctionne ?</p>
          <p style={{ color:'#334155', fontSize:'12px', margin:0, lineHeight:'1.5' }}>
            1. Entrez votre email @usms.ac.ma<br/>
            2. Recevez un lien sécurisé (valide 15 min)<br/>
            3. Cliquez le lien et créez un nouveau mot de passe
          </p>
        </div>
      </div>
    </div>
  )
}

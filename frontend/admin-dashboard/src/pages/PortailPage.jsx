// PortailPage.jsx — Page d'accueil unique
// Accessible sur http://localhost:3000/portail
// Redirige vers :3000 (admin) ou :3001 (client)

export default function PortailPage() {

  const goAdmin  = () => window.location.href = 'http://localhost:3000/login'
  const goClient = () => window.location.href = 'http://localhost:3001/login'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050B18',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Fond décoratif */}
      <div style={{ position:'fixed', top:'-120px', left:'50%', transform:'translateX(-50%)', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-100px', left:'-100px', width:'400px', height:'400px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', top:'80px', right:'-80px', width:'300px', height:'300px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)', pointerEvents:'none' }} />

      {/* Logo + titre */}
      <div style={{ textAlign:'center', marginBottom:'56px', position:'relative', zIndex:1 }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '18px',
          background: 'linear-gradient(135deg,#1E3A5F,#2563EB)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', margin: '0 auto 20px',
          boxShadow: '0 0 60px rgba(37,99,235,0.25)'
        }}>🛡</div>
        <h1 style={{ color:'#F8FAFC', fontSize:'32px', fontWeight:'800', margin:'0 0 10px', letterSpacing:'-0.5px' }}>
          GestIncident
        </h1>
        <p style={{ color:'#475569', fontSize:'15px', margin:'0 0 4px' }}>
          Université Sultan Moulay Slimane
        </p>
        <p style={{ color:'#334155', fontSize:'13px', margin:0 }}>
          ENSA Béni Mellal — Système de gestion des incidents
        </p>
      </div>

      {/* Question */}
      <p style={{ color:'#94A3B8', fontSize:'17px', fontWeight:'500', marginBottom:'32px', letterSpacing:'-0.2px', position:'relative', zIndex:1 }}>
        Qui êtes-vous ?
      </p>

      {/* Deux cartes */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', width:'100%', maxWidth:'620px', marginBottom:'48px', position:'relative', zIndex:1 }}>

        {/* Technicien → :3000 */}
        <button
          onClick={goAdmin}
          style={{
            background: '#0A1628', borderRadius: '20px', padding: '36px 28px',
            border: '1.5px solid #1E3A5F', cursor: 'pointer', textAlign: 'center',
            transition: 'all 0.25s', outline: 'none', width: '100%'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#2563EB'
            e.currentTarget.style.background  = '#0D1E3A'
            e.currentTarget.style.transform   = 'translateY(-6px)'
            e.currentTarget.style.boxShadow   = '0 20px 60px rgba(37,99,235,0.18)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1E3A5F'
            e.currentTarget.style.background  = '#0A1628'
            e.currentTarget.style.transform   = 'none'
            e.currentTarget.style.boxShadow   = 'none'
          }}>

          <div style={{ fontSize:'52px', marginBottom:'18px', lineHeight:1 }}>👨‍💻</div>

          <h2 style={{ color:'#F8FAFC', fontSize:'20px', fontWeight:'700', margin:'0 0 10px', letterSpacing:'-0.3px' }}>
            Technicien
          </h2>
          <p style={{ color:'#475569', fontSize:'13px', margin:'0 0 24px', lineHeight:'1.5' }}>
            Gérez les incidents, assignez les tâches et suivez les résolutions
          </p>

          {/* Badge port */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'7px 16px', background:'rgba(37,99,235,0.12)', borderRadius:'20px', border:'1px solid rgba(37,99,235,0.25)', marginBottom:'12px' }}>
            <span style={{ color:'#60A5FA', fontSize:'13px', fontWeight:'600' }}>Dashboard Admin</span>
            <span style={{ color:'#3B82F6', fontSize:'14px' }}>→</span>
          </div>

          <p style={{ color:'#1E3A5F', fontSize:'11px', margin:0, fontFamily:'monospace' }}>
            localhost:3000
          </p>
        </button>

        {/* Utilisateur → :3001 */}
        <button
          onClick={goClient}
          style={{
            background: '#0A1A12', borderRadius: '20px', padding: '36px 28px',
            border: '1.5px solid #0F2A1A', cursor: 'pointer', textAlign: 'center',
            transition: 'all 0.25s', outline: 'none', width: '100%'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#065F46'
            e.currentTarget.style.background  = '#0A201A'
            e.currentTarget.style.transform   = 'translateY(-6px)'
            e.currentTarget.style.boxShadow   = '0 20px 60px rgba(6,95,70,0.18)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#0F2A1A'
            e.currentTarget.style.background  = '#0A1A12'
            e.currentTarget.style.transform   = 'none'
            e.currentTarget.style.boxShadow   = 'none'
          }}>

          <div style={{ fontSize:'52px', marginBottom:'18px', lineHeight:1 }}>👤</div>

          <h2 style={{ color:'#F8FAFC', fontSize:'20px', fontWeight:'700', margin:'0 0 10px', letterSpacing:'-0.3px' }}>
            Utilisateur
          </h2>
          <p style={{ color:'#475569', fontSize:'13px', margin:'0 0 24px', lineHeight:'1.5' }}>
            Signalez vos problèmes, suivez vos tickets et discutez avec le bot IA
          </p>

          <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'7px 16px', background:'rgba(6,95,70,0.12)', borderRadius:'20px', border:'1px solid rgba(6,95,70,0.25)', marginBottom:'12px' }}>
            <span style={{ color:'#34D399', fontSize:'13px', fontWeight:'600' }}>App Support</span>
            <span style={{ color:'#10B981', fontSize:'14px' }}>→</span>
          </div>

          <p style={{ color:'#0F2A1A', fontSize:'11px', margin:0, fontFamily:'monospace' }}>
            localhost:3001
          </p>
        </button>
      </div>

      {/* Info en bas */}
      <div style={{ width:'100%', maxWidth:'620px', padding:'16px 20px', background:'#0A1628', borderRadius:'14px', border:'1px solid #1E293B', textAlign:'center', position:'relative', zIndex:1 }}>
        <p style={{ color:'#475569', fontSize:'13px', margin:'0 0 4px' }}>
          Connexion sécurisée via <strong style={{ color:'#60A5FA' }}>Keycloak</strong>
        </p>
        <p style={{ color:'#334155', fontSize:'12px', margin:0 }}>
          Email institutionnel requis : <span style={{ fontFamily:'monospace', color:'#475569' }}>prenom.nom@usms.ac.ma</span>
        </p>
      </div>

    </div>
  )
}

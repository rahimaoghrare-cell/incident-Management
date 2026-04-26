// ===================================================
// mockData.js — Données de test ENSA Béni Mellal
// ===================================================

// Départements ENSA Béni Mellal — utilisateurs (tous)
export const DEPARTEMENTS_UTILISATEUR = [
  // Départements académiques
  'Département Informatique',
  'Département Mathématiques & Physique',
  'Département Génie Civil',
  'Département Génie Électrique',
  'Département Génie Mécanique & Industriel',
  'Département Langues & Communication',
  // Services administratifs
  'Scolarité',
  'Service Ressources Humaines',
  'Service Comptabilité & Finances',
  'Bibliothèque',
  'Direction',
  'Service Maintenance',
  'Autre',
]

// Département technicien — uniquement Service Informatique
export const DEPARTEMENTS_TECHNICIEN = [
  'Service Informatique',
]

export const CATEGORIES = ['Matériel', 'Logiciel', 'Réseau', 'Sécurité', 'Autre']
export const PRIORITES  = ['Basse', 'Moyenne', 'Haute']
export const STATUTS    = ['Nouveau', 'Assigné', 'En cours', 'Résolu', 'Fermé']

// Utilisateurs de test
// IMPORTANT : en production, n'importe quel @usms.ac.ma fonctionne via Keycloak
export let mockUsers = [
  // Techniciens — Service Informatique
  { id:'u1', nom:'Zouhiri',  prenom:'Hasnae',  email:'hasnae.zouhiri@usms.ac.ma',  role:'Technicien', departement:'Service Informatique', avatar:'HZ', nb_incidents:4 },
  { id:'u2', nom:'Oughrare', prenom:'Rahma',   email:'rahma.oughrare@usms.ac.ma',  role:'Technicien', departement:'Service Informatique', avatar:'RO', nb_incidents:3 },
  // Utilisateurs — différents départements ENSA
  { id:'u3', nom:'Alaoui',   prenom:'Chaymae', email:'chaymae.alaoui@usms.ac.ma',  role:'Utilisateur', departement:'Département Informatique',          avatar:'CA', nb_incidents:2 },
  { id:'u4', nom:'Halloul',  prenom:'Fatima',  email:'fatima.halloul@usms.ac.ma',  role:'Utilisateur', departement:'Scolarité',                          avatar:'FH', nb_incidents:2 },
  { id:'u5', nom:'Agro',     prenom:'Yasmine', email:'yasmine.agro@usms.ac.ma',    role:'Utilisateur', departement:'Département Génie Civil',            avatar:'YA', nb_incidents:2 },
]

export let mockIncidents = [
  { id:'INC-001', titre:'Imprimante HP bloquée bureau 3',  statut:'Nouveau',  priorite:'Haute',   utilisateur_id:'u3', utilisateur_nom:'Chaymae Alaoui', technicien_nom:null,             date_creation:'2024-04-10T09:30:00', description:"L'imprimante HP LaserJet du bureau 3 est bloquée. Aucune impression possible.", categorie:'Matériel' },
  { id:'INC-002', titre:'VPN impossible à connecter',       statut:'En cours', priorite:'Haute',   utilisateur_id:'u4', utilisateur_nom:'Fatima Halloul',  technicien_nom:'Hasnae Zouhiri', date_creation:'2024-04-11T14:00:00', description:"Impossible de se connecter au VPN depuis la mise à jour Windows.", categorie:'Réseau' },
  { id:'INC-003', titre:"Email ne s'envoie plus",           statut:'Résolu',   priorite:'Moyenne', utilisateur_id:'u5', utilisateur_nom:'Yasmine Agro',    technicien_nom:'Rahma Oughrare', date_creation:'2024-04-08T11:00:00', description:"Outlook affiche une erreur lors de l'envoi des emails.", categorie:'Logiciel' },
  { id:'INC-004', titre:'PC très lent au démarrage',        statut:'Assigné',  priorite:'Basse',   utilisateur_id:'u3', utilisateur_nom:'Chaymae Alaoui', technicien_nom:'Hasnae Zouhiri', date_creation:'2024-04-12T08:45:00', description:"L'ordinateur prend 10 minutes pour démarrer.", categorie:'Matériel' },
  { id:'INC-005', titre:'Accès Moodle refusé',              statut:'Nouveau',  priorite:'Haute',   utilisateur_id:'u5', utilisateur_nom:'Yasmine Agro',    technicien_nom:null,             date_creation:'2024-04-13T10:15:00', description:"Impossible d'accéder à la plateforme Moodle de l'ENSA.", categorie:'Réseau' },
]

export let mockCommentaires = {
  'INC-001':[{ id:'c1', auteur:'Hasnae Zouhiri', role:'Technicien', message:"Pris en charge. Vérification du spooler d'impression.", date:'2024-04-10T10:00:00' }],
  'INC-002':[{ id:'c2', auteur:'Hasnae Zouhiri', role:'Technicien', message:'Certificat VPN expiré. Renouvellement en cours.', date:'2024-04-11T15:30:00' },
             { id:'c3', auteur:'Fatima Halloul',  role:'Utilisateur',message:"Merci, j'attends.", date:'2024-04-11T16:00:00' }],
  'INC-003':[{ id:'c4', auteur:'Rahma Oughrare', role:'Technicien', message:'Résolu : reconfiguration SMTP.', date:'2024-04-09T09:00:00' },
             { id:'c5', auteur:'Yasmine Agro',    role:'Utilisateur',message:'Parfait, merci !', date:'2024-04-09T09:30:00' }],
  'INC-004':[], 'INC-005':[]
}

export const getStats = () => {
  const s = { Nouveau:0, Assigné:0, 'En cours':0, Résolu:0, Fermé:0 }
  mockIncidents.forEach(i => { if(s[i.statut]!==undefined) s[i.statut]++ })
  return s
}

// Login mock — accepte N'IMPORTE QUEL email valide
// Technicien si email connu dans mockUsers avec role Technicien
// Sinon → Utilisateur par défaut
export const mockLogin = (email, password, roleChoisi = 'Utilisateur') => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Adresse email invalide")
  if (password.length < 8)
    throw new Error('Mot de passe : minimum 8 caractères')

  // Chercher dans les utilisateurs existants
  const existant = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (existant) return existant

  // Créer un utilisateur dynamique pour n'importe quel @usms.ac.ma
  const parts  = email.split('@')[0].split('.')
  const prenom = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Utilisateur'
  const nom    = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'ENSA'

  const newUser = {
    id:          `u_${Date.now()}`,
    nom, prenom,
    email:       email.toLowerCase(),
    role:        roleChoisi,
    departement: roleChoisi === 'Technicien' ? 'Service Informatique' : 'ENSA Béni Mellal',
    avatar:      prenom[0] + (nom[0] || ''),
    nb_incidents: 0
  }
  mockUsers.push(newUser)
  return newUser
}

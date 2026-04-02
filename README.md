# 🏥 KinéGest — Gestion de Cabinet de Kinésithérapie

Application desktop complète pour la gestion d'un cabinet de kinésithérapie. Conçue pour les kinésithérapeutes et secrétaires, elle permet de gérer les patients, rendez-vous, traitements et finances en toute simplicité.

![Electron](https://img.shields.io/badge/Electron-35-47848F?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Windows-blue?logo=windows)

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Login sécurisé avec code PIN
- Deux rôles : **Kinésithérapeute** et **Secrétaire**

### 📊 Tableau de bord
- Vue d'ensemble du cabinet en temps réel
- Nombre de patients, RDV du jour, séances du jour
- Revenus mensuels en MAD
- Liste des prochains rendez-vous
- Derniers patients ajoutés

### 👥 Gestion des Patients
- Fiche patient complète (nom, prénom, téléphone, date de naissance, sexe, adresse, email)
- Zone corporelle concernée (épaule, genou, dos, cervical, hanche...)
- Informations mutuelle / assurance (CNSS, CNOPS, AMO)
- Antécédents médicaux et profession
- Recherche rapide par nom, téléphone ou zone
- Vue détaillée avec onglets : Infos, RDV, Finances, Traitements

### 📅 Gestion des Rendez-vous
- Vue **jour** et **semaine** avec navigation
- 11 types de séances : Bilan initial, Rééducation, Massage, Électrothérapie, Drainage lymphatique, Thérapie manuelle...
- Suivi du numéro de séance
- Statuts : En attente, Confirmé, Terminé, Annulé, Absent
- Durées configurables : 15, 20, 30, 45, 60, 90 min
- Notes par séance (observations, exercices donnés)

### 💰 Gestion Financière
- Enregistrement des paiements en **MAD** (Dirham Marocain)
- 4 méthodes de paiement : Espèces, Chèque, Virement, Carte bancaire
- Filtrage par mois
- Statistiques : total mensuel, total général, moyenne par mois
- Répartition par méthode de paiement

### 🩺 Suivi des Traitements
- 15 types de rééducation : genou, épaule, lombaire, cervicale, post-fracture, neurologique, respiratoire, périnéale, sportive...
- Nombre de séances prescrites vs effectuées
- Barre de progression des séances
- Barre de progression des paiements
- Médecin prescripteur / ordonnance
- Statuts : En cours, En pause, Terminé, Annulé
- Programme de rééducation et notes

---

## 🛠️ Technologies

| Technologie | Utilisation |
|-------------|------------|
| **Electron** | Application desktop Windows |
| **React 18** | Interface utilisateur |
| **Babel** | Transpilation JSX |
| **localStorage** | Stockage des données |
| **JavaScript** | Logique applicative |

---

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (version LTS recommandée)

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/Mohammed-Bahaj/cabinet-kinesitherapie.git

# 2. Accéder au dossier
cd cabinet-kinesitherapie

# 3. Installer les dépendances
npm install

# 4. Lancer l'application
npm start
```

---

## 📦 Build (créer l'installer .exe)

```bash
# Créer l'installer Windows
npm run build
```

L'installer se trouve dans le dossier `dist/` : **KinéGest Setup 1.0.0.exe**

---

## 📁 Structure du projet

```
cabinet-kinesitherapie/
├── main.js            # Point d'entrée Electron
├── index.html         # Page HTML principale
├── app.jsx            # Application React complète
├── renderer.js        # Script de rendu
├── style.css          # Styles additionnels
├── package.json       # Configuration du projet
├── .gitignore         # Fichiers ignorés par Git
└── LICENSE            # Licence MIT
```

---

## 🔮 Améliorations futures

- [ ] Migration vers SQLite pour le stockage des données
- [ ] Export des données en PDF / Excel
- [ ] Système de rappel SMS pour les patients
- [ ] Statistiques avancées et graphiques
- [ ] Mode sombre
- [ ] Backup automatique
- [ ] Version multi-cabinet

---

## 👨‍💻 Auteur

**Mohammed Bahaj**

- GitHub: [@Mohammed-Bahaj](https://github.com/Mohammed-Bahaj)

---

## 📄 Licence

Ce projet est sous licence **MIT** — voir le fichier [LICENSE](LICENSE) pour plus de détails.

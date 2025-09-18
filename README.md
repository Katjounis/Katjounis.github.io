# Portfolio Site - Documentation

Un site portfolio moderne, responsive et statique créé avec HTML5, CSS3 et JavaScript vanilla.

## 🚀 Fonctionnalités

- **Design moderne et épuré** avec thème sombre/clair
- **Navigation par onglets** fluide (Accueil, Projets, Services, Blog, Contact)
- **Responsive design** avec menu burger pour mobile
- **Formulaire de contact** fonctionnel avec sauvegarde de brouillons
- **Animations et micro-interactions** pour une expérience utilisateur optimale
- **Stockage local** pour les préférences utilisateur
- **Optimisé pour les performances** et l'accessibilité

## 📁 Structure du projet

```
portfolio-site/
├── index.html          # Structure HTML principale
├── style.css           # Styles CSS avec variables et responsive
├── app.js              # JavaScript pour les interactions
├── README.md           # Documentation du projet
├── LICENSE             # Licence MIT
└── .gitignore          # Fichiers à ignorer par Git
```

## 🛠️ Installation et développement local

### Prérequis
- Un navigateur web moderne
- Un serveur local (optionnel pour le développement)

### Lancement en local

#### Méthode 1 : Serveur local simple
```bash
# Avec Python 3
python -m http.server 8000

# Avec Python 2
python -m SimpleHTTPServer 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

#### Méthode 2 : Ouverture directe
Ouvrez simplement `index.html` dans votre navigateur.

## 🚀 Déploiement sur GitHub Pages

### Étape 1 : Préparation du repository

1. **Créer un repository GitHub**
   ```bash
   # Créer un nouveau repository sur GitHub
   # Nom suggéré : votre-nom-portfolio ou portfolio-site
   ```

2. **Cloner et ajouter les fichiers**
   ```bash
   git clone https://github.com/votre-nom/portfolio-site.git
   cd portfolio-site
   
   # Copier tous les fichiers du portfolio dans le dossier
   # Puis :
   git add .
   git commit -m "Initial portfolio setup"
   git push origin main
   ```

### Étape 2 : Activation de GitHub Pages

1. **Accéder aux paramètres**
   - Aller dans votre repository GitHub
   - Cliquer sur l'onglet "Settings"

2. **Configurer Pages**
   - Descendre jusqu'à la section "Pages"
   - Source : "Deploy from a branch"
   - Branch : "main" (ou "master")
   - Folder : "/ (root)"
   - Cliquer sur "Save"

3. **Accéder au site**
   - Votre site sera disponible à : `https://votre-nom.github.io/portfolio-site/`
   - Le déploiement prend généralement 5-10 minutes

### Étape 3 : Configuration personnalisée (optionnel)

#### Domaine personnalisé
1. Créer un fichier `CNAME` à la racine :
   ```
   www.votre-domaine.com
   ```

2. Configurer les DNS chez votre registrar :
   ```
   Type: CNAME
   Name: www
   Value: votre-nom.github.io
   ```

#### Actions GitHub (CI/CD automatique)
Créer `.github/workflows/deploy.yml` :
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## ⚙️ Configuration du formulaire de contact

### Intégration Formspree

1. **Créer un compte Formspree**
   - Aller sur [formspree.io](https://formspree.io)
   - Créer un compte gratuit

2. **Configurer le formulaire**
   ```javascript
   // Dans app.js, modifier la fonction submitForm()
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(data)
   });
   ```

3. **Remplacer YOUR_FORM_ID**
   - Récupérer votre ID Formspree
   - Remplacer `YOUR_FORM_ID` dans le code

### Alternative : Netlify Forms
Si déployé sur Netlify, ajouter `netlify` à la balise form :
```html
<form class="contact-form" id="contactForm" netlify>
```

## 🎨 Personnalisation

### Couleurs et thème
Modifier les variables CSS dans `style.css` :
```css
:root {
  --primary-color: #3B82F6;    /* Couleur principale */
  --accent-color: #F97316;     /* Couleur d'accent */
  /* ... autres variables */
}
```

### Contenu
- **Textes** : Modifier directement dans `index.html`
- **Projets** : Ajouter/modifier les cartes dans la section `#projects`
- **Services** : Personnaliser la section `#services`
- **Images** : Remplacer les placeholders par vos images

### Fonctionnalités additionnelles
- **Analytics** : Ajouter Google Analytics dans `<head>`
- **SEO** : Modifier les meta tags dans `<head>`
- **PWA** : Ajouter un manifest.json et service worker

## 🧪 Tests et validation

### Tests manuels
- ✅ Navigation entre les sections
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Thème sombre/clair
- ✅ Formulaire de contact
- ✅ Menu burger mobile

### Validation
```bash
# Validation HTML
# Utiliser https://validator.w3.org/

# Validation CSS  
# Utiliser https://jigsaw.w3.org/css-validator/

# Test de performance
# Utiliser https://pagespeed.web.dev/
```

## 📱 Responsive Breakpoints

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px  
- **Desktop** : > 1024px

## 🔧 Maintenance

### Mises à jour régulières
1. Ajouter de nouveaux projets
2. Mettre à jour les informations de contact
3. Publier des articles de blog
4. Optimiser les performances

### Sauvegarde
```bash
git add .
git commit -m "Update: description des modifications"
git push origin main
```

## 📞 Support

Pour toute question ou problème :
- Créer une [issue GitHub](https://github.com/votre-nom/portfolio-site/issues)
- Consulter la [documentation GitHub Pages](https://pages.github.com/)

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Astuce** : Pensez à mettre à jour régulièrement votre portfolio avec vos nouveaux projets et compétences !

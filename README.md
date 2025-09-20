# Portfolio Professionnel

Un portfolio moderne et responsive présentant vos projets de maquettes 3D, affiches événementielles, développement web et designs de tatouage.

## 🚀 Déploiement sur GitHub Pages

### 1. Configuration initiale
1. Créez un nouveau repository sur GitHub nommé `votre-username.github.io`
2. Clonez ou uploadez tous les fichiers dans ce repository
3. Dans les settings du repository, activez GitHub Pages (source: branch main)

### 2. Structure des fichiers
```
├── index.html          # Page principale
├── style.css          # Styles CSS
├── script.js          # JavaScript pour les interactions
├── README.md          # Ce fichier
└── images/            # Dossier pour vos images (à créer)
    ├── modeling/      # Images des maquettes 3D
    ├── posters/       # Images des affiches
    ├── tattoos/       # Images des designs de tatouage
    └── projects/      # Screenshots des projets web
```

## 📝 Personnalisation

### Modifier les informations personnelles
Dans `index.html`, modifiez :
- Le titre de la page (ligne 7)
- Votre nom et description (lignes 25-27)
- Vos liens de contact (lignes 33-44)

### Ajouter vos projets

#### 1. Maquettes 3D
Remplacez le contenu du div `modeling-projects` (ligne 85) par vos projets :
```html
<div class="project-card">
    <div class="project-image-placeholder">
        <img src="images/modeling/mon-projet.jpg" alt="Mon Projet">
    </div>
    <div class="project-info">
        <h3>Nom de votre projet</h3>
        <p>Description de votre projet de maquette 3D.</p>
        <div class="project-tags">
            <span class="tag">Revit</span>
            <span class="tag">AutoCAD</span>
        </div>
    </div>
</div>
```

#### 2. Affiches événementielles
Ajoutez vos affiches dans le div `poster-projects` (ligne 106).

#### 3. Projets de développement
Modifiez le div `code-projects` (ligne 127) avec vos projets web.

#### 4. Designs de tatouage
Ajoutez vos designs dans le div `tattoo-projects` (ligne 178).

### Utiliser les fonctions JavaScript

Le fichier `script.js` inclut des fonctions utiles pour ajouter facilement du contenu :

```javascript
// Ajouter un projet de maquette 3D
addModelingProject(
    "Villa Moderne",
    "Description du projet",
    "images/modeling/villa.jpg",
    ["Revit", "AutoCAD"],
    "https://lien-vers-projet.com"
);

// Ajouter une affiche
addPosterProject(
    "Festival 2024",
    "Description de l'affiche",
    "images/posters/festival.jpg",
    ["Photoshop", "Illustrator"]
);

// Ajouter un projet de code
addCodeProject(
    "Site E-commerce",
    "Description du projet",
    `<html>Votre code HTML ici</html>`,
    ["HTML", "CSS", "JavaScript"],
    "https://site-live.com",
    "https://github.com/user/repo"
);
```

## 🎨 Personnalisation du design

### Couleurs
Modifiez les variables CSS dans `style.css` (lignes 2-16) :
```css
:root {
    --primary-color: #2563eb;    /* Couleur principale */
    --secondary-color: #7c3aed;  /* Couleur secondaire */
    --accent-color: #ea580c;     /* Couleur d'accent */
    /* ... autres couleurs */
}
```

### Polices
Changez la police dans `index.html` (ligne 8) et `style.css` (ligne 21).

## 📱 Responsive Design

Le site est entièrement responsive et s'adapte automatiquement :
- Mobile : < 640px
- Tablette : 640px - 1024px  
- Desktop : > 1024px

## 🔧 Fonctionnalités

- ✅ Navigation par onglets fluide
- ✅ Animations CSS modernes
- ✅ Design responsive
- ✅ Visualiseur de code intégré
- ✅ Galeries d'images adaptatives
- ✅ Effets de survol et transitions
- ✅ Optimisé pour GitHub Pages
- ✅ SEO-friendly

## 📞 Support

Pour toute question ou personnalisation avancée, n'hésitez pas à :
1. Créer une issue sur GitHub
2. Consulter la documentation GitHub Pages
3. Modifier le code selon vos besoins

## 🚀 Mise en ligne

Une fois vos fichiers pushés sur GitHub :
1. Allez dans Settings > Pages
2. Sélectionnez la source "Deploy from a branch"
3. Choisissez "main" branch et "/ (root)"
4. Votre site sera disponible à `https://votre-username.github.io`

Bonne création de votre portfolio ! 🎉

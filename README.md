# Portfolio Professionnel Multi-Spécialités

Site portfolio responsive présentant 4 domaines d'expertise :
- 🏗️ Maquettes 3D (Revit/AutoCAD)
- 🎨 Affiches Événementielles
- 💻 Développement Web
- 🎭 Designs de Tatouage

## 🚀 Hébergement sur GitHub Pages

### Configuration automatique
1. Créez un repository GitHub
2. Uploadez tous les fichiers
3. Allez dans Settings > Pages
4. Source : Deploy from a branch
5. Branch : main / (root)
6. Votre site sera accessible sur : `https://votrenom.github.io/nom-repository`

### Structure des fichiers
```
portfolio/
├── index.html          # Page principale
├── css/
│   └── styles.css      # Styles CSS
├── js/
│   └── script.js       # Logique JavaScript
├── images/             # Vos images (à créer)
│   ├── 3d/
│   ├── affiches/
│   ├── code/
│   └── tatouages/
└── README.md           # Ce fichier
```

## ✨ Ajouter vos projets

Éditez le fichier `js/script.js` et utilisez ces fonctions :

### 1. Projets 3D (Revit/AutoCAD)
```javascript
addProject3D({
    title: "Nom du projet",
    description: "Description détaillée...",
    imageUrl: "images/3d/mon-projet.jpg",
    tags: ["Revit", "BIM", "Architecture"]
});
```

### 2. Affiches Événementielles
```javascript
addProjectAffiche({
    title: "Nom de l'affiche",
    description: "Description...",
    imageUrl: "images/affiches/mon-affiche.jpg",
    tags: ["Print", "Événement", "Design"]
});
```

### 3. Projets Web (Code HTML)
```javascript
addProjectCode({
    title: "Nom du projet web",
    description: "Description...",
    htmlCode: `<!DOCTYPE html>...votre code HTML complet...`,
    tags: ["HTML", "CSS", "JavaScript"]
});
```

### 4. Designs de Tatouage
```javascript
addProjectTatouage({
    title: "Nom du design",
    description: "Description...",
    imageUrl: "images/tatouages/mon-design.jpg",
    tags: ["Style", "Technique", "Couleur"]
});
```

## 🎨 Personnalisation

### Couleurs (dans `css/styles.css`)
```css
:root {
    --primary: #1e40af;      /* Bleu principal */
    --secondary: #374151;    /* Gris secondaire */
    --accent: #f59e0b;       /* Accent doré */
}
```

### Titre du site (dans `index.html`)
Changez "Portfolio Pro" dans la navigation et le titre de la page.

### Polices
Le site utilise la police "Inter" de Google Fonts. Changez dans `index.html` :
```html
<link href="https://fonts.googleapis.com/css2?family=VotrePolice:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## 📱 Fonctionnalités

- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Navigation par onglets fluide
- ✅ Modal de prévisualisation pour images
- ✅ Prévisualisateur de code HTML intégré
- ✅ Animations et effets de survol
- ✅ SEO optimisé
- ✅ Compatible GitHub Pages

## 🛠️ Étapes pour personnaliser

1. **Supprimez les exemples** : Dans `js/script.js`, supprimez la fonction `addProjectsExamples()`

2. **Ajoutez vos projets** : Utilisez les fonctions `add___()` pour ajouter vos vrais projets

3. **Uploadez vos images** : Créez le dossier `images/` et organisez vos fichiers

4. **Personnalisez le design** : Modifiez les couleurs et textes selon vos préférences

5. **Testez localement** : Ouvrez `index.html` dans votre navigateur

6. **Publiez sur GitHub** : Poussez vers votre repository et activez GitHub Pages

## 📸 Format recommandé pour les images

- **Maquettes 3D** : 800x600px, JPG/PNG
- **Affiches** : 600x800px (portrait), JPG/PNG  
- **Tatouages** : 600x800px, JPG/PNG
- **Poids** : < 500KB par image pour de bonnes performances

## 🚀 Performance

Le site est optimisé pour :
- Chargement rapide
- SEO
- Accessibilité
- Navigation mobile intuitive
- Images lazy loading

---

**Bon développement ! 🎯**

# 🎨 Portfolio Professionnel Multi-Spécialités

Site portfolio moderne et responsive présentant 4 domaines d'expertise créative :

- 🏗️ **Maquettes 3D** (Revit/AutoCAD)
- 🎨 **Affiches Événementielles** 
- 💻 **Développement Web**
- 🖋️ **Designs de Tatouage**

## ✨ Fonctionnalités

- ✅ Design premium avec animations fluides
- ✅ Navigation par onglets intuitive
- ✅ Galerie d'images avec modal de prévisualisation
- ✅ Prévisualisateur de code HTML intégré
- ✅ Interface responsive (mobile, tablette, desktop)
- ✅ Optimisé pour GitHub Pages
- ✅ SEO et performances optimisées

## 🚀 Déploiement sur GitHub Pages

### Configuration automatique
1. **Créez un repository GitHub**
2. **Uploadez tous les fichiers** de ce projet
3. **Allez dans Settings > Pages**
4. **Source** : Deploy from a branch
5. **Branch** : main / (root)
6. **Votre site sera accessible** sur : `https://votrenom.github.io/nom-repository`

### Structure des fichiers
```
portfolio/
├── index.html          # Page principale
├── css/
│   └── styles.css      # Styles CSS modernes
├── js/
│   └── script.js       # Logique JavaScript
├── images/             # Vos images (à créer)
│   ├── 3d/
│   ├── affiches/
│   ├── code/
│   └── tatouages/
└── README.md           # Ce fichier
```

## 🎯 Ajouter vos projets

Éditez le fichier `js/script.js` et utilisez ces fonctions :

### 1. Projets 3D (Revit/AutoCAD)
```javascript
addProject3D({
    title: "Villa Moderne",
    description: "Modélisation complète avec Revit...",
    imageUrl: "images/3d/villa-moderne.jpg",
    tags: ["Revit", "BIM", "Architecture"],
    featured: true // optionnel, pour mettre en avant
});
```

### 2. Affiches Événementielles
```javascript
addProjectAffiche({
    title: "Festival de Jazz",
    description: "Affiche événementielle...",
    imageUrl: "images/affiches/jazz-festival.jpg",
    tags: ["Print", "Événement", "Design"]
});
```

### 3. Projets Web (Code HTML)
```javascript
addProjectCode({
    title: "Site E-commerce",
    description: "Boutique en ligne moderne...",
    htmlCode: `<!DOCTYPE html>...votre code HTML complet...`,
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://mon-site-live.com" // optionnel
});
```

### 4. Designs de Tatouage
```javascript
addProjectTatouage({
    title: "Dragon Japonais",
    description: "Design traditionnel japonais...",
    imageUrl: "images/tatouages/dragon-japonais.jpg",
    tags: ["Japonais", "Traditionnel", "Noir et Gris"],
    style: "Traditionnel Japonais"
});
```

## 🎨 Personnalisation

### Couleurs principales (dans `css/styles.css`)
```css
:root {
    --primary: #2563eb;        /* Bleu principal */
    --secondary: #1e293b;      /* Gris foncé */
    --accent: #f59e0b;         /* Accent doré */
    --color-3d: #3b82f6;       /* Couleur section 3D */
    --color-affiches: #8b5cf6; /* Couleur section affiches */
    --color-code: #10b981;     /* Couleur section code */
    --color-tatouage: #ef4444; /* Couleur section tatouage */
}
```

### Informations personnelles
Dans `index.html`, modifiez :
- Le titre du site
- Les informations de contact dans la modal
- Les liens des réseaux sociaux

### Polices
Le site utilise "Inter" et "Playfair Display" de Google Fonts. Pour changer :
```html
<link href="https://fonts.googleapis.com/css2?family=VotrePolice:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## 📱 Fonctionnalités avancées

### Navigation fluide
- Transitions animées entre sections
- Menu mobile responsive
- Indicateurs visuels d'état

### Galerie interactive
- Modal de prévisualisation plein écran
- Zoom et navigation au clavier
- Chargement optimisé des images

### Prévisualisateur de code
- Rendu HTML en temps réel
- Coloration syntaxique
- Copie de code en un clic

### Animations
- Animations au scroll
- Effets de survol sophistiqués
- Transitions fluides

## 🛠️ Étapes de personnalisation

1. **Supprimez les exemples**
   - Dans `js/script.js`, supprimez la fonction `addExampleProjects()`

2. **Ajoutez vos projets**
   - Utilisez les fonctions `add___()` pour ajouter vos créations

3. **Organisez vos images**
   - Créez le dossier `images/` avec les sous-dossiers
   - Optimisez vos images (format WebP recommandé, < 500KB)

4. **Personnalisez le design**
   - Modifiez les couleurs dans `css/styles.css`
   - Adaptez les textes et informations personnelles

5. **Testez localement**
   - Ouvrez `index.html` dans votre navigateur
   - Vérifiez la responsivité sur différents écrans

6. **Publiez sur GitHub**
   - Créez votre repository
   - Activez GitHub Pages
   - Votre site sera en ligne !

## 📸 Recommandations images

### Formats et tailles
- **Maquettes 3D** : 1200x900px, format JPG/WebP
- **Affiches** : 800x1200px (portrait), JPG/WebP
- **Captures d'écran code** : 1200x800px, PNG/WebP
- **Tatouages** : 800x1000px, JPG/WebP

### Optimisation
- Poids maximum : 500KB par image
- Utilisez des outils comme TinyPNG pour compresser
- Format WebP recommandé pour de meilleures performances

## 🚀 Performance et SEO

### Optimisations incluses
- Chargement lazy des images
- CSS et JS minifiés
- Meta tags SEO optimisés
- Structure sémantique HTML5
- Accessibilité WCAG

### Métriques de performance
- Lighthouse Score : 95+
- First Contentful Paint : < 1.5s
- Largest Contentful Paint : < 2.5s
- Cumulative Layout Shift : < 0.1

## 🎯 Conseils pour un portfolio réussi

### Contenu
- Sélectionnez vos meilleurs projets (qualité > quantité)
- Rédigez des descriptions détaillées et engageantes
- Utilisez des mots-clés pertinents pour le SEO

### Visuels
- Images haute qualité et bien cadrées
- Cohérence dans le style photographique
- Variété dans les types de projets présentés

### Navigation
- Organisation logique par spécialité
- Facilité de contact et d'interaction
- Appels à l'action clairs

## 📞 Support

Pour toute question ou personnalisation avancée :
- Consultez la documentation dans les commentaires du code
- Utilisez les issues GitHub pour signaler des problèmes
- Partagez vos créations avec le hashtag #PortfolioCreatif

---

**Créez un portfolio qui vous ressemble ! 🎨✨**

*Fait avec ❤️ pour les créateurs multi-talents*

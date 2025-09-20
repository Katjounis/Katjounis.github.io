// Gestion des onglets
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    addSmoothScrolling();
    addProjectInteractions();
    addLoadingAnimations();
});

// Initialisation des onglets
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Retirer la classe active de tous les boutons et contenus
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué et au contenu correspondant
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Animation de scroll vers le contenu si nécessaire
            document.getElementById(targetTab).scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        });
    });
}

// Défilement fluide pour les liens d'ancrage
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Interactions avec les cartes de projet
function addProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card, .code-project-card');
    
    projectCards.forEach(card => {
        // Animation au survol
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Effet de clic
        card.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-4px) scale(0.98)';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-8px) scale(1)';
        });
    });
}

// Animations de chargement
function addLoadingAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observer tous les éléments animables
    document.querySelectorAll('.project-card, .code-project-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Fonctions utilitaires pour ajouter facilement du contenu

// Fonction pour ajouter un projet de maquette 3D
function addModelingProject(title, description, imageUrl, tags, projectUrl) {
    const container = document.getElementById('modeling-projects');
    const projectCard = createProjectCard(title, description, imageUrl, tags, projectUrl);
    container.appendChild(projectCard);
}

// Fonction pour ajouter un projet d'affiche
function addPosterProject(title, description, imageUrl, tags, projectUrl) {
    const container = document.getElementById('poster-projects');
    const projectCard = createProjectCard(title, description, imageUrl, tags, projectUrl);
    container.appendChild(projectCard);
}

// Fonction pour ajouter un projet de tatouage
function addTattooProject(title, description, imageUrl, tags, projectUrl) {
    const container = document.getElementById('tattoo-projects');
    const projectCard = createProjectCard(title, description, imageUrl, tags, projectUrl);
    container.appendChild(projectCard);
}

// Fonction pour ajouter un projet de code
function addCodeProject(title, description, codeSnippet, tags, liveUrl, sourceUrl) {
    const container = document.getElementById('code-projects');
    const codeCard = createCodeProjectCard(title, description, codeSnippet, tags, liveUrl, sourceUrl);
    container.appendChild(codeCard);
}

// Création d'une carte de projet standard
function createProjectCard(title, description, imageUrl, tags = [], projectUrl = '#') {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const tagsHtml = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    card.innerHTML = `
        <div class="project-image-placeholder">
            ${imageUrl ? 
                `<img src="${imageUrl}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;">` :
                `<svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>`
            }
        </div>
        <div class="project-info">
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="project-tags">
                ${tagsHtml}
            </div>
        </div>
    `;
    
    if (projectUrl !== '#') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => window.open(projectUrl, '_blank'));
    }
    
    return card;
}

// Création d'une carte de projet de code
function createCodeProjectCard(title, description, codeSnippet, tags = [], liveUrl = '#', sourceUrl = '#') {
    const card = document.createElement('div');
    card.className = 'code-project-card';
    
    const tagsHtml = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    card.innerHTML = `
        <div class="code-project-header">
            <h3>${title}</h3>
            <div class="code-project-links">
                ${liveUrl !== '#' ? `<a href="${liveUrl}" class="btn btn-sm" target="_blank">Voir le Site</a>` : ''}
                ${sourceUrl !== '#' ? `<a href="${sourceUrl}" class="btn btn-sm btn-secondary" target="_blank">Code Source</a>` : ''}
            </div>
        </div>
        <div class="code-preview">
            <div class="code-preview-header">
                <div class="code-preview-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="code-preview-title">${title.toLowerCase().replace(/\s+/g, '-')}.html</span>
            </div>
            <pre class="code-preview-content"><code>${escapeHtml(codeSnippet)}</code></pre>
        </div>
        <div class="code-project-description">
            <p>${description}</p>
            <div class="project-tags">
                ${tagsHtml}
            </div>
        </div>
    `;
    
    return card;
}

// Fonction utilitaire pour échapper le HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Gestion du mode sombre (optionnel)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Charger la préférence de mode sombre
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Exemples d'utilisation pour ajouter du contenu (décommentez et adaptez selon vos besoins)

/*
// Exemple d'ajout de projet de maquette 3D
addModelingProject(
    "Villa Moderne",
    "Conception 3D d'une villa moderne de 200m² avec piscine et jardin paysager.",
    "path/to/your/image.jpg",
    ["Revit", "AutoCAD", "3D Studio Max"],
    "https://lien-vers-votre-projet.com"
);

// Exemple d'ajout d'affiche
addPosterProject(
    "Festival de Musique 2024",
    "Affiche promotionnelle pour le festival de musique électronique, design moderne et coloré.",
    "path/to/your/poster.jpg",
    ["Photoshop", "Illustrator", "Print Design"],
    "https://lien-vers-votre-affiche.com"
);

// Exemple d'ajout de projet de code
addCodeProject(
    "Site E-commerce",
    "Boutique en ligne responsive avec panier d'achat et paiement intégré.",
    `<!DOCTYPE html>
<html>
<head>
    <title>Ma Boutique</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Ma Boutique</h1>
        <nav>
            <ul>
                <li><a href="#accueil">Accueil</a></li>
                <li><a href="#produits">Produits</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
</body>
</html>`,
    ["HTML", "CSS", "JavaScript", "PHP"],
    "https://votre-site.com",
    "https://github.com/votre-username/projet"
);

// Exemple d'ajout de design de tatouage
addTattooProject(
    "Dragon Oriental",
    "Design traditionnel japonais représentant un dragon dans les nuages, style noir et gris.",
    "path/to/your/tattoo-design.jpg",
    ["Traditional", "Japanese", "Black & Grey"],
    "https://lien-vers-votre-design.com"
);
*/

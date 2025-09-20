// Configuration globale
const config = {
    fadeInDelay: 100,
    animationDuration: 300,
    projects: {
        '3d': [],
        'affiches': [],
        'code': [],
        'tatouage': []
    }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    loadProjects();
    initModal();
    addProjectsExamples(); // Supprimez cette ligne une fois vos vrais projets ajoutés
});

// === NAVIGATION ===
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Menu mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Navigation entre onglets
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            switchTab(tabId);
            
            // Fermer le menu mobile
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

function switchTab(tabId) {
    // Mettre à jour les liens de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Mettre à jour les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    setTimeout(() => {
        document.getElementById(tabId).classList.add('active');
    }, config.fadeInDelay);
}

// === GESTION DES PROJETS ===

// *** AJOUTEZ VOS PROJETS 3D ICI ***
function addProject3D(project) {
    config.projects['3d'].push({
        id: project.id || Date.now().toString(),
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        tags: project.tags || [],
        link: project.link || null
    });
    renderProjects('3d');
}

// *** AJOUTEZ VOS AFFICHES ICI ***
function addProjectAffiche(project) {
    config.projects['affiches'].push({
        id: project.id || Date.now().toString(),
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        tags: project.tags || [],
        link: project.link || null
    });
    renderProjects('affiches');
}

// *** AJOUTEZ VOS PROJETS CODE ICI ***
function addProjectCode(project) {
    config.projects['code'].push({
        id: project.id || Date.now().toString(),
        title: project.title,
        description: project.description,
        htmlCode: project.htmlCode,
        tags: project.tags || [],
        link: project.link || null
    });
    renderProjects('code');
}

// *** AJOUTEZ VOS DESIGNS DE TATOUAGE ICI ***
function addProjectTatouage(project) {
    config.projects['tatouage'].push({
        id: project.id || Date.now().toString(),
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        tags: project.tags || [],
        style: project.style || null
    });
    renderProjects('tatouage');
}

// Chargement et rendu des projets
function loadProjects() {
    renderProjects('3d');
    renderProjects('affiches');
    renderProjects('code');
    renderProjects('tatouage');
}

function renderProjects(category) {
    const container = document.getElementById(getContainerId(category));
    if (!container) return;

    const projects = config.projects[category];
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 48px; color: var(--neutral-500);">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 16px; display: block;"></i>
                <p>Aucun projet pour le moment.</p>
                <p style="font-size: 0.875rem; margin-top: 8px;">Ajoutez vos projets dans le fichier js/script.js</p>
            </div>
        `;
        return;
    }

    if (category === 'code') {
        renderCodeProjects(container, projects);
    } else {
        renderImageProjects(container, projects);
    }
}

function getContainerId(category) {
    const ids = {
        '3d': 'projects3d',
        'affiches': 'projectsAffiches',
        'code': 'projectsCode',
        'tatouage': 'projectsTatouage'
    };
    return ids[category];
}

function renderImageProjects(container, projects) {
    container.innerHTML = projects.map(project => `
        <div class="project-card" onclick="openImageModal('${project.imageUrl}', '${project.title}')">
            <img src="${project.imageUrl}" alt="${project.title}" class="project-image" loading="lazy">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                ${project.tags && project.tags.length > 0 ? `
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function renderCodeProjects(container, projects) {
    container.innerHTML = projects.map(project => `
        <div class="code-project">
            <div class="code-header">
                <div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                </div>
                <div class="code-actions">
                    <button class="code-btn" onclick="previewCode('${project.id}')">
                        <i class="fas fa-eye"></i>
                        Aperçu
                    </button>
                    <button class="code-btn secondary" onclick="viewCode('${project.id}')">
                        <i class="fas fa-code"></i>
                        Code
                    </button>
                </div>
            </div>
            <div class="code-content">
                ${project.tags && project.tags.length > 0 ? `
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="code-preview">
                    <pre><code>${escapeHtml(project.htmlCode.substring(0, 300))}${project.htmlCode.length > 300 ? '...' : ''}</code></pre>
                </div>
            </div>
        </div>
    `).join('');
}

// === MODAL ===
function initModal() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');

    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openImageModal(imageUrl, title) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: auto;">
        <h3 style="text-align: center; margin-top: 16px; color: var(--primary);">${title}</h3>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function previewCode(projectId) {
    const project = findProject(projectId);
    if (!project) return;

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h3 style="margin-bottom: 16px; color: var(--primary);">${project.title} - Aperçu</h3>
        <iframe srcdoc="${escapeHtml(project.htmlCode)}" style="width: 100%; height: 70vh; border: 1px solid var(--neutral-300); border-radius: 8px;"></iframe>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function viewCode(projectId) {
    const project = findProject(projectId);
    if (!project) return;

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h3 style="margin-bottom: 16px; color: var(--primary);">${project.title} - Code Source</h3>
        <div style="background: var(--neutral-900); color: var(--neutral-100); padding: 24px; border-radius: 8px; overflow-x: auto;">
            <pre><code>${escapeHtml(project.htmlCode)}</code></pre>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function findProject(projectId) {
    for (const category of Object.keys(config.projects)) {
        const project = config.projects[category].find(p => p.id === projectId);
        if (project) return project;
    }
    return null;
}

// === UTILITAIRES ===
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// === EXEMPLES DE PROJETS (À REMPLACER PAR VOS VRAIS PROJETS) ===
function addProjectsExamples() {
    // *** SUPPRIMEZ CETTE FONCTION ET UTILISEZ LES FONCTIONS add___() CI-DESSUS ***
    
    // Exemples de projets 3D
    addProject3D({
        title: "Villa Moderne - Revit",
        description: "Modélisation complète d'une villa contemporaine avec Revit. Incluant tous les plans techniques, coupes et rendus 3D photoréalistes.",
        imageUrl: "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["Revit", "Architecture", "Résidentiel", "BIM"]
    });

    addProject3D({
        title: "Immeuble Résidentiel - AutoCAD",
        description: "Conception d'un immeuble de 8 étages avec AutoCAD. Plans détaillés, façades et modélisation 3D complète.",
        imageUrl: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["AutoCAD", "Immeuble", "Technique", "Plans"]
    });

    // Exemples d'affiches
    addProjectAffiche({
        title: "Festival de Jazz 2024",
        description: "Affiche événementielle pour le festival de jazz annuel. Design moderne avec typographie personnalisée et palette colorée.",
        imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["Événement", "Jazz", "Print", "Typographie"]
    });

    addProjectAffiche({
        title: "Conférence Tech",
        description: "Design d'affiche pour conférence technologique. Style minimaliste avec éléments géométriques et couleurs corporate.",
        imageUrl: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["Tech", "Corporate", "Minimal", "Géométrie"]
    });

    // Exemples de code
    addProjectCode({
        title: "Landing Page Responsive",
        description: "Page d'atterrissage moderne avec animations CSS et design responsive. Optimisée pour la conversion.",
        htmlCode: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page Moderne</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; }
        .hero { 
            height: 100vh; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex; 
            align-items: center; 
            justify-content: center; 
            text-align: center; 
            color: white;
        }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; animation: fadeInUp 1s ease; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; animation: fadeInUp 1s ease 0.3s both; }
        .btn { 
            background: #ff6b6b; 
            color: white; 
            padding: 15px 30px; 
            border: none; 
            border-radius: 30px; 
            font-size: 1.1rem; 
            cursor: pointer; 
            transition: transform 0.3s ease;
            animation: fadeInUp 1s ease 0.6s both;
        }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3); }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .features { 
            padding: 80px 20px; 
            max-width: 1200px; 
            margin: 0 auto; 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 40px; 
        }
        .feature { 
            text-align: center; 
            padding: 40px 20px; 
            border-radius: 15px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
            transition: transform 0.3s ease; 
        }
        .feature:hover { transform: translateY(-10px); }
        .feature-icon { 
            width: 80px; 
            height: 80px; 
            background: linear-gradient(135deg, #667eea, #764ba2); 
            border-radius: 50%; 
            margin: 0 auto 20px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 2rem; 
            color: white; 
        }
    </style>
</head>
<body>
    <section class="hero">
        <div>
            <h1>Bienvenue sur Mon Site</h1>
            <p>Découvrez des solutions innovantes pour votre entreprise</p>
            <button class="btn">Commencer Maintenant</button>
        </div>
    </section>
    
    <section class="features">
        <div class="feature">
            <div class="feature-icon">🚀</div>
            <h3>Performance</h3>
            <p>Des solutions rapides et efficaces pour booster votre productivité.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">💡</div>
            <h3>Innovation</h3>
            <p>Technologies de pointe pour rester à la hauteur de vos ambitions.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">🎯</div>
            <h3>Précision</h3>
            <p>Résultats ciblés et mesurables pour atteindre vos objectifs.</p>
        </div>
    </section>
</body>
</html>`,
        tags: ["HTML", "CSS", "Responsive", "Animations", "Landing"]
    });

    // Exemples de tatouages
    addProjectTatouage({
        title: "Dragon Japonais",
        description: "Design de tatouage inspiré de l'art traditionnel japonais. Travail détaillé sur les écailles et les nuages.",
        imageUrl: "https://images.pexels.com/photos/1146603/pexels-photo-1146603.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["Japonais", "Dragon", "Traditionnel", "Noir et Gris"]
    });

    addProjectTatouage({
        title: "Mandala Géométrique",
        description: "Mandala moderne avec éléments géométriques. Symétrie parfaite et détails fins pour un rendu élégant.",
        imageUrl: "https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["Mandala", "Géométrique", "Symétrie", "Fin Work"]
    });
}

/* 
=== INSTRUCTIONS POUR AJOUTER VOS PROJETS ===

1. PROJETS 3D (Revit/AutoCAD) :
   Utilisez la fonction addProject3D() avec :
   - title: Nom du projet
   - description: Description détaillée
   - imageUrl: URL de l'image du rendu 3D
   - tags: Array des technologies utilisées

   Exemple :
   addProject3D({
       title: "Mon Projet Revit",
       description: "Description de mon projet...",
       imageUrl: "chemin/vers/mon/image.jpg",
       tags: ["Revit", "BIM", "Architecture"]
   });

2. AFFICHES ÉVÉNEMENTIELLES :
   Utilisez la fonction addProjectAffiche() avec les mêmes paramètres

3. PROJETS CODE HTML :
   Utilisez la fonction addProjectCode() avec :
   - title, description, tags comme ci-dessus
   - htmlCode: Le code HTML complet de votre page

4. DESIGNS DE TATOUAGE :
   Utilisez la fonction addProjectTatouage() avec les paramètres standard

IMPORTANT : 
- Supprimez la fonction addProjectsExamples() une fois vos vrais projets ajoutés
- Remplacez les URLs d'images par vos vraies images
- Organisez vos images dans un dossier "images/" de votre repository GitHub
*/

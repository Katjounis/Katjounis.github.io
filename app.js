// ===== CONFIGURATION GLOBALE =====
const CONFIG = {
    animationDuration: 300,
    fadeInDelay: 100,
    scrollThreshold: 100,
    projects: {
        '3d': [],
        'affiches': [],
        'code': [],
        'tatouage': []
    }
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initNavigation();
    initScrollEffects();
    initModals();
    initAnimations();
    loadProjects();
    addExampleProjects(); // Supprimez cette ligne une fois vos vrais projets ajoutés
});

// ===== LOADER =====
function initLoader() {
    const loader = document.getElementById('loader');
    
    // Simulation de chargement
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Démarrer les animations du hero
        setTimeout(() => {
            initHeroAnimations();
        }, 500);
    }, 2000);
}

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Menu mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
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
            document.body.style.overflow = 'auto';
        });
    });

    // Scroll header effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function switchTab(tabId) {
    // Mettre à jour les liens de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Mettre à jour les sections avec animation
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    setTimeout(() => {
        document.getElementById(tabId).classList.add('active');
        
        // Animer les cartes de la nouvelle section
        setTimeout(() => {
            animateProjectCards(tabId);
        }, 200);
    }, CONFIG.fadeInDelay);

    // Scroll vers le contenu
    document.getElementById('main').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// ===== HERO ANIMATIONS =====
function initHeroAnimations() {
    // Animation des compteurs
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        animateCounter(counter, target);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 40);
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observer les cartes de projets
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const cards = document.querySelectorAll('.project-card, .code-project');
            cards.forEach(card => observer.observe(card));
        }, 1000);
    });
}

function animateProjectCards(sectionId) {
    const section = document.getElementById(sectionId);
    const cards = section.querySelectorAll('.project-card, .code-project');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===== GESTION DES PROJETS =====

// *** FONCTION POUR AJOUTER VOS PROJETS 3D ***
function addProject3D(project) {
    CONFIG.projects['3d'].push({
        id: project.id || generateId(),
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        tags: project.tags || [],
        link: project.link || null,
        featured: project.featured || false
    });
    renderProjects('3d');
}

// *** FONCTION POUR AJOUTER VOS AFFICHES ***
function addProjectAffiche(project) {
    CONFIG.projects['affiches'].push({
        id: project.id || generateId(),
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        tags: project.tags || [],
        link: project.link || null,
        featured: project.featured || false
    });
    renderProjects('affiches');
}

// *** FONCTION POUR AJOUTER VOS PROJETS CODE ***
function addProjectCode(project) {
    CONFIG.projects['code'].push({
        id: project.id || generateId(),
        title: project.title,
        description: project.description,
        htmlCode: project.htmlCode,
        tags: project.tags || [],
        link: project.link || null,
        featured: project.featured || false
    });
    renderProjects('code');
}

// *** FONCTION POUR AJOUTER VOS DESIGNS DE TATOUAGE ***
function addProjectTatouage(project) {
    CONFIG.projects['tatouage'].push({
        id: project.id || generateId(),
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        tags: project.tags || [],
        style: project.style || null,
        featured: project.featured || false
    });
    renderProjects('tatouage');
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function loadProjects() {
    renderProjects('3d');
    renderProjects('affiches');
    renderProjects('code');
    renderProjects('tatouage');
}

function renderProjects(category) {
    const container = document.getElementById(getContainerId(category));
    if (!container) return;

    const projects = CONFIG.projects[category];
    
    if (projects.length === 0) {
        container.innerHTML = createEmptyState(category);
        return;
    }

    if (category === 'code') {
        renderCodeProjects(container, projects);
    } else {
        renderImageProjects(container, projects, category);
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

function createEmptyState(category) {
    const icons = {
        '3d': 'fas fa-cube',
        'affiches': 'fas fa-palette',
        'code': 'fas fa-code',
        'tatouage': 'fas fa-brush'
    };
    
    const messages = {
        '3d': 'Vos maquettes 3D apparaîtront ici',
        'affiches': 'Vos affiches événementielles apparaîtront ici',
        'code': 'Vos projets de développement apparaîtront ici',
        'tatouage': 'Vos designs de tatouage apparaîtront ici'
    };

    return `
        <div style="text-align: center; padding: 80px 20px; color: var(--gray-500);">
            <div style="width: 120px; height: 120px; background: var(--gray-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 3rem;">
                <i class="${icons[category]}"></i>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px; color: var(--gray-700);">
                ${messages[category]}
            </h3>
            <p style="font-size: 1rem; margin-bottom: 24px;">
                Utilisez les fonctions <code>addProject${category.charAt(0).toUpperCase() + category.slice(1)}()</code> dans le fichier js/script.js
            </p>
            <div style="background: var(--gray-100); padding: 16px; border-radius: 12px; font-family: monospace; font-size: 0.875rem; color: var(--gray-600); text-align: left; max-width: 400px; margin: 0 auto;">
                addProject${category.charAt(0).toUpperCase() + category.slice(1)}({<br>
                &nbsp;&nbsp;title: "Mon projet",<br>
                &nbsp;&nbsp;description: "Description...",<br>
                &nbsp;&nbsp;imageUrl: "chemin/image.jpg",<br>
                &nbsp;&nbsp;tags: ["Tag1", "Tag2"]<br>
                });
            </div>
        </div>
    `;
}

function renderImageProjects(container, projects, category) {
    container.innerHTML = projects.map(project => `
        <div class="project-card" onclick="openImageModal('${project.imageUrl}', '${escapeHtml(project.title)}', '${escapeHtml(project.description)}')">
            <div class="project-image-container" style="position: relative; overflow: hidden;">
                <img src="${project.imageUrl}" alt="${escapeHtml(project.title)}" class="project-image" loading="lazy">
                <div class="project-overlay">
                    <div class="project-overlay-content">
                        <h4 class="project-overlay-title">${project.title}</h4>
                        <p class="project-overlay-description">${project.description.substring(0, 100)}...</p>
                    </div>
                </div>
                ${project.featured ? '<div style="position: absolute; top: 16px; right: 16px; background: var(--accent); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;"><i class="fas fa-star" style="margin-right: 4px;"></i>Featured</div>' : ''}
            </div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                ${project.tags && project.tags.length > 0 ? `
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="project-actions">
                    <button class="project-btn" onclick="event.stopPropagation(); openImageModal('${project.imageUrl}', '${escapeHtml(project.title)}', '${escapeHtml(project.description)}')">
                        <i class="fas fa-eye"></i>
                        Voir le projet
                    </button>
                    ${project.link ? `
                        <a href="${project.link}" class="project-btn secondary" target="_blank" onclick="event.stopPropagation();">
                            <i class="fas fa-external-link-alt"></i>
                            Lien externe
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function renderCodeProjects(container, projects) {
    container.innerHTML = projects.map(project => `
        <div class="code-project">
            <div class="code-header">
                <div class="code-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    ${project.tags && project.tags.length > 0 ? `
                        <div class="project-tags" style="margin-top: 16px;">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="code-actions">
                    <button class="code-btn" onclick="previewCode('${project.id}')">
                        <i class="fas fa-play"></i>
                        Aperçu Live
                    </button>
                    <button class="code-btn secondary" onclick="viewCode('${project.id}')">
                        <i class="fas fa-code"></i>
                        Voir le Code
                    </button>
                    ${project.link ? `
                        <a href="${project.link}" class="code-btn secondary" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            Site Live
                        </a>
                    ` : ''}
                </div>
            </div>
            <div class="code-content">
                <div class="code-preview">
                    <pre><code>${escapeHtml(project.htmlCode.substring(0, 500))}${project.htmlCode.length > 500 ? '\n\n... (Code complet disponible en cliquant sur "Voir le Code")' : ''}</code></pre>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== MODAL =====
function initModals() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    const contactModal = document.getElementById('contactModal');
    const contactClose = document.getElementById('contactClose');
    const btnContact = document.getElementById('btnContact');

    // Modal principal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // Modal contact
    btnContact.addEventListener('click', openContactModal);
    contactClose.addEventListener('click', closeContactModal);
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal || e.target.classList.contains('modal-overlay')) {
            closeContactModal();
        }
    });

    // Fermeture avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeContactModal();
        }
    });
}

function openImageModal(imageUrl, title, description = '') {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: var(--shadow-2xl);">
            <div style="margin-top: 24px;">
                <h3 style="font-size: 2rem; font-weight: 700; color: var(--gray-900); margin-bottom: 12px;">${title}</h3>
                ${description ? `<p style="font-size: 1.1rem; color: var(--gray-600); line-height: 1.6; max-width: 600px; margin: 0 auto;">${description}</p>` : ''}
            </div>
        </div>
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
        <div>
            <div style="text-align: center; margin-bottom: 24px;">
                <h3 style="font-size: 2rem; font-weight: 700; color: var(--gray-900); margin-bottom: 8px;">${project.title}</h3>
                <p style="color: var(--gray-600);">Aperçu en direct du projet</p>
            </div>
            <div style="border: 2px solid var(--gray-200); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-2xl);">
                <div style="background: var(--gray-100); padding: 12px 16px; border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; background: #ff5f57; border-radius: 50%;"></div>
                    <div style="width: 12px; height: 12px; background: #ffbd2e; border-radius: 50%;"></div>
                    <div style="width: 12px; height: 12px; background: #28ca42; border-radius: 50%;"></div>
                    <span style="margin-left: 12px; font-size: 0.875rem; color: var(--gray-600);">Aperçu Live</span>
                </div>
                <iframe srcdoc="${escapeHtml(project.htmlCode)}" style="width: 100%; height: 70vh; border: none; background: white;"></iframe>
            </div>
        </div>
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
        <div>
            <div style="text-align: center; margin-bottom: 24px;">
                <h3 style="font-size: 2rem; font-weight: 700; color: var(--gray-900); margin-bottom: 8px;">${project.title}</h3>
                <p style="color: var(--gray-600);">Code source complet</p>
            </div>
            <div style="position: relative;">
                <button onclick="copyCode('${projectId}')" style="position: absolute; top: 16px; right: 16px; background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.875rem; cursor: pointer; z-index: 10; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-copy"></i>
                    Copier
                </button>
                <div style="background: var(--gray-900); color: var(--gray-100); padding: 24px; border-radius: 12px; overflow-x: auto; max-height: 70vh; overflow-y: auto;">
                    <pre style="margin: 0; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 0.875rem; line-height: 1.6;"><code id="code-${projectId}">${escapeHtml(project.htmlCode)}</code></pre>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function copyCode(projectId) {
    const project = findProject(projectId);
    if (!project) return;

    navigator.clipboard.writeText(project.htmlCode).then(() => {
        // Feedback visuel
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copié !';
        button.style.background = 'var(--success)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = 'var(--primary)';
        }, 2000);
    });
}

function openContactModal() {
    const contactModal = document.getElementById('contactModal');
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeContactModal() {
    const contactModal = document.getElementById('contactModal');
    contactModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function findProject(projectId) {
    for (const category of Object.keys(CONFIG.projects)) {
        const project = CONFIG.projects[category].find(p => p.id === projectId);
        if (project) return project;
    }
    return null;
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Animation des éléments au scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));
}

// ===== UTILITAIRES =====
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== EXEMPLES DE PROJETS (SUPPRIMEZ CETTE SECTION) =====
function addExampleProjects() {
    // *** SUPPRIMEZ CETTE FONCTION ET UTILISEZ LES FONCTIONS add___() CI-DESSUS ***
    
    // Exemples de projets 3D
    addProject3D({
        title: "Villa Contemporaine Luxe",
        description: "Modélisation complète d'une villa de 450m² avec Revit. Conception architecturale moderne incluant plans détaillés, coupes techniques et rendus photoréalistes 4K. Projet résidentiel haut de gamme avec piscine et jardin paysager.",
        imageUrl: "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["Revit", "Architecture", "Résidentiel", "BIM", "Luxe"],
        featured: true
    });

    addProject3D({
        title: "Complexe Résidentiel Moderne",
        description: "Conception d'un ensemble résidentiel de 120 logements avec AutoCAD et Revit. Intégration urbaine, espaces verts, parking souterrain. Respect des normes RT2012 et accessibilité PMR.",
        imageUrl: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["AutoCAD", "Revit", "Urbanisme", "Collectif", "RT2012"]
    });

    addProject3D({
        title: "Centre Commercial Innovant",
        description: "Modélisation 3D d'un centre commercial de 15000m² avec espaces de loisirs intégrés. Structure métallique complexe, verrières, systèmes de ventilation et éclairage naturel optimisé.",
        imageUrl: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["Revit", "Commercial", "Structure", "MEP", "Éclairage"]
    });

    // Exemples d'affiches
    addProjectAffiche({
        title: "Festival International de Jazz",
        description: "Affiche événementielle pour le festival de jazz de Montreux. Design vintage moderne avec typographie personnalisée, palette dorée et éléments musicaux stylisés. Déclinaisons print et digital.",
        imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["Événement", "Jazz", "Print", "Typographie", "Vintage"],
        featured: true
    });

    addProjectAffiche({
        title: "Conférence Tech Innovation",
        description: "Série d'affiches pour conférence technologique. Style minimaliste avec éléments géométriques, couleurs corporate et iconographie tech. Adaptation multi-formats pour réseaux sociaux.",
        imageUrl: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["Tech", "Corporate", "Minimal", "Géométrie", "Digital"]
    });

    addProjectAffiche({
        title: "Festival Gastronomique",
        description: "Campagne visuelle complète pour festival culinaire. Photographie food styling, typographie gourmande, palette chaude. Déclinaisons affichage urbain, flyers et merchandising.",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["Gastronomie", "Food", "Festival", "Photographie", "Branding"]
    });

    // Exemples de code
    addProjectCode({
        title: "Portfolio Interactif Créatif",
        description: "Site portfolio moderne avec animations CSS avancées, transitions fluides et design responsive. Optimisé pour les performances et l'accessibilité. Interface utilisateur intuitive avec navigation par sections.",
        htmlCode: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Créatif</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .hero {
            text-align: center;
            padding: 100px 0;
            color: white;
        }
        .hero h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: slideDown 1s ease;
        }
        .hero p {
            font-size: 1.5rem;
            margin-bottom: 40px;
            animation: fadeIn 1s ease 0.5s both;
        }
        .cta-button {
            background: #ff6b6b;
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: slideUp 1s ease 1s both;
        }
        .cta-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 100px;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            color: white;
            transition: transform 0.3s ease;
        }
        .feature:hover {
            transform: translateY(-10px);
        }
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 20px;
            display: block;
        }
        .feature h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
        }
        .floating-shapes {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
        .shape {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }
        .shape:nth-child(1) {
            width: 80px;
            height: 80px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }
        .shape:nth-child(2) {
            width: 120px;
            height: 120px;
            top: 60%;
            right: 10%;
            animation-delay: 2s;
        }
        .shape:nth-child(3) {
            width: 60px;
            height: 60px;
            bottom: 20%;
            left: 20%;
            animation-delay: 4s;
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .hero p { font-size: 1.2rem; }
            .features { grid-template-columns: 1fr; gap: 20px; }
        }
    </style>
</head>
<body>
    <div class="floating-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
    </div>
    
    <div class="container">
        <section class="hero">
            <h1>Portfolio Créatif</h1>
            <p>Découvrez mes créations et projets innovants</p>
            <button class="cta-button" onclick="alert('Contactez-moi pour discuter de votre projet !')">
                Travaillons Ensemble
            </button>
        </section>
        
        <section class="features">
            <div class="feature">
                <span class="feature-icon">🎨</span>
                <h3>Design Créatif</h3>
                <p>Création de designs uniques et impactants qui marquent les esprits et transmettent votre message.</p>
            </div>
            <div class="feature">
                <span class="feature-icon">💻</span>
                <h3>Développement Web</h3>
                <p>Sites web modernes, responsives et optimisés pour offrir la meilleure expérience utilisateur.</p>
            </div>
            <div class="feature">
                <span class="feature-icon">🚀</span>
                <h3>Performance</h3>
                <p>Solutions techniques performantes et évolutives pour accompagner votre croissance.</p>
            </div>
        </section>
    </div>
    
    <script>
        // Animation au scroll
        window.addEventListener('scroll', () => {
            const features = document.querySelectorAll('.feature');
            features.forEach((feature, index) => {
                const rect = feature.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    feature.style.animation = \`slideUp 0.6s ease \${index * 0.2}s both\`;
                }
            });
        });
        
        // Interaction avec les formes flottantes
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                shape.style.transform = \`translate(\${x * speed * 20}px, \${y * speed * 20}px)\`;
            });
        });
    </script>
</body>
</html>`,
        tags: ["HTML", "CSS", "JavaScript", "Responsive", "Animations", "Modern"],
        featured: true
    });

    addProjectCode({
        title: "Dashboard Analytics Moderne",
        description: "Interface d'administration avec graphiques interactifs, tableaux de données et widgets personnalisables. Design system cohérent et navigation intuitive pour la gestion de données complexes.",
        htmlCode: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Analytics</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8fafc;
            color: #334155;
        }
        .dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
        }
        .sidebar {
            background: #1e293b;
            color: white;
            padding: 20px;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 40px;
            text-align: center;
        }
        .nav-item {
            padding: 12px 16px;
            margin-bottom: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .nav-item:hover, .nav-item.active {
            background: #3b82f6;
        }
        .main-content {
            padding: 30px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 2rem;
            color: #1e293b;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        .stat-label {
            color: #64748b;
            font-size: 0.9rem;
        }
        .chart-container {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .chart-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1e293b;
        }
        .chart {
            height: 200px;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.1rem;
        }
        .table-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        .table th {
            background: #f8fafc;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
        }
        .table td {
            padding: 15px;
            border-bottom: 1px solid #f3f4f6;
        }
        .table tr:hover {
            background: #f8fafc;
        }
        .status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        .status.success {
            background: #dcfce7;
            color: #166534;
        }
        .status.warning {
            background: #fef3c7;
            color: #92400e;
        }
        .status.error {
            background: #fee2e2;
            color: #991b1b;
        }
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
            .sidebar {
                display: none;
            }
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <aside class="sidebar">
            <div class="logo">📊 Analytics</div>
            <nav>
                <div class="nav-item active">📈 Dashboard</div>
                <div class="nav-item">👥 Utilisateurs</div>
                <div class="nav-item">📊 Rapports</div>
                <div class="nav-item">⚙️ Paramètres</div>
            </nav>
        </aside>
        
        <main class="main-content">
            <header class="header">
                <h1>Dashboard Analytics</h1>
                <div style="color: #64748b;">Dernière mise à jour: il y a 5 min</div>
            </header>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">12,543</div>
                    <div class="stat-label">Visiteurs Uniques</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">€45,210</div>
                    <div class="stat-label">Revenus</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">89.2%</div>
                    <div class="stat-label">Taux de Conversion</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">2.4s</div>
                    <div class="stat-label">Temps de Chargement</div>
                </div>
            </div>
            
            <div class="chart-container">
                <div class="chart-title">Évolution du Trafic</div>
                <div class="chart">
                    📈 Graphique interactif (intégration Chart.js recommandée)
                </div>
            </div>
            
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Email</th>
                            <th>Statut</th>
                            <th>Dernière Connexion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Marie Dupont</td>
                            <td>marie@example.com</td>
                            <td><span class="status success">Actif</span></td>
                            <td>Il y a 2 heures</td>
                        </tr>
                        <tr>
                            <td>Jean Martin</td>
                            <td>jean@example.com</td>
                            <td><span class="status warning">Inactif</span></td>
                            <td>Il y a 1 jour</td>
                        </tr>
                        <tr>
                            <td>Sophie Bernard</td>
                            <td>sophie@example.com</td>
                            <td><span class="status success">Actif</span></td>
                            <td>Il y a 30 min</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
    
    <script>
        // Simulation de données en temps réel
        setInterval(() => {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                if (stat.textContent.includes('€')) {
                    const current = parseInt(stat.textContent.replace(/[€,]/g, ''));
                    const newValue = current + Math.floor(Math.random() * 100);
                    stat.textContent = '€' + newValue.toLocaleString();
                }
            });
        }, 5000);
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelector('.nav-item.active').classList.remove('active');
                item.classList.add('active');
            });
        });
    </script>
</body>
</html>`,
        tags: ["Dashboard", "Analytics", "Admin", "Responsive", "JavaScript", "UI/UX"]
    });

    // Exemples de tatouages
    addProjectTatouage({
        title: "Dragon Japonais Traditionnel",
        description: "Design de tatouage inspiré de l'art traditionnel japonais. Travail minutieux sur les détails des écailles, les nuages stylisés et les flammes. Composition dynamique adaptable au dos complet ou demi-manche.",
        imageUrl: "https://images.pexels.com/photos/1146603/pexels-photo-1146603.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["Japonais", "Dragon", "Traditionnel", "Noir et Gris", "Grande Pièce"],
        style: "Traditionnel Japonais",
        featured: true
    });

    addProjectTatouage({
        title: "Mandala Géométrique Moderne",
        description: "Mandala contemporain alliant géométrie sacrée et éléments floraux stylisés. Symétrie parfaite avec détails fins et ombrages subtils. Design modulaire adaptable selon la zone à tatouer.",
        imageUrl: "https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["Mandala", "Géométrique", "Symétrie", "Fine Line", "Spirituel"],
        style: "Géométrique Moderne"
    });

    addProjectTatouage({
        title: "Portrait Réaliste Noir et Gris",
        description: "Portrait hyperréaliste en noir et gris avec technique de pointillisme et ombrages dégradés. Capture des expressions et émotions avec un niveau de détail exceptionnel.",
        imageUrl: "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["Portrait", "Réalisme", "Noir et Gris", "Pointillisme", "Émotion"],
        style: "Réalisme"
    });

    addProjectTatouage({
        title: "Composition Florale Aquarelle",
        description: "Design floral moderne avec technique aquarelle et éclaboussures de couleur. Mélange de réalisme botanique et abstraction artistique pour un rendu unique et vibrant.",
        imageUrl: "https://images.pexels.com/photos/1557652/pexels-photo-1557652.jpeg?auto=compress&cs=tinysrgb&w=1200",
        tags: ["Floral", "Aquarelle", "Couleur", "Botanique", "Artistique"],
        style: "Aquarelle Moderne"
    });
}

/* 
=== GUIDE D'UTILISATION POUR VOS PROJETS ===

1. SUPPRIMEZ LA FONCTION addExampleProjects() une fois vos vrais projets ajoutés

2. PROJETS 3D - Utilisez addProject3D() :
   addProject3D({
       title: "Nom de votre projet",
       description: "Description détaillée...",
       imageUrl: "chemin/vers/votre/image.jpg",
       tags: ["Revit", "AutoCAD", "Architecture"],
       featured: true // optionnel, pour mettre en avant
   });

3. AFFICHES - Utilisez addProjectAffiche() :
   addProjectAffiche({
       title: "Nom de votre affiche",
       description: "Description...",
       imageUrl: "chemin/vers/votre/image.jpg",
       tags: ["Print", "Événement", "Design"]
   });

4. PROJETS CODE - Utilisez addProjectCode() :
   addProjectCode({
       title: "Nom de votre projet web",
       description: "Description...",
       htmlCode: "Votre code HTML complet ici...",
       tags: ["HTML", "CSS", "JavaScript"],
       link: "https://lien-vers-site-live.com" // optionnel
   });

5. TATOUAGES - Utilisez addProjectTatouage() :
   addProjectTatouage({
       title: "Nom de votre design",
       description: "Description...",
       imageUrl: "chemin/vers/votre/image.jpg",
       tags: ["Style", "Technique", "Couleur"],
       style: "Style du tatouage"
   });

IMPORTANT :
- Remplacez les URLs d'images par vos vraies images
- Organisez vos images dans un dossier "images/" de votre projet
- Testez localement avant de publier sur GitHub
- Les images doivent être optimisées (< 500KB) pour de bonnes performances
*/

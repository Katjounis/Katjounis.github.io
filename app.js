/**
 * Portfolio Professionnel - JavaScript Avancé
 * Gère la navigation, les thèmes, le formulaire multi-étapes et toutes les interactions
 */

// ===== VARIABLES GLOBALES =====
let currentSection = 'home';
let currentFormStep = 1;
let formData = {};
let theme = localStorage.getItem('theme') || 'light';

// Configuration des services pour l'estimation
const serviceConfig = {
  'site-web': {
    basePrice: 1500,
    timeline: '2-4 semaines',
    urgentMultiplier: 1.3,
    flexibleDiscount: 0.9
  },
  'app-web': {
    basePrice: 3500,
    timeline: '4-8 semaines',
    urgentMultiplier: 1.3,
    flexibleDiscount: 0.9
  },
  'automatisation': {
    basePrice: 450,
    timeline: '1-2 semaines',
    urgentMultiplier: 1.3,
    flexibleDiscount: 0.9
  },
  'design': {
    basePrice: 800,
    timeline: '2-4 semaines',
    urgentMultiplier: 1.3,
    flexibleDiscount: 0.9
  },
  'consulting': {
    basePrice: 85,
    timeline: 'Flexible',
    isHourly: true,
    urgentMultiplier: 1.2,
    flexibleDiscount: 1
  }
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialise toutes les fonctionnalités de l'application
 */
function initializeApp() {
    console.log('🚀 Initialisation du portfolio professionnel...');
    
    // Initialisation des modules
    initTheme();
    initNavigation();
    initMobileMenu();
    initServiceFilters();
    initPortfolioFilters();
    initAdvancedContactForm();
    initFooter();
    initScrollEffects();
    initServiceInteractions();
    
    console.log('✅ Portfolio initialisé avec succès');
}

// ===== GESTION DES THÈMES AVANCÉE =====

/**
 * Initialise le système de thème avec transitions fluides
 */
function initTheme() {
    applyTheme(theme);
    
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    updateThemeIcon(themeIcon);
    
    themeToggle.addEventListener('click', function() {
        toggleTheme();
        updateThemeIcon(themeIcon);
        
        // Animation de transition
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

/**
 * Applique le thème avec animations
 */
function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    theme = themeName;
    localStorage.setItem('theme', themeName);
    
    // Mise à jour des couleurs des graphiques si présents
    updateChartsTheme(themeName);
}

/**
 * Alterne entre les thèmes
 */
function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    
    // Notification subtile
    showNotification(`Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`, 'info', 2000);
}

/**
 * Met à jour l'icône du thème avec animation
 */
function updateThemeIcon(icon) {
    icon.style.transform = 'scale(0)';
    setTimeout(() => {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
        icon.style.transform = 'scale(1)';
    }, 150);
}

/**
 * Met à jour les couleurs des graphiques selon le thème
 */
function updateChartsTheme(themeName) {
    // À implémenter si des graphiques sont ajoutés
    console.log(`Mise à jour des graphiques pour le thème: ${themeName}`);
}

// ===== NAVIGATION AVANCÉE =====

/**
 * Initialise la navigation avec animations et historique
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('[data-section]');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            navigateToSection(targetSection, true);
        });
    });
    
    // Gestion de l'historique du navigateur
    window.addEventListener('popstate', function(e) {
        const section = e.state?.section || 'home';
        navigateToSection(section, false);
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            const sectionKeys = {
                '1': 'home',
                '2': 'services',
                '3': 'portfolio',
                '4': 'process',
                '5': 'testimonials',
                '6': 'contact'
            };
            
            if (sectionKeys[e.key]) {
                e.preventDefault();
                navigateToSection(sectionKeys[e.key], true);
            }
        }
    });
}

/**
 * Navigue vers une section avec animations avancées
 */
function navigateToSection(sectionName, addToHistory = true) {
    if (sectionName === currentSection) return;
    
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('[data-section]');
    const currentSectionEl = document.getElementById(currentSection);
    const targetSectionEl = document.getElementById(sectionName);
    
    if (!targetSectionEl) return;
    
    // Animation de sortie
    if (currentSectionEl) {
        currentSectionEl.style.opacity = '0';
        currentSectionEl.style.transform = 'translateY(-20px)';
    }
    
    setTimeout(() => {
        // Cache toutes les sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Supprime la classe active de tous les liens
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Affiche la section cible
        targetSectionEl.classList.add('active');
        targetSectionEl.style.opacity = '0';
        targetSectionEl.style.transform = 'translateY(20px)';
        
        // Active le lien correspondant
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Animation d'entrée
        setTimeout(() => {
            targetSectionEl.style.opacity = '1';
            targetSectionEl.style.transform = 'translateY(0)';
        }, 50);
        
        currentSection = sectionName;
        
        // Ajouter à l'historique
        if (addToHistory) {
            history.pushState({ section: sectionName }, '', `#${sectionName}`);
        }
        
        // Fermer le menu mobile
        closeMobileMenu();
        
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Analytics (à implémenter si nécessaire)
        trackPageView(sectionName);
        
    }, 150);
}

/**
 * Track des vues de page pour analytics
 */
function trackPageView(sectionName) {
    // Intégration Google Analytics ou autre
    console.log(`Page vue: ${sectionName}`);
}

// ===== MENU MOBILE AVANCÉ =====

/**
 * Initialise le menu mobile avec animations
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Ferme le menu si on clique en dehors
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Ferme le menu avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

/**
 * Ouvre/ferme le menu mobile avec animations
 */
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prévient le scroll du body quand le menu est ouvert
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Ferme le menu mobile
 */
function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== FILTRES DE SERVICES =====

/**
 * Initialise les filtres de services avec animations
 */
function initServiceFilters() {
    const filterBtns = document.querySelectorAll('.service-filters .filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Mise à jour des boutons actifs
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrage avec animations
            filterServices(filter, serviceCards);
        });
    });
}

/**
 * Filtre les services avec animations fluides
 */
function filterServices(filter, cards) {
    cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        // Animation de sortie
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        }, 150 + (index * 50)); // Décalage pour effet cascade
    });
}

// ===== FILTRES PORTFOLIO =====

/**
 * Initialise les filtres du portfolio
 */
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.portfolio-filters .filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Mise à jour des boutons actifs
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrage avec animations
            filterPortfolio(filter, portfolioItems);
        });
    });
    
    // Gestion des actions sur les projets
    initPortfolioActions();
}

/**
 * Filtre le portfolio avec animations
 */
function filterPortfolio(filter, items) {
    items.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        // Animation de sortie
        item.style.transform = 'translateY(20px)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.transform = 'translateY(0)';
                    item.style.opacity = '1';
                }, 50);
            } else {
                item.style.display = 'none';
            }
        }, 100 + (index * 30));
    });
}

/**
 * Initialise les actions du portfolio
 */
function initPortfolioActions() {
    const actionBtns = document.querySelectorAll('[data-action]');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const project = this.getAttribute('data-project');
            
            handlePortfolioAction(action, project);
        });
    });
}

/**
 * Gère les actions sur les projets du portfolio
 */
function handlePortfolioAction(action, project) {
    switch (action) {
        case 'view':
            showProjectModal(project);
            break;
        case 'details':
            showProjectDetails(project);
            break;
        default:
            console.log(`Action non reconnue: ${action}`);
    }
}

/**
 * Affiche la modal d'un projet
 */
function showProjectModal(project) {
    // Implémentation de la modal projet
    showNotification(`Ouverture du projet: ${project}`, 'info');
    console.log(`Affichage modal pour: ${project}`);
}

/**
 * Affiche les détails d'un projet
 */
function showProjectDetails(project) {
    // Implémentation des détails projet
    showNotification(`Détails du projet: ${project}`, 'info');
    console.log(`Affichage détails pour: ${project}`);
}

// ===== FORMULAIRE DE CONTACT AVANCÉ =====

/**
 * Initialise le formulaire multi-étapes avec validation avancée
 */
function initAdvancedContactForm() {
    const form = document.getElementById('contactForm');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const saveDraftBtn = document.getElementById('saveDraft');
    
    // Charge un éventuel brouillon
    loadFormDraft();
    
    // Event listeners pour la navigation
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => nextFormStep());
    });
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => prevFormStep());
    });
    
    // Event listeners pour les choix
    initFormChoices();
    
    // Sauvegarde et soumission
    saveDraftBtn.addEventListener('click', saveFormDraft);
    form.addEventListener('submit', handleAdvancedFormSubmit);
    
    // Auto-sauvegarde
    setInterval(autoSaveFormDraft, 30000);
    
    // Validation en temps réel
    initRealTimeValidation();
}

/**
 * Initialise les choix du formulaire avec interactions
 */
function initFormChoices() {
    // Choix de type de projet
    const projectTypeInputs = document.querySelectorAll('input[name="projectType"]');
    projectTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateFormData('projectType', this.value);
            enableNextButton(1);
            updateEstimation();
        });
    });
    
    // Choix de budget
    const budgetInputs = document.querySelectorAll('input[name="budget"]');
    budgetInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateFormData('budget', this.value);
            enableNextButton(2);
            updateEstimation();
        });
    });
    
    // Choix de délai
    const timelineInputs = document.querySelectorAll('input[name="timeline"]');
    timelineInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateFormData('timeline', this.value);
            enableNextButton(3);
            updateEstimation();
        });
    });
}

/**
 * Met à jour les données du formulaire
 */
function updateFormData(key, value) {
    formData[key] = value;
    console.log('Données formulaire mises à jour:', formData);
}

/**
 * Active le bouton suivant pour une étape
 */
function enableNextButton(step) {
    const nextBtn = document.querySelector(`[data-step="${step}"] .btn-next`);
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

/**
 * Passe à l'étape suivante du formulaire
 */
function nextFormStep() {
    if (currentFormStep < 4) {
        if (validateCurrentStep()) {
            currentFormStep++;
            updateFormStep();
            updateProgressBar();
        }
    }
}

/**
 * Revient à l'étape précédente
 */
function prevFormStep() {
    if (currentFormStep > 1) {
        currentFormStep--;
        updateFormStep();
        updateProgressBar();
    }
}

/**
 * Met à jour l'affichage de l'étape du formulaire
 */
function updateFormStep() {
    const steps = document.querySelectorAll('.form-step');
    const indicators = document.querySelectorAll('.step-indicator');
    
    // Cache toutes les étapes
    steps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Affiche l'étape courante
    const currentStepEl = document.querySelector(`[data-step="${currentFormStep}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Met à jour les indicateurs
    indicators.forEach((indicator, index) => {
        if (index + 1 <= currentFormStep) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

/**
 * Met à jour la barre de progression
 */
function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const percentage = (currentFormStep / 4) * 100;
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
}

/**
 * Valide l'étape courante du formulaire
 */
function validateCurrentStep() {
    switch (currentFormStep) {
        case 1:
            return formData.projectType !== undefined;
        case 2:
            return formData.budget !== undefined;
        case 3:
            return formData.timeline !== undefined;
        case 4:
            return validatePersonalInfo();
        default:
            return true;
    }
}

/**
 * Valide les informations personnelles
 */
function validatePersonalInfo() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!firstName || !lastName || !email || !message) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Veuillez entrer un email valide', 'error');
        return false;
    }
    
    return true;
}

/**
 * Valide un email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Initialise la validation en temps réel
 */
function initRealTimeValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

/**
 * Valide un champ spécifique
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Supprime les erreurs précédentes
    clearFieldError(field);
    
    // Validation selon le type de champ
    switch (fieldName) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Email invalide');
            }
            break;
        case 'phone':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Numéro de téléphone invalide');
            }
            break;
    }
}

/**
 * Valide un numéro de téléphone
 */
function isValidPhone(phone) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
}

/**
 * Affiche une erreur sur un champ
 */
function showFieldError(field, message) {
    field.style.borderColor = 'var(--error-color)';
    
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.color = 'var(--error-color)';
    errorEl.style.fontSize = 'var(--font-size-sm)';
    errorEl.style.marginTop = 'var(--space-xs)';
    
    field.parentNode.appendChild(errorEl);
}

/**
 * Supprime l'erreur d'un champ
 */
function clearFieldError(field) {
    field.style.borderColor = '';
    
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) {
        errorEl.remove();
    }
}

/**
 * Met à jour l'estimation du projet
 */
function updateEstimation() {
    if (!formData.projectType || !formData.budget || !formData.timeline) {
        return;
    }
    
    const estimation = calculateProjectEstimation();
    displayEstimation(estimation);
}

/**
 * Calcule l'estimation du projet
 */
function calculateProjectEstimation() {
    const serviceType = formData.projectType;
    const timeline = formData.timeline;
    const config = serviceConfig[serviceType];
    
    if (!config) return null;
    
    let price = config.basePrice;
    let timelineText = config.timeline;
    
    // Ajustements selon le délai
    switch (timeline) {
        case 'urgent':
            price *= config.urgentMultiplier;
            timelineText = 'Express (moins de 2 semaines)';
            break;
        case 'flexible':
            price *= config.flexibleDiscount;
            timelineText = 'Flexible (plus de 6 semaines)';
            break;
    }
    
    return {
        price: Math.round(price),
        timeline: timelineText,
        isHourly: config.isHourly || false
    };
}

/**
 * Affiche l'estimation du projet
 */
function displayEstimation(estimation) {
    if (!estimation) return;
    
    const estimationEl = document.getElementById('projectEstimation');
    const budgetEl = document.getElementById('estimatedBudget');
    const timelineEl = document.getElementById('estimatedTimeline');
    
    if (estimationEl && budgetEl && timelineEl) {
        const priceText = estimation.isHourly 
            ? `${estimation.price}€/heure`
            : `${estimation.price.toLocaleString()}€`;
            
        budgetEl.textContent = priceText;
        timelineEl.textContent = estimation.timeline;
        
        estimationEl.style.display = 'block';
        estimationEl.style.animation = 'fadeInUp 0.5s ease';
    }
}

/**
 * Gère la soumission du formulaire avancé
 */
async function handleAdvancedFormSubmit(e) {
    e.preventDefault();
    
    if (!validatePersonalInfo()) {
        return;
    }
    
    // Collecte toutes les données
    const completeFormData = collectAllFormData();
    
    try {
        // Affichage du loader
        showFormLoader(true);
        
        // Simulation d'envoi - Remplacer par votre endpoint
        await submitAdvancedForm(completeFormData);
        
        showNotification('Demande envoyée avec succès ! Je vous répondrai sous 24h.', 'success', 5000);
        resetAdvancedForm();
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
    } finally {
        showFormLoader(false);
    }
}

/**
 * Collecte toutes les données du formulaire
 */
function collectAllFormData() {
    const personalData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        company: document.getElementById('company').value.trim(),
        message: document.getElementById('message').value.trim(),
        newsletter: document.querySelector('input[name="newsletter"]').checked,
        urgentContact: document.querySelector('input[name="urgentContact"]').checked
    };
    
    return {
        ...formData,
        ...personalData,
        timestamp: new Date().toISOString(),
        estimation: calculateProjectEstimation()
    };
}

/**
 * Envoie le formulaire avancé
 */
async function submitAdvancedForm(data) {
    // Remplacer par votre endpoint Formspree ou autre service
    /*
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Erreur réseau');
    }
    
    return response.json();
    */
    
    // Simulation pour la démo
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Données envoyées:', data);
            resolve({ success: true });
        }, 2000);
    });
}

/**
 * Affiche/cache le loader du formulaire
 */
function showFormLoader(show) {
    const submitBtn = document.querySelector('button[type="submit"]');
    
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Envoi en cours...</span> ⏳';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Envoyer ma demande</span> <span class="btn-arrow">→</span>';
    }
}

/**
 * Remet à zéro le formulaire avancé
 */
function resetAdvancedForm() {
    currentFormStep = 1;
    formData = {};
    
    document.getElementById('contactForm').reset();
    updateFormStep();
    updateProgressBar();
    
    // Cache l'estimation
    const estimationEl = document.getElementById('projectEstimation');
    if (estimationEl) {
        estimationEl.style.display = 'none';
    }
    
    // Désactive les boutons suivant
    const nextBtns = document.querySelectorAll('.btn-next');
    nextBtns.forEach(btn => {
        btn.disabled = true;
    });
    
    clearFormDraft();
}

/**
 * Sauvegarde le brouillon du formulaire
 */
function saveFormDraft() {
    const draftData = {
        ...formData,
        currentStep: currentFormStep,
        personalData: {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            company: document.getElementById('company')?.value || '',
            message: document.getElementById('message')?.value || ''
        }
    };
    
    localStorage.setItem('advancedFormDraft', JSON.stringify(draftData));
    showNotification('Brouillon sauvegardé !', 'success', 2000);
}

/**
 * Auto-sauvegarde silencieuse
 */
function autoSaveFormDraft() {
    if (Object.keys(formData).length > 0 || currentFormStep > 1) {
        const draftData = {
            ...formData,
            currentStep: currentFormStep,
            personalData: {
                firstName: document.getElementById('firstName')?.value || '',
                lastName: document.getElementById('lastName')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                company: document.getElementById('company')?.value || '',
                message: document.getElementById('message')?.value || ''
            }
        };
        
        localStorage.setItem('advancedFormDraft', JSON.stringify(draftData));
    }
}

/**
 * Charge le brouillon du formulaire
 */
function loadFormDraft() {
    const draft = localStorage.getItem('advancedFormDraft');
    if (!draft) return;
    
    try {
        const draftData = JSON.parse(draft);
        
        // Restaure les données du formulaire
        formData = { ...draftData };
        delete formData.currentStep;
        delete formData.personalData;
        
        // Restaure l'étape courante
        if (draftData.currentStep) {
            currentFormStep = draftData.currentStep;
            updateFormStep();
            updateProgressBar();
        }
        
        // Restaure les choix
        if (draftData.projectType) {
            const projectInput = document.querySelector(`input[name="projectType"][value="${draftData.projectType}"]`);
            if (projectInput) {
                projectInput.checked = true;
                enableNextButton(1);
            }
        }
        
        if (draftData.budget) {
            const budgetInput = document.querySelector(`input[name="budget"][value="${draftData.budget}"]`);
            if (budgetInput) {
                budgetInput.checked = true;
                enableNextButton(2);
            }
        }
        
        if (draftData.timeline) {
            const timelineInput = document.querySelector(`input[name="timeline"][value="${draftData.timeline}"]`);
            if (timelineInput) {
                timelineInput.checked = true;
                enableNextButton(3);
            }
        }
        
        // Restaure les données personnelles
        if (draftData.personalData) {
            Object.keys(draftData.personalData).forEach(key => {
                const field = document.getElementById(key);
                if (field && draftData.personalData[key]) {
                    field.value = draftData.personalData[key];
                }
            });
        }
        
        // Met à jour l'estimation
        updateEstimation();
        
        showNotification('Brouillon restauré', 'info', 2000);
        
    } catch (error) {
        console.error('Erreur lors du chargement du brouillon:', error);
        localStorage.removeItem('advancedFormDraft');
    }
}

/**
 * Supprime le brouillon
 */
function clearFormDraft() {
    localStorage.removeItem('advancedFormDraft');
}

// ===== INTERACTIONS SERVICES =====

/**
 * Initialise les interactions sur les services
 */
function initServiceInteractions() {
    const serviceBtns = document.querySelectorAll('.btn-service');
    
    serviceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            handleServiceAction(service);
        });
    });
}

/**
 * Gère les actions sur les services
 */
function handleServiceAction(service) {
    // Pré-remplit le formulaire avec le service sélectionné
    const serviceMapping = {
        'site-web': 'site-web',
        'app-web': 'site-web',
        'google-sheets': 'automatisation',
        'python-scripts': 'automatisation',
        'ui-ux-design': 'design',
        'consulting': 'consulting'
    };
    
    const projectType = serviceMapping[service];
    if (projectType) {
        formData.projectType = projectType;
        
        // Navigue vers le contact
        navigateToSection('contact', true);
        
        // Pré-sélectionne le type de projet après un délai
        setTimeout(() => {
            const projectInput = document.querySelector(`input[name="projectType"][value="${projectType}"]`);
            if (projectInput) {
                projectInput.checked = true;
                enableNextButton(1);
                updateEstimation();
            }
        }, 500);
    }
    
    showNotification(`Service sélectionné: ${service}`, 'info', 2000);
}

// ===== EFFETS DE SCROLL =====

/**
 * Initialise les effets de scroll
 */
function initScrollEffects() {
    // Parallax léger sur le hero
    window.addEventListener('scroll', throttle(handleScroll, 16));
    
    // Intersection Observer pour les animations
    initIntersectionObserver();
}

/**
 * Gère les effets de scroll
 */
function handleScroll() {
    const scrollY = window.scrollY;
    const heroCard = document.querySelector('.hero-card');
    
    if (heroCard && scrollY < window.innerHeight) {
        const parallaxSpeed = 0.5;
        heroCard.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
    }
}

/**
 * Initialise l'Intersection Observer pour les animations
 */
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe les éléments à animer
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .portfolio-item, .testimonial-card, .process-step'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// ===== SYSTÈME DE NOTIFICATIONS AVANCÉ =====

/**
 * Affiche une notification avec options avancées
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Supprime les notifications existantes du même type
    removeExistingNotifications(type);
    
    const notification = createNotificationElement(message, type);
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        hideNotification(notification);
    }, duration);
    
    // Suppression au clic
    notification.addEventListener('click', () => {
        hideNotification(notification);
    });
}

/**
 * Crée l'élément de notification
 */
function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        minWidth: '300px',
        maxWidth: '500px',
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: colors[type],
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer'
    });
    
    // Style du contenu
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    });
    
    // Style du bouton fermer
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        marginLeft: 'auto'
    });
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideNotification(notification);
    });
    
    return notification;
}

/**
 * Cache une notification
 */
function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Supprime les notifications existantes d'un type
 */
function removeExistingNotifications(type) {
    const existingNotifications = document.querySelectorAll(`.notification-${type}`);
    existingNotifications.forEach(notification => {
        hideNotification(notification);
    });
}

// ===== FOOTER =====

/**
 * Initialise le footer
 */
function initFooter() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Liens du footer
    const footerLinks = document.querySelectorAll('.footer-section a[data-section]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            navigateToSection(section, true);
        });
    });
}

// ===== UTILITAIRES =====

/**
 * Fonction throttle pour optimiser les performances
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Fonction debounce
 */
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

/**
 * Détecte si l'utilisateur est sur mobile
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Détecte si l'utilisateur préfère le mode sombre
 */
function prefersColorScheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// ===== GESTION DES ERREURS GLOBALES =====

window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    
    // En production, envoyer à un service de monitoring
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.error.message,
            fatal: false
        });
    }
});

// ===== PERFORMANCE ET ANALYTICS =====

/**
 * Mesure les performances
 */
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`Temps de chargement: ${loadTime}ms`);
            
            // Envoyer à Google Analytics si disponible
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    name: 'load',
                    value: loadTime
                });
            }
        });
    }
}

// ===== MODE DEBUG =====

if (localStorage.getItem('debug') === 'true') {
    console.log('🔧 Mode debug activé');
    
    // API de debug
    window.portfolioDebug = {
        currentSection: () => currentSection,
        currentFormStep: () => currentFormStep,
        formData: () => formData,
        theme: () => theme,
        showNotification: showNotification,
        navigateToSection: navigateToSection,
        resetForm: resetAdvancedForm,
        serviceConfig: serviceConfig
    };
    
    // Raccourcis clavier de debug
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey) {
            switch (e.key) {
                case 'D':
                    e.preventDefault();
                    console.log('Debug info:', window.portfolioDebug);
                    break;
                case 'T':
                    e.preventDefault();
                    toggleTheme();
                    break;
                case 'N':
                    e.preventDefault();
                    showNotification('Test notification', 'info');
                    break;
            }
        }
    });
}

// Initialise les mesures de performance
measurePerformance();

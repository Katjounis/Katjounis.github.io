/**
 * Portfolio Site - JavaScript Principal
 * Gère la navigation, les thèmes, le formulaire et les interactions
 */

// ===== VARIABLES GLOBALES =====
let currentSection = 'home';
let theme = localStorage.getItem('theme') || 'light';

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialise toutes les fonctionnalités de l'application
 */
function initializeApp() {
    // Initialisation des différents modules
    initTheme();
    initNavigation();
    initMobileMenu();
    initContactForm();
    initFooter();
    
    console.log('🚀 Portfolio initialisé avec succès');
}

// ===== GESTION DES THÈMES =====

/**
 * Initialise le système de thème (clair/sombre)
 */
function initTheme() {
    // Applique le thème sauvegardé
    applyTheme(theme);
    
    // Event listener pour le bouton de thème
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Met à jour l'icône selon le thème
    updateThemeIcon(themeIcon);
    
    themeToggle.addEventListener('click', function() {
        toggleTheme();
        updateThemeIcon(themeIcon);
    });
}

/**
 * Applique le thème spécifié
 * @param {string} themeName - 'light' ou 'dark'
 */
function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    theme = themeName;
    localStorage.setItem('theme', themeName);
}

/**
 * Alterne entre les thèmes clair et sombre
 */
function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

/**
 * Met à jour l'icône du bouton de thème
 * @param {HTMLElement} icon - Élément contenant l'icône
 */
function updateThemeIcon(icon) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ===== GESTION DE LA NAVIGATION =====

/**
 * Initialise le système de navigation par onglets
 */
function initNavigation() {
    // Sélecteurs pour les liens de navigation et sections
    const navLinks = document.querySelectorAll('[data-section]');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            navigateToSection(targetSection);
        });
    });
}

/**
 * Navigue vers une section spécifique
 * @param {string} sectionName - Nom de la section cible
 */
function navigateToSection(sectionName) {
    if (sectionName === currentSection) return;
    
    // Cache toutes les sections
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('[data-section]');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Supprime la classe active de tous les liens
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Affiche la section cible
    const targetSection = document.getElementById(sectionName);
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }
    
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Ferme le menu mobile si ouvert
    closeMobileMenu();
    
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== MENU MOBILE =====

/**
 * Initialise le menu burger pour mobile
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        toggleMobileMenu();
    });
    
    // Ferme le menu si on clique en dehors
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

/**
 * Ouvre/ferme le menu mobile
 */
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

/**
 * Ferme le menu mobile
 */
function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// ===== GESTION DU FORMULAIRE DE CONTACT =====

/**
 * Initialise le formulaire de contact avec validation et sauvegarde
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const saveDraftBtn = document.getElementById('saveDraft');
    
    // Charge un éventuel brouillon sauvegardé
    loadDraft();
    
    // Event listeners
    form.addEventListener('submit', handleFormSubmit);
    saveDraftBtn.addEventListener('click', saveDraft);
    
    // Auto-sauvegarde toutes les 30 secondes
    setInterval(autoSaveDraft, 30000);
}

/**
 * Gère l'envoi du formulaire
 * @param {Event} e - Événement de soumission
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = getFormData();
    
    // Validation basique
    if (!validateForm(formData)) {
        showNotification('Veuillez remplir tous les champs requis.', 'error');
        return;
    }
    
    // Simulation d'envoi (remplacer par votre endpoint Formspree)
    submitForm(formData);
}

/**
 * Récupère les données du formulaire
 * @returns {Object} Données du formulaire
 */
function getFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };
}

/**
 * Valide les données du formulaire
 * @param {Object} data - Données à valider
 * @returns {boolean} True si valide
 */
function validateForm(data) {
    if (!data.name || !data.email || !data.message) {
        return false;
    }
    
    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Veuillez entrer un email valide.', 'error');
        return false;
    }
    
    return true;
}

/**
 * Envoie le formulaire (à adapter avec votre service)
 * @param {Object} data - Données du formulaire
 */
async function submitForm(data) {
    try {
        // Simulation d'envoi - Remplacez par votre endpoint Formspree
        // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // });
        
        // Simulation de succès
        await simulateApiCall();
        
        showNotification('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
        clearForm();
        clearDraft();
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
    }
}

/**
 * Simule un appel API (à supprimer en production)
 */
function simulateApiCall() {
    return new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });
}

/**
 * Sauvegarde un brouillon du formulaire
 */
function saveDraft() {
    const formData = getFormData();
    localStorage.setItem('contactFormDraft', JSON.stringify(formData));
    showNotification('Brouillon sauvegardé !', 'success');
}

/**
 * Auto-sauvegarde silencieuse
 */
function autoSaveDraft() {
    const formData = getFormData();
    
    // Ne sauvegarde que s'il y a du contenu
    if (formData.name || formData.email || formData.message) {
        localStorage.setItem('contactFormDraft', JSON.stringify(formData));
    }
}

/**
 * Charge un brouillon sauvegardé
 */
function loadDraft() {
    const draft = localStorage.getItem('contactFormDraft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            document.getElementById('name').value = data.name || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('message').value = data.message || '';
        } catch (error) {
            console.error('Erreur lors du chargement du brouillon:', error);
        }
    }
}

/**
 * Vide le formulaire
 */
function clearForm() {
    document.getElementById('contactForm').reset();
}

/**
 * Supprime le brouillon sauvegardé
 */
function clearDraft() {
    localStorage.removeItem('contactFormDraft');
}

// ===== SYSTÈME DE NOTIFICATIONS =====

/**
 * Affiche une notification temporaire
 * @param {string} message - Message à afficher
 * @param {string} type - Type de notification ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Supprime les notifications existantes
    removeExistingNotifications();
    
    // Crée la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // Couleurs selon le type
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        info: '#3B82F6'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Supprime les notifications existantes
 */
function removeExistingNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
}

// ===== INITIALISATION DU FOOTER =====

/**
 * Met à jour l'année dans le footer
 */
function initFooter() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== UTILITAIRES =====

/**
 * Débounce function pour optimiser les performances
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Délai en millisecondes
 * @returns {Function} Fonction debouncée
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

// ===== GESTION DES ERREURS GLOBALES =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    // En production, vous pourriez envoyer cette erreur à un service de monitoring
});

// ===== LOGS DE DÉVELOPPEMENT =====
if (localStorage.getItem('debug') === 'true') {
    console.log('Mode debug activé');
    window.portfolioDebug = {
        currentSection: () => currentSection,
        theme: () => theme,
        showNotification: showNotification,
        navigateToSection: navigateToSection
    };
}

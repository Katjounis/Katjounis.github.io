// Variables globales
let currentSection = 'home';
let isMenuOpen = false;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupFormValidation();
    setupScrollAnimations();
    setupMobileMenu();
});

// Initialisation de l'application
function initializeApp() {
    // Afficher la section par défaut
    showSection('home');
    
    // Animation d'apparition progressive
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        // Déclencher les animations de la section home
        triggerSectionAnimations('home');
    }, 100);
    
    // Précharger les animations des barres de compétences
    preloadSkillBars();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Fermer le menu mobile si ouvert
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Boutons CTA
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Ajouter effet de ripple
            createRippleEffect(this, event);
        });
    });
    
    // Cards de service
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Déterminer la section basée sur le contenu
            const content = this.textContent.toLowerCase();
            if (content.includes('développement') || content.includes('web')) {
                showSection('code');
            } else if (content.includes('revit') || content.includes('cao')) {
                showSection('revit');
            } else if (content.includes('tatouage') || content.includes('design')) {
                showSection('tattoo');
            }
        });
    });
    
    // Smooth scroll pour les ancres
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Gestion du scroll pour la navbar
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll vers le bas - cacher la navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll vers le haut - montrer la navbar
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Fonction pour changer de section
function showSection(sectionName) {
    // Masquer toutes les sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Désactiver tous les liens de navigation
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Afficher la section sélectionnée
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
        
        // Activer le lien de navigation correspondant
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Déclencher les animations spécifiques à la section
        setTimeout(() => {
            triggerSectionAnimations(sectionName);
        }, 100);
        
        // Animer les barres de compétences si c'est une section avec des compétences
        if (['code', 'revit', 'tattoo'].includes(sectionName)) {
            setTimeout(() => {
                animateSkillBars(sectionName);
            }, 500);
        }
    }
}

// Animations spécifiques aux sections
function triggerSectionAnimations(sectionName) {
    const section = document.getElementById(sectionName);
    if (!section) return;
    
    // Réinitialiser les animations
    const animatedElements = section.querySelectorAll('.service-card, .project-card, .tech-item, .process-step, .visual-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    });
    
    // Déclencher les animations avec des délais
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
    
    // Animations spéciales pour la section home
    if (sectionName === 'home') {
        const heroText = section.querySelector('.hero-text');
        const heroVisual = section.querySelector('.hero-visual');
        
        if (heroText) {
            heroText.style.opacity = '0';
            heroText.style.transform = 'translateX(-50px)';
            setTimeout(() => {
                heroText.style.transition = 'all 0.8s ease';
                heroText.style.opacity = '1';
                heroText.style.transform = 'translateX(0)';
            }, 300);
        }
        
        if (heroVisual) {
            heroVisual.style.opacity = '0';
            heroVisual.style.transform = 'translateX(50px)';
            setTimeout(() => {
                heroVisual.style.transition = 'all 0.8s ease';
                heroVisual.style.opacity = '1';
                heroVisual.style.transform = 'translateX(0)';
            }, 500);
        }
    }
}

// Animation des barres de compétences
function preloadSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        bar.setAttribute('data-width', width);
    });
}

function animateSkillBars(sectionName) {
    const section = document.getElementById(sectionName);
    const skillBars = section.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.transition = 'width 1.5s ease';
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

// Configuration du menu mobile
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                toggleMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        // Animation du hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        // Réinitialiser le hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Configuration de la validation du formulaire
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Validation en temps réel
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });
}

// Validation d'un champ individuel
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';
    
    // Réinitialiser les styles d'erreur
    clearFieldError(field);
    
    // Validation selon le type de champ
    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Le nom est requis';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Le nom doit contenir au moins 2 caractères';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMessage = 'L\'email est requis';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Format d\'email invalide';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[0-9+\-\s()]+$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Format de téléphone invalide';
            }
            break;
            
        case 'service':
            if (!value) {
                isValid = false;
                errorMessage = 'Veuillez sélectionner un service';
            }
            break;
            
        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'La description du projet est requise';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'La description doit contenir au moins 10 caractères';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Afficher une erreur sur un champ
function showFieldError(field, message) {
    field.style.borderColor = 'var(--error-color)';
    
    // Supprimer l'ancien message d'erreur s'il existe
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Créer un nouveau message d'erreur
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    
    // Ajouter une icône d'erreur
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-circle';
    errorElement.insertBefore(icon, errorElement.firstChild);
    
    field.parentNode.appendChild(errorElement);
}

// Effacer l'erreur d'un champ
function clearFieldError(field) {
    field.style.borderColor = 'var(--border)';
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Gestion de la soumission du formulaire
function handleFormSubmission(form) {
    const formData = new FormData(form);
    let isFormValid = true;
    
    // Valider tous les champs requis
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
        return;
    }
    
    // Désactiver le bouton de soumission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    // Simuler l'envoi (remplacer par un vrai service)
    setTimeout(() => {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        
        // Afficher un message de succès
        showNotification('Votre demande a été envoyée avec succès ! Je vous recontacterai rapidement.', 'success');
        
        // Réinitialiser le formulaire
        form.reset();
        
        // Optionnel : rediriger vers l'accueil après quelques secondes
        setTimeout(() => {
            showSection('home');
        }, 3000);
        
    }, 2000);
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--error-color)',
        warning: 'var(--warning-color)',
        info: 'var(--primary-color)'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-triangle',
        warning: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="close-btn">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Styles de la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        backgroundColor: 'white',
        color: colors[type],
        padding: '1rem 1.5rem',
        borderRadius: '0.75rem',
        boxShadow: 'var(--shadow-xl)',
        borderLeft: `4px solid ${colors[type]}`,
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '400px',
        minWidth: '300px',
        animation: 'slideInRight 0.3s ease',
        backdropFilter: 'blur(10px)'
    });
    
    const closeBtn = notification.querySelector('.close-btn');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: colors[type],
        cursor: 'pointer',
        fontSize: '0.875rem',
        opacity: '0.7',
        transition: 'opacity 0.2s ease',
        padding: '0.25rem'
    });
    
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
    
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Configuration des animations au défilement
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animables
    const animatableElements = document.querySelectorAll('.service-card, .project-card, .tech-item, .process-step, .contact-card, .contact-form-container');
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

// Effet de ripple pour les boutons
function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Fonctions utilitaires
function scrollToPortfolio() {
    const portfolioSection = document.querySelector('.services-overview');
    if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function getFormData() {
    const form = document.getElementById('contactForm');
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

// Ajout de styles CSS pour les animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .navbar {
        transition: transform 0.3s ease;
    }
    
    .hamburger span {
        transition: all 0.3s ease;
    }
`;

document.head.appendChild(style);

// Export des fonctions principales pour utilisation externe
window.portfolioApp = {
    showSection,
    getFormData,
    scrollToPortfolio,
    toggleMobileMenu
};

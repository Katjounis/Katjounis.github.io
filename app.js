// Variables globales
let currentTab = 'accueil';
let formSubmitted = false;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupFormValidation();
    setupScrollAnimations();
});

// Initialisation de l'application
function initializeApp() {
    // Afficher l'onglet par défaut
    showTab('accueil');
    
    // Configuration du menu mobile
    setupMobileMenu();
    
    // Animation d'apparition
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
    
    // Boutons CTA du hero
    const ctaButtons = document.querySelectorAll('.hero-cta .btn-primary, .hero-cta .btn-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('devis')) {
                showTab('contact');
            }
        });
    });
    
    // Cards de prévisualisation
    const previewCards = document.querySelectorAll('.preview-card');
    previewCards.forEach(card => {
        card.addEventListener('click', function() {
            // Détermine l'onglet basé sur le contenu de la card
            if (this.textContent.includes('Web')) {
                showTab('code');
            } else if (this.textContent.includes('3D')) {
                showTab('revit');
            } else if (this.textContent.includes('Tatouage')) {
                showTab('tatouage');
            }
        });
    });
    
    // Smooth scroll pour les ancres
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Fonction pour changer d'onglet
function showTab(tabName) {
    // Masquer tous les contenus d'onglets
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons de navigation
    const allNavButtons = document.querySelectorAll('.nav-btn');
    allNavButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
        currentTab = tabName;
        
        // Activer le bouton de navigation correspondant
        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Déclencher les animations spécifiques à l'onglet
        triggerTabAnimations(tabName);
    }
}

// Animations spécifiques aux onglets
function triggerTabAnimations(tabName) {
    const tab = document.getElementById(tabName);
    if (!tab) return;
    
    // Animation pour les cards
    const cards = tab.querySelectorAll('.project-card, .service-card, .preview-card, .skill-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
    
    // Animation pour les étapes du processus
    const steps = tab.querySelectorAll('.process-step');
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            step.style.transition = 'all 0.4s ease';
            step.style.opacity = '1';
            step.style.transform = 'scale(1)';
        }, index * 150 + 300);
    });
}

// Configuration du menu mobile
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('show');
            this.innerHTML = nav.classList.contains('show') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
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
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
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
    
    // Valider tous les champs
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
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    // Simuler l'envoi (remplacer par un vrai service)
    setTimeout(() => {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Afficher un message de succès
        showNotification('Votre demande a été envoyée avec succès ! Je vous recontacterai rapidement.', 'success');
        
        // Réinitialiser le formulaire
        form.reset();
        formSubmitted = true;
        
        // Optionnel : rediriger vers l'accueil après quelques secondes
        setTimeout(() => {
            showTab('accueil');
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
        borderRadius: '0.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        borderLeft: `4px solid ${colors[type]}`,
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease'
    });
    
    notification.querySelector('.close-btn').style.cssText = `
        background: none;
        border: none;
        color: ${colors[type]};
        cursor: pointer;
        font-size: 0.875rem;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    `;
    
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
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animables
    const animatableElements = document.querySelectorAll('.service-card, .project-card, .skill-item, .process-step, .contact-info, .contact-form');
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Fonction utilitaire pour obtenir les données du formulaire
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

// Fonction pour exporter les données (pour développement)
function exportFormData() {
    const data = getFormData();
    console.log('Données du formulaire:', data);
    return data;
}

// Ajout de styles CSS pour les animations via JavaScript
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav.show {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: var(--shadow);
        border-radius: 0 0 0.5rem 0.5rem;
    }
    
    @media (max-width: 768px) {
        .nav {
            display: none;
        }
    }
`;

document.head.appendChild(style);

// Export des fonctions principales pour utilisation externe
window.portfolioApp = {
    showTab,
    getFormData,
    exportFormData
};

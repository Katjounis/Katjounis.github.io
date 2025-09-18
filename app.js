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
    setupParallaxEffects();
});

// Initialisation de l'application
function initializeApp() {
    // Afficher la section par défaut
    showSection('home');
    
    // Animation d'apparition progressive
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        // Déclencher les animations de la section home
        triggerSectionAnimations('home');
    }, 100);
    
    // Précharger les animations des barres de compétences
    preloadSkillBars();
    
    // Ajouter des effets de particules
    createParticleEffect();
}

// Créer des effets de particules
function createParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 4 + 3}s infinite ease-in-out;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
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
    
    // Boutons CTA avec effet de pulse
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ajouter effet de ripple
            createRippleEffect(this, e);
        });
        
        // Ajouter effet de hover avancé
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Cards de service avec animations améliorées
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            // Effet de pulsation avant navigation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                
                // Déterminer la section basée sur le contenu
                const content = this.textContent.toLowerCase();
                if (content.includes('développement') || content.includes('web') || content.includes('python')) {
                    showSection('code');
                } else if (content.includes('revit') || content.includes('cao') || content.includes('modélisation')) {
                    showSection('revit');
                } else if (content.includes('tatouage') || content.includes('design') || content.includes('artistique')) {
                    showSection('tattoo');
                }
            }, 150);
        });
        
        // Animation d'entrée séquentielle
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotateX(0)';
        }, index * 200 + 500);
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
    
    // Gestion du scroll pour la navbar avec effet de glassmorphism
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Effet de transparence basé sur le scroll
        const opacity = Math.min(scrollTop / 200, 0.95);
        navbar.style.background = `rgba(255, 255, 255, ${0.85 + opacity * 0.15})`;
        navbar.style.backdropFilter = `blur(${10 + scrollTop * 0.1}px)`;
        
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

// Effets de parallaxe
function setupParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Fonction pour changer de section avec animations améliorées
function showSection(sectionName) {
    // Masquer toutes les sections avec fade out
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateX(-30px)';
        setTimeout(() => {
            section.classList.remove('active');
        }, 300);
    });
    
    // Désactiver tous les liens de navigation
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Afficher la section sélectionnée avec fade in
    setTimeout(() => {
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateX(0)';
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
            }, 200);
            
            // Animer les barres de compétences si c'est une section avec des compétences
            if (['code', 'revit', 'tattoo'].includes(sectionName)) {
                setTimeout(() => {
                    animateSkillBars(sectionName);
                }, 800);
            }
        }
    }, 300);
}

// Animations spécifiques aux sections améliorées
function triggerSectionAnimations(sectionName) {
    const section = document.getElementById(sectionName);
    if (!section) return;
    
    // Réinitialiser les animations
    const animatedElements = section.querySelectorAll('.service-card, .project-card, .tech-item, .process-step, .visual-card');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px) rotateX(10deg)';
        element.style.filter = 'blur(5px)';
    });
    
    // Déclencher les animations avec des délais et effets améliorés
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) rotateX(0)';
            element.style.filter = 'blur(0px)';
        }, index * 150 + 300);
    });
    
    // Animations spéciales pour la section home
    if (sectionName === 'home') {
        const heroText = section.querySelector('.hero-text');
        const heroVisual = section.querySelector('.hero-visual');
        
        if (heroText) {
            heroText.style.opacity = '0';
            heroText.style.transform = 'translateX(-80px) scale(0.9)';
            setTimeout(() => {
                heroText.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                heroText.style.opacity = '1';
                heroText.style.transform = 'translateX(0) scale(1)';
            }, 400);
        }
        
        if (heroVisual) {
            heroVisual.style.opacity = '0';
            heroVisual.style.transform = 'translateX(80px) scale(0.9)';
            setTimeout(() => {
                heroVisual.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                heroVisual.style.opacity = '1';
                heroVisual.style.transform = 'translateX(0) scale(1)';
            }, 600);
        }
    }
}

// Animation des barres de compétences améliorée
function preloadSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        bar.setAttribute('data-width', width);
        bar.style.position = 'relative';
        bar.style.overflow = 'hidden';
        
        // Ajouter un effet de brillance
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shine 2s infinite;
        `;
        bar.appendChild(shine);
    });
}

function animateSkillBars(sectionName) {
    const section = document.getElementById(sectionName);
    const skillBars = section.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = targetWidth;
            
            // Ajouter un effet de pulsation
            setTimeout(() => {
                bar.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
                setTimeout(() => {
                    bar.style.boxShadow = 'none';
                }, 500);
            }, 1800);
        }, index * 300);
    });
}

// Configuration du menu mobile amélioré
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
        navMenu.style.backdropFilter = 'blur(20px)';
        
        // Animation du hamburger améliorée
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[1].style.transform = 'scale(0)';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        
        // Animation des liens du menu
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-30px)';
            setTimeout(() => {
                link.style.transition = 'all 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, index * 100 + 200);
        });
    } else {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Réinitialiser le hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[1].style.transform = 'scale(1)';
        spans[2].style.transform = 'none';
    }
}

// Configuration de la validation du formulaire
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Validation en temps réel avec animations
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
        
        // Ajouter des effets de focus
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
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

// Afficher une erreur sur un champ avec animation
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
    
    // Supprimer l'ancien message d'erreur s'il existe
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Créer un nouveau message d'erreur avec animation
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;
    
    // Ajouter une icône d'erreur
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-triangle';
    errorElement.insertBefore(icon, errorElement.firstChild);
    
    field.parentNode.appendChild(errorElement);
    
    // Animation d'entrée
    setTimeout(() => {
        errorElement.style.opacity = '1';
        errorElement.style.transform = 'translateY(0)';
    }, 50);
}

// Effacer l'erreur d'un champ
function clearFieldError(field) {
    field.style.borderColor = '#e5e7eb';
    field.style.boxShadow = 'none';
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            errorElement.remove();
        }, 300);
    }
}

// Gestion de la soumission du formulaire avec animations
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
    
    // Désactiver le bouton de soumission avec animation
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.style.transform = 'scale(0.95)';
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    // Simuler l'envoi
    setTimeout(() => {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.style.transform = 'scale(1)';
        submitButton.innerHTML = originalText;
        
        // Afficher un message de succès
        showNotification('Votre demande a été envoyée avec succès ! Je vous recontacterai rapidement.', 'success');
        
        // Réinitialiser le formulaire avec animation
        const formElements = form.querySelectorAll('input, select, textarea');
        formElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0.5';
                element.value = '';
                setTimeout(() => {
                    element.style.opacity = '1';
                }, 200);
            }, index * 50);
        });
        
        // Optionnel : rediriger vers l'accueil après quelques secondes
        setTimeout(() => {
            showSection('home');
        }, 3000);
        
    }, 2000);
}

// Afficher une notification avec animations améliorées
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        notif.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notif.remove(), 300);
    });
    
    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
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
    
    // Styles de la notification améliorés
    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        color: colors[type],
        padding: '1.5rem 2rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        borderLeft: `4px solid ${colors[type]}`,
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '400px',
        minWidth: '300px',
        animation: 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    });
    
    const closeBtn = notification.querySelector('.close-btn');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: colors[type],
        cursor: 'pointer',
        fontSize: '1rem',
        opacity: '0.7',
        transition: 'all 0.2s ease',
        padding: '0.5rem',
        borderRadius: '0.5rem'
    });
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
        closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.7';
        closeBtn.style.backgroundColor = 'transparent';
    });
    
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// Configuration des animations au défilement améliorées
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animables
    const animatableElements = document.querySelectorAll('.service-card, .project-card, .tech-item, .process-step, .contact-card, .contact-form-container');
    animatableElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.9)';
        el.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Effet de ripple pour les boutons amélioré
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
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 1;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
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

// Ajout de styles CSS pour les animations améliorées via JavaScript
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
    
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes float-delayed-1 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(90deg); }
    }
    
    @keyframes float-delayed-2 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-25px) rotate(270deg); }
    }
    
    @keyframes float-delayed-3 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-35px) rotate(45deg); }
    }
    
    @keyframes float-delayed-4 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(135deg); }
    }
    
    @keyframes shine {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-delayed-1 { animation: float-delayed-1 7s ease-in-out infinite; }
    .animate-float-delayed-2 { animation: float-delayed-2 8s ease-in-out infinite; }
    .animate-float-delayed-3 { animation: float-delayed-3 5s ease-in-out infinite; }
    .animate-float-delayed-4 { animation: float-delayed-4 9s ease-in-out infinite; }
    
    .navbar {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .hamburger span {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .service-card {
        opacity: 0;
        transform: translateY(30px) rotateX(15deg);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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

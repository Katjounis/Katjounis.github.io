// Variables globales
let currentSection = 'projets';
let currentGallery = [];
let currentImageIndex = 0;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initGallery();
    initContactForm();
    initCodeToggle();
    initMobileMenu();
});

// Navigation entre les sections
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Mise à jour des liens actifs
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Affichage de la section correspondante
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            currentSection = targetSection;
            
            // Fermer le menu mobile si ouvert
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Menu mobile hamburger
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Galerie et lightbox
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    // Ouvrir la lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const section = this.closest('.section');
            currentGallery = Array.from(section.querySelectorAll('.gallery-item'));
            currentImageIndex = index;
            
            openLightbox();
        });
    });

    // Fermer la lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation dans la lightbox
    lightboxPrev.addEventListener('click', function() {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentGallery.length - 1;
        updateLightboxContent();
    });

    lightboxNext.addEventListener('click', function() {
        currentImageIndex = currentImageIndex < currentGallery.length - 1 ? currentImageIndex + 1 : 0;
        updateLightboxContent();
    });

    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    lightboxPrev.click();
                    break;
                case 'ArrowRight':
                    lightboxNext.click();
                    break;
            }
        }
    });

    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightboxContent();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const currentItem = currentGallery[currentImageIndex];
        const img = currentItem.querySelector('img');
        const overlay = currentItem.querySelector('.gallery-overlay');
        
        lightboxImg.src = currentItem.getAttribute('data-src');
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = overlay.querySelector('h3').textContent;
        lightboxDescription.textContent = overlay.querySelector('p').textContent;
    }
}

// Toggle du code dans les projets
function initCodeToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-code-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const codeContent = document.getElementById(`code-${projectId}`);
            
            if (codeContent.style.display === 'none' || !codeContent.style.display) {
                codeContent.style.display = 'block';
                this.textContent = 'Masquer le code';
                this.style.background = '#e53e3e';
            } else {
                codeContent.style.display = 'none';
                this.textContent = 'Voir le code';
                this.style.background = '#ed8936';
            }
        });
    });
}

// Formulaire de contact
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validation simple
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        // Simulation d'envoi (remplacer par votre logique d'envoi)
        simulateFormSubmission(data);
    });
}

// Validation email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simulation d'envoi de formulaire
function simulateFormSubmission(data) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Animation de chargement
    submitBtn.innerHTML = '<span class="btn-text">Envoi en cours...</span><span class="btn-icon">⏳</span>';
    submitBtn.disabled = true;
    
    // Simulation d'un délai d'envoi
    setTimeout(() => {
        // Réinitialisation du bouton
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Affichage du message de succès
        showNotification('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
        
        // Réinitialisation du formulaire
        document.getElementById('contactForm').reset();
        
        // Log des données (pour le développement)
        console.log('Données du formulaire:', data);
        
    }, 2000);
}

// Système de notifications
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Styles de la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        background: type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#4299e1',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease-out'
    });
    
    // Ajouter les styles d'animation
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scroll pour les ancres
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    // Fermer le menu mobile si la fenêtre devient plus large
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Gestion du scroll pour la navbar
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll vers le bas - masquer la navbar
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scroll vers le haut - afficher la navbar
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Lazy loading pour les images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialiser le lazy loading si supporté
if ('IntersectionObserver' in window) {
    initLazyLoading();
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    // Vous pouvez ajouter ici une logique de rapport d'erreur
});

// Performance: Préchargement des images importantes
function preloadImages() {
    const importantImages = [
        'https://images.pexels.com/photos/1546901/pexels-photo-1546901.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Précharger les images importantes après le chargement de la page
window.addEventListener('load', preloadImages);

// Utilitaires pour le développement
const Portfolio = {
    // Changer de section programmatiquement
    goToSection: function(sectionId) {
        const link = document.querySelector(`[data-section="${sectionId}"]`);
        if (link) {
            link.click();
        }
    },
    
    // Obtenir la section actuelle
    getCurrentSection: function() {
        return currentSection;
    },
    
    // Afficher une notification
    notify: function(message, type = 'info') {
        showNotification(message, type);
    }
};

// Exposer l'objet Portfolio globalement pour le débogage
window.Portfolio = Portfolio;

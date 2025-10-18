document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.modal-close');
// Navigation mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fermer le menu mobile lors du clic sur un lien
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navigation active selon la section
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    let current = '';

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            const title = overlay.querySelector('h3').textContent;
            const subtitle = overlay.querySelector('p').textContent;
            
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = `${title} - ${subtitle}`;
            
            document.body.style.overflow = 'hidden';
        });
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
}

window.addEventListener('scroll', highlightNavigation);

// Scroll fluide pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
});

// Lightbox pour les galeries
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

// Ajouter l'événement click à toutes les images de galerie
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const overlay = this.querySelector('.gallery-overlay');
        
        lightbox.style.display = 'block';
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        if (overlay) {
            const title = overlay.querySelector('h3').textContent;
            const description = overlay.querySelector('p').textContent;
            lightboxCaption.innerHTML = `<strong>${title}</strong><br>${description}`;
        } else {
            lightboxCaption.textContent = img.alt;
        }
        
        // Empêcher le défilement de la page
        document.body.style.overflow = 'hidden';
    });
});

// Fermer la lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Fermer avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
        closeLightbox();
    }
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les éléments à animer
document.querySelectorAll('.gallery-item, .project-card, .section-title, .section-description').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Effet parallax subtil sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;

    const form = document.querySelector('.contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message envoyé avec succès !');
        form.reset();
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Performance: Lazy loading des images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback pour les navigateurs qui ne supportent pas le lazy loading
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}

// Préchargement des images critiques
function preloadCriticalImages() {
    const criticalImages = [
        'assets/maquettes3D/placeholder1.jpg',
        'assets/pagesWeb/project1.jpg'
    ];

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Lancer le préchargement après le chargement de la page
window.addEventListener('load', preloadCriticalImages);

// Gestion des erreurs d'images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        const parent = this.closest('.gallery-item, .project-image');
        if (parent) {
            parent.style.background = 'linear-gradient(135deg, #f5f1e8, #e8dcc8)';
            parent.innerHTML += '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #8b5c2e; font-size: 2rem; font-family: \'Playfair Display\', serif;">🖼️</div>';
        }
    });
});

function scrollToGallery() {
    const gallerySection = document.getElementById('galerie');
    const offsetTop = gallerySection.offsetTop - 80;
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
// Console info pour le développement
console.log('Portfolio chargé avec succès ! 🎨');
console.log('Sections disponibles:', Array.from(sections).map(s => s.id));

// Service Worker pour la mise en cache (optionnel pour GitHub Pages)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

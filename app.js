// Effet de particules d'encre subtiles sur canvas
const canvas = document.getElementById('inkCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Classe pour les taches d'encre vintage
class VintageInkSpot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = Math.random() * 0.3 + 0.2;
        this.size = Math.random() * 60 + 30;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.life = 1;
        this.decay = 0.001;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        
        // Formes irrégulières pour l'encre
        this.spots = [];
        for (let i = 0; i < 6; i++) {
            this.spots.push({
                angle: (Math.PI * 2 * i) / 6 + Math.random() * 0.5,
                distance: Math.random() * 20 + 10
            });
        }
    }
    
    update() {
        this.y += this.vy;
        this.x += this.vx;
        this.life -= this.decay;
        this.size += 0.1;
        this.rotation += this.rotationSpeed;
        
        this.vx *= 0.995;
        this.vy *= 0.995;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Dessiner une forme irrégulière d'encre
        ctx.fillStyle = '#8b7765';
        ctx.beginPath();
        
        this.spots.forEach((spot, i) => {
            const x = Math.cos(spot.angle) * spot.distance;
            const y = Math.sin(spot.angle) * spot.distance;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.closePath();
        ctx.fill();
        
        // Ajouter des petites taches autour
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = this.size * 0.5 + Math.random() * 20;
            const spotX = Math.cos(angle) * dist;
            const spotY = Math.sin(angle) * dist;
            const spotSize = Math.random() * 3 + 2;
            
            ctx.beginPath();
            ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

let inkSpots = [];
let lastSpotTime = 0;

// Créer des taches d'encre périodiquement
function createInkSpot() {
    const x = Math.random() * canvas.width;
    const y = -50;
    inkSpots.push(new VintageInkSpot(x, y));
}

// Animation douce
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const now = Date.now();
    if (now - lastSpotTime > 4000) {
        createInkSpot();
        lastSpotTime = now;
    }
    
    inkSpots = inkSpots.filter(spot => {
        spot.update();
        spot.draw();
        return !spot.isDead() && spot.y < canvas.height + 100;
    });
    
    requestAnimationFrame(animate);
}

animate();

// Créer quelques taches initiales
for (let i = 0; i < 2; i++) {
    setTimeout(() => createInkSpot(), i * 2000);
}

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
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Scroll fluide pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 75;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Lightbox pour les galeries
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

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
        
        document.body.style.overflow = 'hidden';
    });
});

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

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
        closeLightbox();
    }
});

// Animation au scroll avec effet de révélation
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

document.querySelectorAll('.gallery-item, .project-card, .section-title, .section-description').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Gestion des erreurs d'images avec style vintage
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        const parent = this.closest('.gallery-item, .project-image');
        if (parent) {
            parent.style.background = 'linear-gradient(135deg, #e9dcc9, #d4c5b0)';
            parent.style.position = 'relative';
            
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #8b7765;
                font-size: 3rem;
                font-family: 'Playfair Display', serif;
                text-align: center;
                width: 100%;
            `;
            placeholder.innerHTML = '◆<br><span style="font-size: 1rem; letter-spacing: 2px;">IMAGE</span>';
            parent.appendChild(placeholder);
        }
    });
});

// Effet de survol sur les ornements
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.letterSpacing = '2px';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.letterSpacing = '1px';
    });
});

// Ajouter un effet de texture au scroll
let ticking = false;

function updateTexture() {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const opacity = 1 - Math.abs(rect.top) / window.innerHeight;
            section.style.filter = `sepia(${opacity * 10}%)`;
        }
    });
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(updateTexture);
        ticking = true;
    }
});

console.log('Portfolio vintage chargé avec succès !');

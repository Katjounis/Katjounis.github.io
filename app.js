// ========================================
// PORTFOLIO - SCRIPT PRINCIPAL
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================
    // NAVIGATION MOBILE (Menu Hamburger)
    // ========================================
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

    
    // ========================================
    // NAVIGATION ACTIVE SELON LA SECTION
    // ========================================
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

    
    // ========================================
    // SCROLL FLUIDE POUR LES ANCRES
    // ========================================
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
    });

    
    // ========================================
    // LIGHTBOX POUR LES GALERIES
    // Pour afficher les images en grand format
    // ========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Ajouter l'événement click à toutes les images de galerie
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            
            // Afficher la lightbox
            lightbox.style.display = 'block';
            
            // IMPORTANT: Modifier ici le chemin de l'image si besoin
            // Pour changer l'image affichée, modifiez l'attribut src dans le HTML (index.html)
            // Exemple: <img src="assets/maquettes3D/votre-image.jpg" alt="Description">
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            
            // Récupérer et afficher la légende
            if (overlay) {
                const title = overlay.querySelector('h3').textContent;
                const description = overlay.querySelector('p').textContent;
                lightboxCaption.innerHTML = `<strong>${title}</strong><br>${description}`;
            } else {
                lightboxCaption.textContent = img.alt;
            }
            
            // Empêcher le défilement de la page pendant que la lightbox est ouverte
            document.body.style.overflow = 'hidden';
        });
    });

    // Fonction pour fermer la lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Fermer la lightbox avec le bouton X
    lightboxClose.addEventListener('click', closeLightbox);

    // Fermer la lightbox en cliquant en dehors de l'image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Fermer la lightbox avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });

    
    // ========================================
    // ANIMATIONS AU SCROLL
    // Apparition progressive des éléments
    // ========================================
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

    
    // ========================================
    // GESTION DES ERREURS D'IMAGES
    // Si une image ne charge pas, afficher un placeholder
    // ========================================
    // POUR AJOUTER VOS IMAGES:
    // 1. Placez vos images dans les dossiers: assets/maquettes3D/, assets/pagesWeb/, assets/tatouages/, assets/affiches/
    // 2. Dans index.html, modifiez l'attribut src des balises <img>
    // 3. Exemple: <img src="assets/maquettes3D/mon-image.jpg" alt="Ma description">
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const parent = this.closest('.gallery-item, .project-image');
            if (parent) {
                parent.style.background = 'linear-gradient(135deg, #1a1a2e, #0f3460)';
                parent.innerHTML += '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffffff; font-size: 2rem; font-family: \'Playfair Display\', serif;">🖼️</div>';
            }
        });
    });

    
    // ========================================
    // LAZY LOADING DES IMAGES
    // Performance: chargement différé des images
    // ========================================
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

    
    // ========================================
    // PRÉCHARGEMENT DES IMAGES CRITIQUES
    // ========================================
    // MODIFIER ICI pour précharger vos propres images
    function preloadCriticalImages() {
        const criticalImages = [
            'assets/maquettes3D/placeholder1.jpg',  // Remplacer par vos chemins d'images
            'assets/pagesWeb/project1.jpg'          // Remplacer par vos chemins d'images
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Lancer le préchargement après le chargement de la page
    window.addEventListener('load', preloadCriticalImages);

    
    // ========================================
    // CONSOLE INFO POUR LE DÉVELOPPEMENT
    // ========================================
    console.log('Portfolio chargé avec succès ! 🎨');
    console.log('Sections disponibles:', Array.from(sections).map(s => s.id));
});


// ========================================
// GUIDE RAPIDE POUR AJOUTER VOS IMAGES:
// ========================================
/*
1. STRUCTURE DES DOSSIERS:
   - Créez les dossiers: assets/maquettes3D/, assets/pagesWeb/, assets/tatouages/, assets/affiches/
   - Placez vos images dans les dossiers appropriés

2. MODIFIER LES IMAGES DANS index.html:
   - Trouvez les balises <img> dans chaque section
   - Modifiez l'attribut src avec le chemin de votre image
   - Exemple: <img src="assets/maquettes3D/ma-photo.jpg" alt="Description de ma photo">

3. MODIFIER LES TITRES ET DESCRIPTIONS:
   - Dans les balises <div class="gallery-overlay">
   - Modifiez le contenu de <h3> pour le titre
   - Modifiez le contenu de <p> pour la description

4. AJOUTER DE NOUVELLES IMAGES:
   - Copiez un bloc <div class="gallery-item">...</div> existant
   - Collez-le dans la grille <div class="gallery">
   - Modifiez le src, alt, titre et description

5. POUR LES PROJETS WEB:
   - Modifiez les <div class="project-card"> dans la section "Pages Web"
   - Changez les images, titres, descriptions et liens
*/

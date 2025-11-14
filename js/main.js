document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * Initializes the cases carousel on solution pages.
     */
    function initCarousel() {
        const categoryMeta = document.querySelector('meta[name="solution-category"]');
        if (!categoryMeta) return;

        const currentCategory = categoryMeta.getAttribute('content');
        const container = document.getElementById('cases-carousel-container');
        const section = document.getElementById('related-cases');

        if (!container || typeof casesData === 'undefined') {
            if (section) section.style.display = 'none';
            return;
        }

        const relatedCases = casesData.filter(c => c.category.includes(currentCategory));

        if (relatedCases.length === 0) {
            if (section) section.style.display = 'none';
            return;
        }

        let contentHTML = '<div class="carousel-track">';
        relatedCases.forEach(caseItem => {
            contentHTML += `
                <div class="case-card">
                    <div class="case-image">
                        <img src="${caseItem.image}" alt="${caseItem.alt}">
                    </div>
                    <div class="case-content">
                        <span class="case-category">${caseItem.category}</span>
                        <h3 class="case-title">${caseItem.title}</h3>
                        <p class="case-description">${caseItem.description}</p>
                    </div>
                </div>
            `;
        });
        contentHTML += '</div>';
        container.innerHTML = contentHTML;

        if (relatedCases.length > 1) {
            const track = container.querySelector('.carousel-track');
            const btnContainer = document.createElement('div');
            btnContainer.className = 'carousel-buttons';
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-btn prev-btn';
            prevBtn.innerHTML = '&lt;';
            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-btn next-btn';
            nextBtn.innerHTML = '&gt;';
            btnContainer.appendChild(prevBtn);
            btnContainer.appendChild(nextBtn);
            container.appendChild(btnContainer);
            
            const scrollAmount = 340 + 30; // Card width + gap

            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
    }

    /**
 * Initializes the mobile sidebar navigation.
 */
function initMobileNav() {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    const body = document.body;

    if (navToggle && navLinks && overlay) {
        // Abre/Fecha o menu ao clicar no botão
        navToggle.addEventListener('click', () => {
            body.classList.toggle('nav-open');
            if (body.classList.contains('nav-open')) {
                navToggle.setAttribute('aria-label', 'Fechar menu');
            } else {
                navToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });

        // Fecha o menu ao clicar no overlay
        overlay.addEventListener('click', () => {
            body.classList.remove('nav-open');
            navToggle.setAttribute('aria-label', 'Abrir menu');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
                // 1. Previne a navegação imediata
                event.preventDefault();
                
                const href = link.getAttribute('href');
                const isCurrentPage = window.location.pathname.endsWith(href);

                // 2. VERIFICA se o link é a página atual
                if (isCurrentPage || (href === 'index.html' && window.location.pathname === '/')) {
                    
                    body.classList.remove('nav-open');
                    navToggle.setAttribute('aria-label', 'Abrir menu');
                } else {
                    
                    body.classList.remove('nav-open');
                    navToggle.setAttribute('aria-label', 'Abrir menu');

                    setTimeout(() => {
                        window.location.href = href;
                    }, 300); 
                }
            });
        });
        
    }
}

    // Initialize all components
    initCarousel();
    initMobileNav();

});
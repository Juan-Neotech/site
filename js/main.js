document.addEventListener('DOMContentLoaded', function() {
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

    // --- Carousel Button Logic ---
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

        // Scroll by a fixed amount, roughly one card width + gap
        const scrollAmount = 340 + 30;

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
});
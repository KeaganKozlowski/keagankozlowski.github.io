document.addEventListener('DOMContentLoaded', function() {

    // --- 2. Smooth Scrolling for Nav Links ---
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 3. Anti-Scraping Email ---
    const emailUser = 'hello';
    const emailDomain = 'keagankozlowski.dev'; // (Assuming a domain)
    const emailPlaceholder = document.getElementById('email-placeholder');
    if (emailPlaceholder) {
        const emailAddress = `${emailUser}@${emailDomain}`;
        emailPlaceholder.innerHTML = `<a href="mailto:${emailAddress}" class="hover:underline">${emailAddress}</a>`;
    }


    // --- 4. Copyright Year ---
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
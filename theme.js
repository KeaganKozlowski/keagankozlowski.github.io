document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Dark Mode Toggle ---
    const toggleButton = document.getElementById('dark-mode-toggle');
    const htmlElement = document.documentElement; // Get <html> tag

    // On load, check localStorage
    if (localStorage.getItem('theme') === 'dark' || 
       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // On click, toggle theme
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

});
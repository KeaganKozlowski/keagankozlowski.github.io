document.addEventListener('DOMContentLoaded', function() {
    const darkLightToggle = document.getElementById('DarkLight');

    // Load theme from localStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }

    if (darkLightToggle) {
        darkLightToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            // Save theme to localStorage
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light-mode');
            } else {
                localStorage.removeItem('theme');
            }
            console.log("Colour changed");
        });
    } else {
        console.error('Element with ID "DarkLight" not found.');
    }

    // Handle navigation link clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show the target section
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});

document.getElementById('yes').addEventListener('click', function() {
    console.log("yes pressed");
    window.location.href = "/Src/Main Page/game.html";
});

document.getElementById('no').addEventListener('click', function() {
    console.log("no pressed");
    window.location.href = "/index.html";
});
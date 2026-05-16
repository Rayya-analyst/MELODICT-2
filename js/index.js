const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('main-navbar');
const sections = document.querySelectorAll('section[id], header[id]');
const navItems = document.querySelectorAll('.nav-link-item:not(.nav-cta)');



hamburgerBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
});

window.addEventListener('scroll', () => {
    if (!navbar) return;

    const navHeight = navbar.offsetHeight;
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 40;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('href') === '#' + current);
    });
});
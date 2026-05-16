document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBtn = document.getElementById('sidebar-close-btn');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // REAL-TIME CROSS-TAB SYNCHRONIZATION
    window.addEventListener('storage', (e) => {
        if (e.key === 'melodict_streak') {
            const dashboardStreak = document.getElementById('dashboard-streak-display');
            const wellnessStreak = document.getElementById('wellness-streak-display');
            const newText = `${e.newValue} DAYS FIRE! <i class="bi bi-fire"></i>`;
            
            if (dashboardStreak) dashboardStreak.innerHTML = newText;
            if (wellnessStreak) wellnessStreak.innerHTML = newText;
        }
    });
});

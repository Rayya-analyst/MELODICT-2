document.addEventListener('DOMContentLoaded', () => {

    const profileForm = document.querySelector('section .bento-card form');
    const timelineContainer = document.getElementById('timeline-container');
    const addBtn = document.getElementById('add-slot-btn');
    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const syncToggle = document.getElementById('sync-toggle');

    let isApiSynced = true;

    // --- FUNGSI UPDATE PROFILE ---
    function loadProfileData() {
        const savedProfile = JSON.parse(localStorage.getItem('melodict_profile'));
        if (savedProfile) {
            // Kita ambil input sesuai urutan di HTML lo: [0] Name, [1] Email, [2] Bio
            const inputs = profileForm.querySelectorAll('.neo-input');
            if (inputs.length >= 3) {
                inputs[0].value = savedProfile.name || "";
                inputs[1].value = savedProfile.email || "";
                inputs[2].value = savedProfile.bio || "";
            }
        }
    }

    function saveProfileData(e) {
        e.preventDefault();
        
        const btn = profileForm.querySelector('button');
        const inputs = profileForm.querySelectorAll('.neo-input');

        const profileData = {
            name: inputs[0].value,
            email: inputs[1].value,
            bio: inputs[2].value
        };

        localStorage.setItem('melodict_profile', JSON.stringify(profileData));
        
        const originalText = btn.innerText;
        btn.innerText = "PROFILE UPDATED!";
        btn.style.background = "#1DB954";
        btn.style.color = "white";

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "";
            btn.style.color = "";
        }, 2000);
    }

    function handleApiToggle() {
        const toggleBtn = document.querySelector('.toggle-switch');
        const statusText = document.querySelector('.sync-status-text');

        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            const circle = toggleBtn.querySelector('.toggle-circle');
            isApiSynced = !isApiSynced;

            if (isApiSynced) {
                circle.style.left = 'auto';
                circle.style.right = '2px';
                toggleBtn.style.background = '#1DB954'; 
                if (statusText) statusText.innerText = "Connected to Melodict Engine. ACTIVE.";
                checkCurrentTime();
            } else {
                circle.style.right = 'auto';
                circle.style.left = '2px';
                toggleBtn.style.background = '#ccc';
                if (statusText) statusText.innerText = "Sync Status: INACTIVE (Paused by User)";
            }
        });
    }

    function createRow(start = "07:00", end = "15:00", activity = "", preset = "HIGH FOCUS") {
        const row = document.createElement('div');
        row.className = 'timeline-slot-row';
        
        row.innerHTML = `
            <div>
                <span class="slot-label">START</span>
                <input type="time" class="neo-input p-2 time-start" value="${start}">
            </div>
            <div>
                <span class="slot-label">END</span>
                <input type="time" class="neo-input p-2 time-end" value="${end}">
            </div>
            <div class="slot-activity">
                <span class="slot-label">ACTIVITY</span>
                <input type="text" class="neo-input p-2 activity-name" value="${activity}">
            </div>
            <div class="slot-mode">
                <span class="slot-label">MODE PRESET</span>
                <select class="neo-input p-2 mode-preset">
                    <option value="HIGH FOCUS" ${preset === 'HIGH FOCUS' ? 'selected' : ''}>HIGH FOCUS</option>
                    <option value="CREATIVE FLOW" ${preset === 'CREATIVE FLOW' ? 'selected' : ''}>CREATIVE FLOW</option>
                    <option value="WIND DOWN" ${preset === 'WIND DOWN' ? 'selected' : ''}>WIND DOWN</option>
                    <option value="WORKOUT" ${preset === 'WORKOUT' ? 'selected' : ''}>WORKOUT</option>
                </select>
            </div>
            <div class="slot-delete d-flex align-items-end">
                <button type="button" class="btn-dark-neo py-2 px-3 btn-remove" style="background: #ff6b6b; color: white; width: 100%;">✕</button>
            </div>
        `;

        row.querySelector('.btn-remove').addEventListener('click', () => {
            row.remove();
        });

        return row;
    }

    function saveAllTimeline() {
        const rows = document.querySelectorAll('.timeline-slot-row');
        const scheduleArray = [];

        rows.forEach(row => {
            scheduleArray.push({
                start: row.querySelector('.time-start').value,
                end: row.querySelector('.time-end').value,
                activity: row.querySelector('.activity-name').value,
                preset: row.querySelector('.mode-preset').value
            });
        });

        localStorage.setItem('melodict_schedule', JSON.stringify(scheduleArray));
        
        const originalText = saveScheduleBtn.innerText;
        saveScheduleBtn.innerText = "SCHEDULE SAVED!";
        saveScheduleBtn.style.background = "#1DB954";
        
        setTimeout(() => {
            saveScheduleBtn.innerText = originalText;
            saveScheduleBtn.style.background = ""; 
        }, 2000);

        checkCurrentTime();
    }

    function loadSavedTimeline() {
        const savedData = JSON.parse(localStorage.getItem('melodict_schedule')) || [];
        if (savedData.length > 0 && timelineContainer) {
            timelineContainer.innerHTML = '';
            savedData.forEach(item => {
                timelineContainer.appendChild(createRow(item.start, item.end, item.activity, item.preset));
            });
        }
    }

    function checkCurrentTime() {
        if (!isApiSynced) return;

        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                            now.getMinutes().toString().padStart(2, '0');

        const savedData = JSON.parse(localStorage.getItem('melodict_schedule')) || [];
        const currentTask = savedData.find(item => currentTime >= item.start && currentTime <= item.end);

        if (currentTask) {
            console.log(`[Melodict] Mode Aktif: ${currentTask.preset}`);
        }
    }

    function openSidebar() {
        if (!sidebar || !overlay) return;
        sidebar.classList.add('open');
        overlay.classList.add('active');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (!sidebar || !overlay) return;
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    handleApiToggle();
    loadProfileData(); 
    loadSavedTimeline();

    if (profileForm) {
        const updateBtn = profileForm.querySelector('button');
        if (updateBtn) updateBtn.addEventListener('click', saveProfileData);
    }

    if (addBtn && timelineContainer) addBtn.addEventListener('click', () => timelineContainer.appendChild(createRow()));
    if (saveScheduleBtn) saveScheduleBtn.addEventListener('click', saveAllTimeline);
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    setInterval(checkCurrentTime, 60000);
});
document.addEventListener('DOMContentLoaded', () => {

    const profileForm = document.querySelector('section .bento-card form');
    const timelineContainer = document.getElementById('timeline-container');
    const addBtn = document.getElementById('add-slot-btn');
    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    
    let isApiSynced = true;

    function handleApiToggle() {
        const toggleBtn = document.querySelector('.toggle-switch');
        const statusText = document.querySelector('.sync-status-text');

        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            const circle = toggleBtn.querySelector('.toggle-circle');
            isApiSynced = !isApiSynced;

            if (isApiSynced) {
                // State Active (Hijau)
                circle.style.left = 'auto';
                circle.style.right = '2px';
                toggleBtn.style.background = '#1DB954'; 
                if (statusText) statusText.innerText = "Connected to Melodict Engine. ACTIVE.";
                console.log("[Melodict] API Sync Enabled");
                checkCurrentTime();
            } else {
                // State Inactive (Abu-abu)
                circle.style.right = 'auto';
                circle.style.left = '2px';
                toggleBtn.style.background = '#ccc';
                if (statusText) statusText.innerText = "Sync Status: INACTIVE (Paused by User)";
                console.log("[Melodict] API Sync Disabled");
            }
        });
    }

    function loadProfileData() {
        const savedProfile = JSON.parse(localStorage.getItem('melodict_profile'));
        if (savedProfile) {
            const nameInput = document.querySelector('input[type="text"]');
            const emailInput = document.querySelector('input[type="email"]');
            const bioInput = document.querySelector('textarea');

            if (nameInput) nameInput.value = savedProfile.name || "";
            if (emailInput) emailInput.value = savedProfile.email || "";
            if (bioInput) bioInput.value = savedProfile.bio || "";
        }
    }

    function saveProfileData(e) {
        e.preventDefault();
        const btn = e.submitter || document.querySelector('section .bento-card form button');
        
        const profileData = {
            name: document.querySelector('input[type="text"]').value,
            email: document.querySelector('input[type="email"]').value,
            bio: document.querySelector('textarea').value
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

    function createRow(start = "07:00", end = "15:00", activity = "", preset = "HIGH FOCUS") {
        const row = document.createElement('div');
        row.className = 'row g-3 align-items-end border-bottom border-2 pb-4 mb-2 schedule-row animate__animated animate__fadeIn';
        
        row.innerHTML = `
            <div class="col-md-2">
                <label class="text-label mb-2" style="font-size: 10px;">MULAI</label>
                <input type="time" class="neo-input p-2 time-start" value="${start}">
            </div>
            <div class="col-md-2">
                <label class="text-label mb-2" style="font-size: 10px;">SELESAI</label>
                <input type="time" class="neo-input p-2 time-end" value="${end}">
            </div>
            <div class="col-md-3">
                <label class="text-label mb-2" style="font-size: 10px;">AKTIVITAS</label>
                <input type="text" class="neo-input p-2 activity-name" value="${activity}" placeholder="Nama aktivitas...">
            </div>
            <div class="col-md-3">
                <label class="text-label mb-2" style="font-size: 10px;">MODE PRESET</label>
                <select class="neo-input p-2 mode-preset">
                    <option value="HIGH FOCUS" ${preset === 'HIGH FOCUS' ? 'selected' : ''}>HIGH FOCUS</option>
                    <option value="CREATIVE FLOW" ${preset === 'CREATIVE FLOW' ? 'selected' : ''}>CREATIVE FLOW</option>
                    <option value="WIND DOWN" ${preset === 'WIND DOWN' ? 'selected' : ''}>WIND DOWN</option>
                    <option value="WORKOUT" ${preset === 'WORKOUT' ? 'selected' : ''}>WORKOUT</option>
                </select>
            </div>
            <div class="col-md-2">
                <button class="btn-dark-neo w-100 py-2 btn-remove" style="background: #ff6b6b; color: white;">X</button>
            </div>
        `;

        row.querySelector('.btn-remove').addEventListener('click', () => {
            row.remove();
        });

        return row;
    }

    function saveAllTimeline() {
        const rows = document.querySelectorAll('.schedule-row');
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
        saveScheduleBtn.innerText = "BERHASIL DISIMPAN!";
        saveScheduleBtn.style.background = "#1DB954";
        
        setTimeout(() => {
            saveScheduleBtn.innerText = originalText;
            saveScheduleBtn.style.background = ""; 
        }, 2000);

        checkCurrentTime(); // Langsung cek jadwal setelah simpan
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
            console.log(`[Melodict] Mode Aktif Sekarang: ${currentTask.mode} untuk ${currentTask.activity}`);
            // Di sini kamu bisa tambahkan kode untuk mengubah warna tema dashboard sesuai mode
        }
    }

    handleApiToggle();
    loadProfileData();
    loadSavedTimeline();

    if (profileForm) profileForm.addEventListener('submit', saveProfileData);
    if (addBtn) addBtn.addEventListener('click', () => timelineContainer.appendChild(createRow()));
    if (saveScheduleBtn) saveScheduleBtn.addEventListener('click', saveAllTimeline);

    setInterval(checkCurrentTime, 60000);
});
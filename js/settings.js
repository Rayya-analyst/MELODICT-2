document.addEventListener('DOMContentLoaded', () => {

    const profileForm = document.querySelector('section .bento-card form');
    const timelineContainer = document.getElementById('timeline-container');
    const addBtn = document.getElementById('add-slot-btn');
    const saveScheduleBtn = document.getElementById('save-schedule-btn');
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
        row.className = 'timeline-slot-card bento-card border border-4 border-dark mb-4 bg-white p-3 p-md-4 neo-shadow-sm';
        
        // Coba hitung ada berapa card untuk memberi label "SLOT X"
        const existingSlots = document.querySelectorAll('.timeline-slot-card').length;
        const slotLabel = `SLOT ${existingSlots + 1}`;
        
        row.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-3 pb-3" style="border-bottom: 2px solid var(--color-on-background);">
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-dark text-white rounded-0 px-3 py-2 fs-6 fw-bold slot-number-badge">${slotLabel}</span>
            </div>
            <button type="button" class="btn-remove btn-dark-neo d-flex align-items-center justify-content-center p-2 neo-shadow-hover" style="background: var(--color-primary-container); border-color: var(--color-on-background); color: var(--color-on-background);" aria-label="Delete slot">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
          
          <div class="row g-3 align-items-end">
            <div class="col-6 col-md-3">
              <label class="text-label mb-2 d-block fw-black">START TIME</label>
              <input type="time" class="neo-input w-100 p-3 fw-bold fs-5 time-start" value="${start}">
            </div>
            <div class="col-6 col-md-3">
              <label class="text-label mb-2 d-block fw-black">END TIME</label>
              <input type="time" class="neo-input w-100 p-3 fw-bold fs-5 time-end" value="${end}">
            </div>
            <div class="col-12 col-md-6">
              <label class="text-label mb-2 d-block fw-black">ACTIVITY</label>
              <input type="text" class="neo-input w-100 p-3 fw-bold fs-5 activity-name" value="${activity}">
            </div>
            <div class="col-12 mt-3">
              <label class="text-label mb-2 d-block fw-black">MODE PRESET</label>
              <select class="neo-input w-100 p-3 fw-bold fs-5 mode-preset" style="cursor: pointer; background-color: var(--color-tertiary-fixed);">
                <option value="HIGH FOCUS" ${preset === 'HIGH FOCUS' ? 'selected' : ''}>HIGH FOCUS</option>
                <option value="CREATIVE FLOW" ${preset === 'CREATIVE FLOW' ? 'selected' : ''}>CREATIVE FLOW</option>
                <option value="WIND DOWN" ${preset === 'WIND DOWN' ? 'selected' : ''}>WIND DOWN</option>
                <option value="WORKOUT" ${preset === 'WORKOUT' ? 'selected' : ''}>WORKOUT</option>
              </select>
            </div>
          </div>
        `;

        row.querySelector('.btn-remove').addEventListener('click', () => {
            row.remove();
            updateSlotLabels();
        });

        return row;
    }

    function updateSlotLabels() {
        const cards = document.querySelectorAll('.timeline-slot-card');
        cards.forEach((card, index) => {
            const badge = card.querySelector('.slot-number-badge');
            if (badge) badge.innerText = `SLOT ${index + 1}`;
        });
    }

    function saveAllTimeline() {
        const rows = document.querySelectorAll('.timeline-slot-card');
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
    }

    function loadSavedTimeline() {
        const savedData = JSON.parse(localStorage.getItem('melodict_schedule')) || [];
        if (savedData.length > 0 && timelineContainer) {
            timelineContainer.innerHTML = '';
            savedData.forEach(item => {
                timelineContainer.appendChild(createRow(item.start, item.end, item.activity, item.preset));
            });
        } else if (timelineContainer) {
            // Bind remove event to pre-filled HTML row if no saved data exists
            const existingRemoveBtns = timelineContainer.querySelectorAll('.btn-remove');
            existingRemoveBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.target.closest('.timeline-slot-row').remove();
                });
            });
        }
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
});
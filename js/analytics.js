const sessionTracks = [
    { name: 'System Overload', valence: 0.9, energy: 0.9, duration_ms: 3600000 },
    { name: 'Morning Dew', valence: 0.9, energy: 0.9, duration_ms: 1800000 },
    { name: 'Deep Rest', valence: 0.9, energy: 0.9, duration_ms: 1200000 }
];

const calculateAnalytics = () => {
    const totalSync = sessionTracks.reduce((acc, track) => acc + ((track.valence + track.energy) / 2), 0);
    const avgSync = (totalSync / sessionTracks.length) * 100;
    const totalMs = sessionTracks.reduce((acc, track) => acc + track.duration_ms, 0);
    const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(1);
    const statusText = avgSync >= 90 ? 'OPTIMAL' : (avgSync >= 70 ? 'NEAR OPTIMAL' : 'SUB-OPTIMAL');

    const syncElement = document.getElementById('sync-val');
    const timeElement = document.getElementById('session-val');
    const statusLabel = document.querySelector('#sync-val + p');
    const insightText = document.querySelector('.fst-italic');

    if (syncElement) syncElement.textContent = `${avgSync.toFixed(0)}%`;
    if (timeElement) timeElement.textContent = `${totalHours}h`;
    if (statusLabel) statusLabel.textContent = statusText;
    if (insightText) {
        insightText.innerHTML = `Your session is <b>${statusText}</b>. Analysis based on ${sessionTracks.length} tracks.`;
    }
};

window.addEventListener('load', () => {
    console.log('MELODICT Engine: Connected!');

    const moodCanvas = document.getElementById('moodChart');
    if (moodCanvas) {
        new Chart(moodCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                datasets: [{
                    data: [0.9, 0.6, 0.3, 0.8, 0.5, 0.4, 0.7],
                    borderColor: '#000',
                    borderWidth: 5,
                    backgroundColor: 'rgba(93, 217, 208, 0.5)',
                    fill: true,
                    tension: 0,
                    pointRadius: 8,
                    pointBackgroundColor: '#ae2f34'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        ticks: { display: true },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    }
                }
            }
        });
    }

    const radarCanvas = document.getElementById('radarChart');
    if (radarCanvas) {
        new Chart(radarCanvas.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['ENERGY', 'DANCE', 'ACOUSTIC', 'INSTRUM.', 'LIVENESS'],
                datasets: [{
                    data: [50, 90, 30, 40, 70],
                    backgroundColor: 'rgba(174, 47, 52, 0.7)',
                    borderColor: '#000',
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    const playBtn = document.querySelector('.play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            const icon = this.querySelector('.material-symbols-outlined');
            icon.textContent = (icon.textContent === 'play_arrow') ? 'pause' : 'play_arrow';
        });
    }



    calculateAnalytics();
});
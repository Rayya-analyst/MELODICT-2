// 1. Konfigurasi Global untuk Gaya Neobrutalism
// Ini memastikan semua grafik memiliki font yang sama dan warna teks hitam tegas
Chart.defaults.font.family = "'Space Grotesk', sans-serif";
Chart.defaults.font.weight = '700';
Chart.defaults.color = '#000';

// ==========================================
// 2. Inisialisasi Mood Velocity (Line Chart)
// ==========================================
const ctxMood = document.getElementById('moodChart').getContext('2d');
new Chart(ctxMood, {
    type: 'line',
    data: {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [{
            label: 'Mood Index',
            data: [0.4, 0.6, 0.3, 0.8, 0.5, 0.4, 0.7], // Data dummy (bisa diganti nanti)
            borderColor: '#000', // Garis hitam tebal
            borderWidth: 5,
            backgroundColor: 'rgba(93, 217, 208, 0.5)', // Warna Teal transparan
            fill: true,
            pointRadius: 8,
            pointBackgroundColor: '#ae2f34', // Titik merah
            pointBorderColor: '#000',
            pointBorderWidth: 3
        }]
    },
    options: {
    layout: {
        padding: {
            left: 40,  // Memberi ruang agar titik tidak menempel ke teks HAPPY/SAD
            right: 20,
            top: 20,
            bottom: 20
        }
    },

        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { 
                border: { width: 4, color: '#000' }, // Border samping tebal
                beginAtZero: true, 
                max: 1,
                ticks: { display: false } // Sembunyikan angka karena sudah ada label HAPPY/SAD
            },
            x: { 
                border: { width: 4, color: '#000' }, // Border bawah tebal
                ticks: { display: false } // Sembunyikan label hari bawaan karena kita pakai div manual
            }
        },
        plugins: {
            legend: { display: false } // Sembunyikan kotak keterangan di atas
        }
    }
});

// ==========================================
// 3. Inisialisasi Radar Profile Chart
// ==========================================
const ctxRadar = document.getElementById('radarChart').getContext('2d');
new Chart(ctxRadar, {
    type: 'radar',
    data: {
        labels: ['ENERGY', 'DANCE', 'ACOUSTIC', 'INSTRUM.', 'LIVENESS'],
        datasets: [{
            data: [80, 90, 30, 40, 70],
            backgroundColor: 'rgba(174, 47, 52, 0.7)', // Merah transparan
            borderColor: '#000',
            borderWidth: 4,
            pointBackgroundColor: '#FBE36A', // Titik kuning
            pointBorderColor: '#000',
            pointRadius: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                grid: { color: '#000', lineWidth: 1 },
                angleLines: { color: '#000', lineWidth: 2 },
                pointLabels: { 
                    font: { size: 12, weight: '900' },
                    color: '#000'
                },
                ticks: { display: false }
            }
        },
        plugins: {
            legend: { display: false }
        }
    }
});

// ==========================================
// 4. Interaksi Tambahan (Opsional)
// ==========================================
// Membuat tombol Play di player bar bisa berubah icon saat diklik
const playBtn = document.querySelector('.play-btn');
if(playBtn) {
    playBtn.addEventListener('click', function() {
        const icon = this.querySelector('.material-symbols-outlined');
        if (icon.textContent === 'play_arrow') {
            icon.textContent = 'pause';
        } else {
            icon.textContent = 'play_arrow';
        }
    });
}
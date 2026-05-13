document.addEventListener('DOMContentLoaded', () => {
    // 1. MOOD PICKER
    const moodBtns = document.querySelectorAll('.mood-btn');
    let selectedMood = "Energetic";

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedMood = btn.dataset.mood;
        });
    });

    // 2. WELLNESS SYSTEM
    const form = document.getElementById('wellness-form');
    const checks = document.querySelectorAll('.habit-check');
    const scoreText = document.getElementById('score-text');
    const scoreFill = document.getElementById('score-fill');

    function updateHabitUI(score) {
        const insight = document.getElementById('ai-insight');
        const title = document.getElementById('suggested-title');
        const art = document.getElementById('playlist-art');
        const card = document.getElementById('playlist-card');

        if (score >= 75) {
            insight.innerText = "Korelasi Sempurna! Tubuhmu siap untuk tugas kompleks dengan musik High-Tempo.";
            title.innerText = "Deep Work: Cyber-Focus";
            art.style.backgroundColor = "#1DB954";
            card.style.backgroundColor = "#eafff0";
        } else if (score >= 50) {
            insight.innerText = "Keseimbangan Oke. Musik Lo-Fi direkomendasikan untuk menjaga fokus stabil.";
            title.innerText = "Chill Lofi Study";
            art.style.backgroundColor = "#FBE36A";
            card.style.backgroundColor = "#fffdf2";
        } else {
            insight.innerText = "Kesehatan Menurun. AI menyarankan jeda 15 menit dan musik Ambient / Rain.";
            title.innerText = "Rest & Reset: Nature";
            art.style.backgroundColor = "#FF6B6B";
            card.style.backgroundColor = "#fff5f5";
        }
    }

    function calculateScore() {
        const total = checks.length;
        const checked = Array.from(checks).filter(c => c.checked).length;
        const percentage = Math.round((checked / total) * 100);
        
        scoreText.innerText = `${percentage}%`;
        scoreFill.style.width = `${percentage}%`;
        updateHabitUI(percentage);
        return percentage;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const score = calculateScore();
        
        const logData = {
            mood: selectedMood,
            wellnessScore: score,
            timestamp: new Date().toLocaleDateString()
        };
        
        localStorage.setItem('melodict_wellness_data', JSON.stringify(logData));
        alert('Metrics Logged! Analisis AI diperbarui.');
    });

    // 3. SCATTER CHART IMPLEMENTATION
    const ctx = document.getElementById('correlationChart').getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Correlation Points',
                data: [
                    { x: 128, y: 85 }, { x: 140, y: 70 }, { x: 90, y: 95 },
                    { x: 165, y: 35 }, { x: 110, y: 88 }, { x: 132, y: 62 },
                    { x: 155, y: 48 }, { x: 80, y: 90 }, { x: 170, y: 20 }
                ],
                backgroundColor: '#000',
                pointRadius: 8,
                pointHoverRadius: 12,
                showLine: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    title: { display: true, text: 'Music BPM', font: { weight: 'bold' } },
                    grid: { display: false }
                },
                y: { 
                    title: { display: true, text: 'Concentration %', font: { weight: 'bold' } },
                    min: 0, max: 100 
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Run Initial Calculation
    calculateScore();
});
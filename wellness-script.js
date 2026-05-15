function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const hamburger = document.getElementById('hamburger-btn');

  const isOpen = sidebar.classList.toggle('open');
  overlay.classList.toggle('show', isOpen);
  hamburger.classList.toggle('is-open', isOpen);

  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeSidebar() {
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebar-overlay');
  const hamburger = document.getElementById('hamburger-btn');

  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  hamburger.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

document.querySelectorAll('#sidebar nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 992) closeSidebar();
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 992) {
    closeSidebar();
    document.body.style.overflow = '';
  }
});


document.addEventListener('DOMContentLoaded', () => {

  const moodConfigs = {
    'Energetic': {
      title: 'Cyber-Focus: Phonk',
      color: '#1DB954',
      insight: 'High Tempo cocok untuk boost energi!'
    },
    'Mellow': {
      title: 'Coffee Shop Lo-fi',
      color: '#FBE36A',
      insight: 'Tempo rendah membantu relaksasi kreatif.'
    },
    'Focus': {
      title: 'Deep Work: Synthwave',
      color: '#BB86FC',
      insight: 'Ritme konstan menjaga konsentrasi.'
    },
    'Tired': {
      title: 'Rest & Reset: Nature',
      color: '#FF6B6B',
      insight: 'AI menyarankan musik ambient untuk recovery.'
    }
  };

  const moodBtns = document.querySelectorAll('.mood-btn');
  let selectedMood = 'Energetic';
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMood = btn.dataset.mood;
      console.log('Mood selected:', selectedMood);
    });
  });

  const ctx = document.getElementById('correlationChart');
  if (!ctx) return;

  const correlationChart = new Chart(ctx.getContext('2d'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Habit vs BPM',
        data: [],
        backgroundColor: '#000',
        pointRadius: 8,
        showLine: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            font: { family: 'Space Grotesk', weight: '700' }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'BPM',
            font: { family: 'Space Grotesk', weight: '700' }
          },
          min: 60,
          max: 200
        },
        y: {
          title: {
            display: true,
            text: 'Habit Score %',
            font: { family: 'Space Grotesk', weight: '700' }
          },
          min: 0,
          max: 100
        }
      }
    }
  });

  const form      = document.getElementById('wellness-form');
  const checks    = document.querySelectorAll('.habit-check');
  const scoreText = document.getElementById('score-text');
  const scoreFill = document.getElementById('score-fill');

  function finalizeAnalysis(score, mood, bpm) {
    const insight = document.getElementById('ai-insight');
    const title   = document.getElementById('suggested-title');
    const art     = document.getElementById('playlist-art');
    const config  = moodConfigs[mood] || moodConfigs['Focus'];

    if (scoreText) scoreText.innerText = `${score}%`;
    if (scoreFill) scoreFill.style.width = `${score}%`;

    if (insight) insight.innerText = `Berdasarkan Mood ${mood}: ${config.insight}`;
    if (title)   title.innerText   = config.title;
    if (art)     art.style.backgroundColor = config.color;

    correlationChart.data.datasets[0].data.push({ x: bpm, y: score });
    correlationChart.update();
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const total   = checks.length;
      const checked = Array.from(checks).filter(c => c.checked).length;
      const score   = Math.round((checked / total) * 100);

      const bpmInput = document.getElementById('bpm-input');
      const bpm      = parseInt(bpmInput.value) || 120;

      finalizeAnalysis(score, selectedMood, bpm);

      const logData = {
        mood: selectedMood,
        score: score,
        bpm: bpm,
        timestamp: new Date().toLocaleTimeString()
      };

      localStorage.setItem('melodict_last_log', JSON.stringify(logData));

      alert('Metrics Logged! Dashboard Intelligence updated!');
      console.log('Data Sent to Dashboard:', logData);
    });
  }
});

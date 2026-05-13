document.addEventListener('DOMContentLoaded', () => {
    // 1. Definisikan Fungsi Update Tampilan
    function updateUI() {
        const isConnected = localStorage.getItem('spotifyConnected') === 'true';
        const sessionStatus = localStorage.getItem('sessionStatus') || 'idle';

        const stateDisconnected = document.getElementById('state-disconnected');
        const stateConnected = document.getElementById('state-connected');
        
        // Tombol-tombol
        const btnStart = document.getElementById('btn-start-session');
        const btnPause = document.getElementById('btn-pause-session');
        const btnResume = document.getElementById('btn-resume-session');
        const btnEnd = document.getElementById('btn-end-session');

        // Logic Konek Spotify
        if (isConnected) {
            stateDisconnected?.classList.add('d-none');
            stateConnected?.classList.remove('d-none');

            // Reset semua tombol ke d-none
            [btnStart, btnPause, btnResume, btnEnd].forEach(btn => btn?.classList.add('d-none'));

            // Tampilkan tombol sesuai status sesi
            if (sessionStatus === 'idle') {
                btnStart?.classList.remove('d-none');
            } else if (sessionStatus === 'active') {
                btnPause?.classList.remove('d-none');
                btnEnd?.classList.remove('d-none');
            } else if (sessionStatus === 'paused') {
                btnResume?.classList.remove('d-none');
                btnEnd?.classList.remove('d-none');
            }
        } else {
            stateDisconnected?.classList.remove('d-none');
            stateConnected?.classList.add('d-none');
        }
    }

    // 2. Gunakan Delegasi Event (Biar tombol tetep bisa ditekan meski di d-none/remove)
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = target.id;

        if (id === 'btn-connect') {
            localStorage.setItem('spotifyConnected', 'true');
            updateUI();
        } 
        else if (id === 'btn-start-session') {
            localStorage.setItem('sessionStatus', 'active');
            updateUI();
        } 
        else if (id === 'btn-pause-session') {
            localStorage.setItem('sessionStatus', 'paused');
            updateUI();
        } 
        else if (id === 'btn-resume-session') {
            localStorage.setItem('sessionStatus', 'active');
            updateUI();
        } 
        else if (id === 'btn-end-session') {
            if (confirm("Yakin ingin mengakhiri sesi?")) {
                localStorage.setItem('sessionStatus', 'idle');
                updateUI();
            }
        }
    });

    // 3. Jalankan pertama kali saat refresh
    updateUI();
});
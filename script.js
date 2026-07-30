// Dev console easter egg message for Amit Pandey
console.log(
    '%clooks like you love to poke around,\nwill love to talk — hello@theamit.me',
    'font-family: ui-monospace, SF Mono, Monaco, monospace; font-size: 13px; line-height: 1.6; color: #E56637; padding: 8px 0;'
);

document.addEventListener('DOMContentLoaded', () => {
    // Theme Management - Default to LIGHT mode
    const html = document.documentElement;
    const themeToggles = document.querySelectorAll('.theme-toggle');

    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    function applyTheme(t) {
        html.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
    }

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            
            if (document.startViewTransition) {
                document.startViewTransition(() => applyTheme(next));
            } else {
                applyTheme(next);
            }
        });
    });

    // Real-time Clock for Footer
    const localTimeEl = document.getElementById('localTime');

    function updateClock() {
        if (!localTimeEl) return;

        const now = new Date();
        const formatted = now.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        localTimeEl.textContent = `${formatted} IST`;
    }

    if (localTimeEl) {
        updateClock();
        setInterval(updateClock, 1000);
    }
});

(function() {
    const darkStatusBarColor = '#2C3E57';
    const lightStatusBarColor = '#f3f4f6';

    function setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
        setStatusBarColor(isDark);
    }

    function setStatusBarColor(isDark) {
        const color = isDark ? darkStatusBarColor : lightStatusBarColor;
        document.querySelector('meta[name="theme-color"]').setAttribute('content', color);
        document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').setAttribute('content', isDark ? 'black-translucent' : 'default');
    }

    function applyTheme() {
        const savedTheme = localStorage.getItem('color-theme');
        const isDark = savedTheme === 'light' ? false : true; // Default to dark if not explicitly set to light
        setTheme(isDark);
    }

    // Apply theme immediately
    applyTheme();

    // Expose a global function to toggle theme
    window.toggleTheme = function() {
        const currentTheme = localStorage.getItem('color-theme');
        setTheme(currentTheme === 'light');
    };

    // Re-apply theme on page load and visibility change
    document.addEventListener('visibilitychange', applyTheme);
    window.addEventListener('load', applyTheme);
})();
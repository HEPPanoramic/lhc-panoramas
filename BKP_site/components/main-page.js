window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0;
    setTimeout(function() {
        window.location.href = href;
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    // Load all the components
    const scene = document.querySelector('.scene');
    const splash = document.querySelector('#splash');
    const loading = document.querySelector('#splash .loading');

    /*
     * An event listner that waits for the webpage to loads then prompts the
     * start button page
     */

    setTimeout(() => {
        loading.style.display = 'none';
        splash.style.backgroundColor = 'rgba(255, 255, 255, 0.0)';
        setTimeout(() => {
            splash.style.display = 'none';
        }, 500);
    }, 500);
});

/*
 * This is provides a loading screen for the a-frame page.
 * The webpage requires the loading of very large images and takes some time
 * so this a loading screen that navigates to a start button.
 * The code was taken from the website https://ottifox.com/examples/space/index.html
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load all the components
    const scene = document.querySelector('a-scene');
    const splash = document.querySelector('#splash');
    const loading = document.querySelector('#splash .loading');
    const startButton = document.querySelector('#splash .start-button');

    /*
     * An event listner that waits for the webpage to loads then prompts the
     * start button page
     */
    scene.addEventListener('loaded', function (e) {
        setTimeout(() => {
            loading.style.display = 'none';
            splash.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
            startButton.style.opacity = 1;
        }, 500);
    });

    /*
     * Once the start button is hit it will continue on to the panorama wepage
     */
    startButton.addEventListener('click', function (e) {
        splash.style.display = 'none';
    });
});

/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('set-image', {
    schema: {
        on: {type: 'string'},
        target: {type: 'selector'},
        src: {type: 'string'},
        dur: {type: 'number', default: 300}
    },

    init: function () {
        var data = this.data;
        var el = this.el;

        this.setupFadeAnimation();

        el.addEventListener(data.on, function () {
            // Fade out image.
            data.target.emit('fadein');

            setTimeout(function () {
            // Set image.
                data.target.setAttribute('material', 'src', data.src);
            }, data.dur);

            setTimeout(function () {
                data.target.emit('fadeout');

            }, data.dur*2);
        });
    },

    /**
    * Setup fade-in + fade-out.
    */
    setupFadeAnimation: function () {
        var data = this.data;
        var targetEl = this.data.target;
        console.log(data.dur);

        // Only set up once.
        if (targetEl.dataset.setImageFadeSetup) { return; }
        targetEl.dataset.setImageFadeSetup = true;

        // Create animation.
        targetEl.setAttribute('animation__fadein', {
            property: 'material.color',
            startEvents: 'fadein',
            dur: data.dur,
            from: '#FFF',
            to: '#000'
        });

        targetEl.setAttribute('animation__fadeout', {
            property: 'material.color',
            startEvents: 'fadeout',
            dur: data.dur,
            from: "#000",
            to: "#FFF"
        });
    }
});


AFRAME.registerComponent('scroll-left', {
    schema: {
        on: {type: 'string'}
    },

    init: function () {
        var data = this.data
        var el = this.el;

        el.addEventListener(data.on, function() {
            // console.log("--------------------");
            // console.log("Goodbye, World!");
            // console.log("--------------------");
            console.log(sessionStorage.images);
        });
    }
});

AFRAME.registerComponent('scroll-right', {
    schema: {
        on: {type: 'string'}
    },

    init: function () {
        var data = this.data
        var el = this.el;

        el.addEventListener(data.on, function() {
            console.log("--------------------");
            console.log("Hello, World!");
            console.log("--------------------");
        });
    }
});

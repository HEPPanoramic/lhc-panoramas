AFRAME.registerComponent('change-thumbs', {
    schema: {
        event: {type: 'string', default: ''},
        message: {type: 'string', default: 'Hello, World!'}
    },

    update: function () {
        var data = this.data; // Component property values
        var el = this.el; // Reference to the componet's entity.

        if (data.event) {
            // This will log the `message` when the entity emits the event
            el.addEventListener(data.event, function () {
                console.log(data.message);
            });
        } else {
            // `event` not specifies just log the message
            console.log(data.message);
        }
    }
});

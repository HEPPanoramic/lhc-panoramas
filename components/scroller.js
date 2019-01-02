/*
 * The scroll-left and scroll-right provide a way of transitioning between
 * excess images
 */
AFRAME.registerComponent('scroll-left', {
    schema: {
        on: {type: 'string'}
    },

    update: function () {
        var data = this.data;
        var el = this.el;

        el.addEventListener(data.on, function() {
            var image_groups_left = new ImageGroups();
            image_groups_left.pull_from_storage();

            var index = image_groups_left.get_index();

            if (index > 1) {
                console.log("New index: " + image_groups_left.index);
                image_groups_left.set_group_prev();
                image_groups_left.write_to_storage();
            } else {
                console.warn("Index out of range-left");
            }
        });
    }
});

AFRAME.registerComponent('scroll-right', {
    schema: {
        on: {type: 'string'}
    },

    update: function() {
        var data = this.data;
        var el = this.el;

        el.addEventListener(data.on, function() {
            var image_groups_right = new ImageGroups();
            image_groups_right.pull_from_storage();

            var size = image_groups_right.get_size();
            var index = image_groups_right.get_index();

            if (index <= size) {

                image_groups_right.set_group_next();
                image_groups_right.write_to_storage();
            } else {
                console.warn("Index out of range-right");
            }

            var index = image_groups_right.get_index();
        });
    }
});

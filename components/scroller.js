/*
 * The scroll-left and scroll-right provide a way of transitioning between
 * excess images
 */
AFRAME.registerComponent('scroll-left', {
    schema: {
        on: {type: 'string'}
    },

    init: function () {
        var data = this.data
        var el = this.el;

        // Get the ImageGroup Object from session storage
        var image_groups = new ImageGroups();
        image_groups.pull_from_storage();

        var index = image_groups.get_index();

        el.addEventListener(data.on, function() {
            if (index > 2) {
                // Revert the value of index
                image_groups.set_index(index - 2);
                image_groups.set_group_next("a-entity#links_top");
                image_groups.set_group_next("a-entity#links_bottom");
                image_groups.write_to_storage();
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

    init: function () {
        var data = this.data
        var el = this.el;

        var image_groups = new ImageGroups();
        image_groups.pull_from_storage();

        var index = image_groups.get_index();
        var size = image_groups.get_size();

        el.addEventListener(data.on, function() {
            if (index <= size - 2) {
                image_groups.set_group_next("a-entity#links_top");
                image_groups.set_group_next("a-entity#links_bottom");
                image_groups.write_to_storage();
            } else {
                console.warn("Index out of range-right");
            }
        });
    }
});

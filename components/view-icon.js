AFRAME.registerComponent('view-icon', {
    schema: {
        on: {type: 'string'}
    },

    update: function() {
        var data = this.data;
        var el = this.el;

        el.addEventListener(data.on, function() {
            var enitiesEl = ["#image_thumbs",
                             "#left-scroller",
                             "#right-scroller",
                             "#title"];
            enitiesEl.map(function (e) {
                var enity =  document.querySelector(e)
                entity.setAttribute("visible", !(enity.getAttribute("visible")));
            });
        });
    }
});

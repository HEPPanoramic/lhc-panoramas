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
                             // "#title1",
                             // "#title2",
                             "#prev-page"];
            enitiesEl.map(function (e) {
                var entity =  document.querySelector(e);
                entity.setAttribute("visible", !(entity.getAttribute("visible")));
            });

            var viewer = document.querySelector(".viewer");
            if (viewer.getAttribute("src") == "#view-icon") {
                viewer.setAttribute("src", "#no-view-icon");
            } else {
                viewer.setAttribute("src", "#view-icon");
            }
        });
    }
});

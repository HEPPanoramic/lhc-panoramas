AFRAME.registerComponent('initial', {
    schema: {
        files: {type: 'object'}
    },

    init: function () {
        var stringToLog =
    }
});


class AssetLoader {
    constructor(folder, div_name) {
        this.folder = folder;
        this.div_name = div_name;
        console.log(this.div_name);
        this.div_created = false;
        this.pict_json = {};
    }

    // Create <div> tag to help organize the src of the image
    create_div(super_div="image_assets") {
        if (!($("div." + this.div_name).length > 0)) {
            $("div." + super_div).append("<div class=\"" + this.div_name + "\"></div>");
            this.div_created = true;
            this.pict_json[this.folder] = [];
        }
    }

    // Create the image assets
    create_assets() {
        // Check if parent div exists
        if (!this.div_created) {
            this.create_div();

        }

        // Create local variables to remove need for this. declaration
        var folder = this.folder;
        var div_name = this.div_name;

        $.ajax({
            url : this.folder,
            success: function (data) {
                // Parse the ajax object
                $(data).find("a").attr("href", function (i, val) {
                    var ext = val.match(/\.(jpe?g|png|gif)$/);
                    console.log(i);
                    console.log(val);
                    if( ext ) {
                        // Create the image id
                        var id = val.substring(0, ext.index);
                        console.log(id);

                        // The image
                        $("div." + div_name).append(
                            "<img id='" + id + "' " +
                            "crossorigin='anonymous' " +
                            "src='" + folder + val + "'>"
                        );

                        //Create image thumbnail
                        $("div." + div_name).append(
                            "<img id='" + id + "-thumb' " +
                            "crossorigin='anonymous' " +
                            "src='" + folder + val + "'>"
                        );

                        // Create entity
                        //<a-entity template="src: #link" data-src="#atlas_1" data-thumb="#atlas_1-thumb"></a-entity>
                        // $("a-entity#links").append(
                        //     "<a-entity template='src: #link' data-src='#" + id + "' " +
                        //     "data-thumb='#" + id + "-thumb'></a-entity>"
                        // );
                    }
                });
            }
        });
    }
}

// Create basic asset loader
window.onload = function() {
    var asset = new AssetLoader("images/", "basic_assets");
    asset.create_assets();
}

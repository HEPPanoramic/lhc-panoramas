AFRAME.registerComponent('load_assets', {
    init: function () {
        console.log('I am ready!');
    }
});

var images = [];

/**
 * A AJAX function that plunges into the a folder to extract the image
 * filenames.
 * @param  String     url        uri to the folder to extract images
 * @param  {Function} callback   The  function that is used to process the data
 */
function makeAjaxCall(url, folder, thumbnails, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                console.log("xhr done successfully");
                var resp = xhr.responseText;
                callback(resp, folder, thumbnails);
            } else if (!url.match(/\.(html)$/)) {
                console.log("processed failed trying with linking.html for jekyll")
                makeAjaxCall(url + "listing.html", folder, thumbnails, callback);
            } else {
                console.log("xhr failed");
            }
        } else {
            console.log("xhr processing going on");
        }
    }
    console.log("request sent succesfully");
}

/**
 * The default callback function to parse the directory of the XML response
 * from AJAX
 * @param  String data   The XML response in string form to be parsed
 * @param  String folder The URI to the folder
 */
function extractAjaxData(data, folder, thumbnails) {
    var images = [];
    var ids = [];
    $(data).find("a").attr("href", function(i, val) {
        if(val.match(/\.(jpe?g|png|gif)$/)) {
            images.push(val);

            var id = val.split('.')[0];
            ids.push(id);
        }
    });

    // Create the image components
    addImages(images, ids, folder, thumbnails, establishSky);

    // Add the interactable enitities
    addEntities(ids);

    // Finish loading

}

/**
 * Adds the image entities to be later accessed by other enities
 * @param Array  images An array of all the image filenames
 * @param Array  ids    An array of all the names of the images
 * @param String folder The URI to the folder
 */
function addImages(images, ids, folder, thumbnails, callback) {
    var divEl = document.querySelector("div#images");
    for(var i=0; i < images.length; i++) {
        // Create image tags
        let imgEl = document.createElement("img");
        imgEl.setAttribute('id', ids[i]);
        imgEl.setAttribute('crossorigin', 'anonymous');
        imgEl.setAttribute('src', folder + images[i]);
        divEl.appendChild(imgEl);

        // Create the image thumbnails
        let imgThumb = document.createElement('img');
        imgThumb.setAttribute('id', ids[i] + '-thumb');
        imgThumb.setAttribute('crossorigin', 'anonymous');
        imgThumb.setAttribute('border', '5');
        imgThumb.setAttribute('src', thumbnails + images[i]);
        divEl.append(imgThumb);
    }

    let rand = getRandomInt(0, ids.length-1);
    callback(ids[rand]);
}

/**
 * Sets the default panorma image for the initial  website
 * @param  String image The image to set as the default sky
 */
function establishSky(image) {
    window.onload = function () {
        var skyEl = document.querySelector("a-sky");
        skyEl.setAttribute("src", "#"+image);
    }
}

/**
 * Returns a random value between the range min and max
 * @param  int min Lower bound of the random range
 * @param  int max Upper bound of the random range
 * @return int     The random integer
 */
function getRandomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * A adds the interactable entities that consit of a thumb nail
 * @param Array ids An array of all the image names to be placed
 */
function addEntities(ids) {

    var image_groups = new ImageGroups();
    image_groups.create_groups(ids);

    image_groups.set_group_next();

    image_groups.write_to_storage();
}

function finishLoad() {
    var sceneEl = document.querySelector("a-scene");
    var splash = document.querySelector("#splash");
    scene.addEventListener("loaded", function (e) {
        splash.style.display = "none";
    });
}

/*
 * The ImageGroups object is takes the list of images
 * then it provides a way of adding them with DOM and other useful features to
 * provide a interface between the side scrollers and the thumb nail selectors
 */
class ImageGroups {
    constructor() {
        this.groups = null; // The clusters of images to be displayed
        this.group_size = 3; // Always 3 in a cluster (or less)
        this.size = 0; // Number of possible image displays
        this.index = 0; // The current image display index
        this.width = 3.75; // The ideal shift value
    }

    /*
     * For unestablished sessions this splits the images into groups making
     * them more managable to work with
     * @param images An array to be spliced up and clustered into groups
     */
    create_groups(images) {
        let chuncks = this.group_size

        // Split the array into clusters of three
        this.groups = images.map(function(e,i){
            return i%chuncks===0 ? images.slice(i,i+chuncks) : null;
        }).filter(function(e){ return e; });

        var topEl = document.querySelector("#links_top");
        var bottomEl = document.querySelector("#links_bottom");

        let j = 1; // Var to offset the top and bottom clusters into groups
        for(var i=0; i < this.groups.length; i++) {
            if (i%2 == 0) { // Go top
                console.log(topEl);
                this.init_group(topEl, this.groups[i], j);
            } else { // Go bottom
                console.log(bottomEl);
                this.init_group(bottomEl, this.groups[i], j);
                // Avoid the last grouping for constitency
                if (i != this.groups.length-1) {
                    j += 1
                }
            }
        }

        // The number of possible displays
        this.size = j;
    }

    /*
     * This establishes all the current images (linked by there index)
     * @param linkEl Whether the image group will be on top or bottom
     * @param group The images being placed
     * @param index The display configuration value
     */
    init_group(linkEl, group, index) {
        group.map(function (e) {
            let subEnt = document.createElement("a-entity");
            subEnt.setAttribute("class", "group" + index);
            subEnt.setAttribute("template","src: #link");
            subEnt.setAttribute("data-src", "#" + e);
            subEnt.setAttribute("data-thumb", "#" + e + "-thumb");
            subEnt.setAttribute("visible", false);
            linkEl.append(subEnt);
        });
    }

    /*
     * Moves onto the next image configuration
     */
    set_group_next() {
        let index = this.index;

        // Remove current grouping
        $(".group" + index).each(function (i, e) {
            e.setAttribute("visible", false);
        });

        // Increment the grouping index
        index += 1;

        if (index > this.get_size()) {
            index = 1;
            for(var j=0; j < this.get_size()-1; j++)
                this.shift_position(false);
        }

        // Make the new group visible
        $(".group" + index).each(function (i, e) {
            e.setAttribute("visible", true);
        });

        // Set global index
        this.index = index;

        // As long as it is not the first grouping shift the position
        if (index != 1) {
            this.shift_position(true);
        }
    }

    /*
     * Get the previous display configuration
     */
    set_group_prev() {
        let index = this.index;

        // Can't go to a group cluster that is negative or does not exist
        if(index == 1) {
            // console.warn("Requesting negative integer");
            // return;
        }

        // Remove current grouping
        $(".group" + index).each(function (i, e) {
            e.setAttribute("visible", false);
        });

        index -= 1;

        if(index == 0) {
            index = this.get_size();
            for(var j=0; j < index; j++)
                this.shift_position(true);
        }

        // Make new grouping visible
        $(".group" + index).each(function (i, e) {
            e.setAttribute("visible", true);
        });

        this.index = index;
        // Move it to the left to recenter it
        this.shift_position(false);
    }

    /*
     * Takes the a direction and administers it to the correct position shifting
     * function, it also retrieves the the html object
     * @param direction_left Boolean if the direction is to the left (true) or right (false)
     */
    shift_position(direction_left) {
        try {
            var topPos = document.querySelector("#links_top").getAttribute("position");
            var bottomPos = document.querySelector("#links_bottom").getAttribute("position");
        } catch(e) {
            console.log("ERROR: Unsuccesful in getting position attribute");
            return;
        }

        if (direction_left) {
            document.querySelector("#links_top").setAttribute("position", this.moving_left(topPos));
            document.querySelector("#links_bottom").setAttribute("position", this.moving_left(bottomPos));
        } else {
            document.querySelector("#links_top").setAttribute("position", this.moving_right(topPos));
            document.querySelector("#links_bottom").setAttribute("position", this.moving_right(bottomPos));
        }
    }

    /*
     * Sifts the position (object or string) left (via subtraction)
     * @param pos Either a string or an JSON object to have the x value changed
     */
    moving_left(pos) {
        if(typeof(pos) == "string") {
            pos = pos.split(" ");
            pos[0] = parseFloat(pos[0]) - this.width;
            pos = pos.join(" ");
        } else {
            pos['x'] = pos['x'] - this.width;
        }
        return pos
    }

    /*
     * Sifts the position (object or string) right (via addition)
     * @param pos Either a string or an JSON object to have the x value changed
     */
    moving_right(pos) {
        if(typeof(pos) == "string") {
            pos = pos.split(" ");
            pos[0] = parseFloat(pos[0]) + this.width;
            pos = pos.join(" ");
        } else {
            pos['x'] = pos['x'] + this.width;
        }
        return pos
    }

    /*
     * Since the function creating using this class can be from a series of
     * callbacks. I am writing this object to session storage to be pulled out
     * for later use.
     */
    write_to_storage() {
        var group = {}
        this.groups.map(function(e,i) {
            group[i] = e;
        });

        var image_object = {
            'groups': group,
            'index': this.index,
            'size': this.size,
            'group_size': this.group_size
        };

        sessionStorage.setItem(
            'images',
            JSON.stringify(image_object)
        );
    }

    /*
     * After this object has been written to session storage we need a way
     * to pull out the storage, parse it and reupload it to the new instance
     * of the class.
     */
    pull_from_storage() {
        var image_object = JSON.parse(sessionStorage.images);

        this.groups = Object.keys(image_object['groups']).map(function (key) {
            return image_object['groups'][key];
        });

        this.index = image_object['index'];
        this.size = image_object['size'];
        this.group_size = image_object['group_size'];
    }

    // Getters

    /*
     * Getters to get the groups 2D array
     */
    get_groups() {
        return this.groups;
    }

    /*
     * Getter for the index
     */
    get_index() {
        return this.index;
    }

    /*
     * Getter for the size
     */
    get_size() {
        return this.size;
    }

    // Setter(s)

    /*
     * Setter for the index
     */
    set_index(new_index) {
        this.index = new_index;
    }
}

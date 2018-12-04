/**
 * This is  just a standard AFRAME componet needed to help establish
 * concurrency with the DOM objects in the script
 */
AFRAME.registerComponent('load_assets', {
    init: function () {
        console.log('I am ready!');
    }
});

var images = [];
var folder = 'images/';

/**
 * A AJAX function that plunges into the a folder to extract the image
 * filenames.
 * @param  String     url        uri to the folder to extract images
 * @param  {Function} callback   The  function that is used to process the data
 */
function makeAjaxCall(url, callback){
   var xhr = new XMLHttpRequest();
   xhr.open("GET", url, true);
   xhr.send();
   xhr.onreadystatechange = function(){
     if (xhr.readyState === 4){
        if (xhr.status === 200){
           console.log("xhr done successfully");
           var resp = xhr.responseText;
           callback(resp, url);
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
function extractAjaxData(data, folder) {
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
    addImages(images, ids, folder, establishSky);

    // Add the interactable enitities
    addEntities(ids);
}

/**
 * Adds the image entities to be later accessed by other enities
 * @param Array  images An array of all the image filenames
 * @param Array  ids    An array of all the names of the images
 * @param String folder The URI to the folder
 */
function addImages(images, ids, folder, callback) {
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
        imgThumb.setAttribute('src', folder + images[i]);
        divEl.append(imgThumb);
    }

    let rand = getRandomInt(0, ids.length);
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

    image_groups.set_group_next("a-entity#links_top");
    image_groups.set_group_next("a-entity#links_bottom");

    image_groups.write_to_storage();
}

/*
 * The ImageGroups object is takes the list of images
 * then it provides a way of adding them with DOM and other useful features to
 * provide a interface between the side scrollers and the thumb nail selectors
 */
class ImageGroups {
    constructor() {
        this.image = null;
        this.groups = null;
        this.group_size = 3;
        this.index = 0;
    }

    /*
     * For unestablished sessions this splits the images into groups making
     * them more managable to work with
     */
    create_groups(images) {
        this.images = images;

        let chuncks = this.group_size
        this.groups = images.map(function(e,i){
            return i%chuncks===0 ? images.slice(i,i+chuncks) : null;
        }).filter(function(e){ return e; });

        for(var i=0; i < this.groups.length; i++) {
            if (i%2 == 0) {
                console.log("Linking to top element");
                var linkEl = document.querySelector("#links_top");
            } else {
                console.log("Linking to bottom element")
                var linkEl = document.querySelector("#links_bottom");
            }

            var groupEl = document.createElement("a-entity");
            groupEl.setAttribute("id", "group" + i);
            groupEl.setAttribute("layout", JSON.stringify({
                "type": "line",
                "margin": 1.25
            }));

            if(i != 0) {
                groupEl.setAttribute("visible", false);
            }

            this.groups[i].map(function (e, i) {
                var img = document.createElement("a-entity");
                img.setAttribute("template", JSON.stringify({
                    "src": "#link"
                }));
                img.setAttribute("data-src", "#" + e);
                img.setAttribute("data-thumb", "#" + e + "-thumb");
                groupEl.appendChild(img);
            });

            linkEl.appendChild(groupEl);
        }
    }

    /*
     * This function takes a id tag and appends the next possible image group
     * as children
     * @param parent The image tag used to help
     */
    set_group_next() {
        console.warn("Function not implemented");
        // let index = this.index;
        //
        // if (index < this.group.length) {
        //     document.querySelector("#group" + index).setAttribute("visible", true);
        //
        //     this.index += 1;
        // } else {
        //     console.warn("WARNING: Accessing element out of range");
        // }
    }

    /*
     * Since groups may be of un-natural size there may be a need repostioning
     * 3 elements is the default postion at x=-1.5
     * 2 elements staggers the images at x=-1
     * 1 element is placed in same spot as middle image for 3 (x=-0.25)
     *
     * @param size Is the postion placement value
     * @param The a-entity being modified
     */
    position_shift(size, pos) {
        // top for 3: "-1.5 1.5 -4"
        // bot for 3: "-1.5 0.25 -4"
        if(size > 3 || size < 0) {
            throw new Error("Invalid size argument in shifting postion: Must be \
            between 1 and 3");
        } else if (size == 3) {
            pos['x'] = -1.5;
        } else if (size == 2) {
            pos['x'] = -1;
        } else if (size == 1) {
            pos['x'] = -0.25;
        }
        return pos;
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
        return this.groups.length;
    }

    // Setter(s)

    /*
     * Setter for the index
     */
    set_index(new_index) {
        this.index = new_index;
    }
}

// Call makeAjaxCall which will cascade into the other functions
makeAjaxCall(folder, extractAjaxData);

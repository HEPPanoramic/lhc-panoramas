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
        this.groups = null;
        this.group_size = 3;
        this.index = 0;
    }

    /*
     * For unestablished sessions this splits the images into groups making
     * them more managable to work with
     */
    create_groups(images) {
        let chuncks = this.group_size
        this.groups = images.map(function(e,i){
            return i%chuncks===0 ? images.slice(i,i+chuncks) : null;
        }).filter(function(e){ return e; });
    }

    /*
     * This function takes a id tag and appends the next possible image group
     * as children
     * @param parent The image tag used to help
     */
    set_group_next(parent) {
        var linkEl = document.querySelector(parent);
        let index = this.index;

        if (index >= this.groups.length) {
            console.warn("Requesting more than needed");
            this.index += 1; // To keep constitancy
            return; // Do nothing if there is a lone group
        }
        let group = this.groups[this.index];

        if(linkEl.childNodes.length == 0) {
            console.log("Establishing elements");
            this.init_group_next(linkEl, group);
        } else {
            console.log("Updating elements");
            this.update_group_next(linkEl, group);
        }

        this.position_shift(group.length, linkEl);

        this.index += 1;
    }

    init_group_next(linkEl, group) {
        group.map(function (e) {
            let subEnt = document.createElement("a-entity");
            subEnt.setAttribute("template","src: #link");
            subEnt.setAttribute("data-src", "#" + e);
            subEnt.setAttribute("data-thumb", "#" + e + "-thumb");
            subEnt.setAttribute("visible", true);
            linkEl.append(subEnt);
        });
    }

    update_group_next(linkEl, group) {
        var children = linkEl.childNodes;

        for(var i=0; i < group.length; i++) {
            children[i].setAttribute("data-src", "#" + group[i]);
            children[i].setAttribute("data-thumb", "#" + group[i] + "-thumb");
            children[i].setAttribute("visible", true);
        }

        for(var j=children.length-1; j >= group.length; j--) {
            children[j].setAttribute("visible", false);
        }
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
    position_shift(size, linkEl) {
        // top for 3: "-1.5 1.5 -4"
        // bot for 3: "-1.5 0.25 -4"
        try {
            var pos = linkEl.getAttribute('position');
        } catch(e) {
            console.log("ERROR: Unsuccesful in getting position attribute");
            return;
        }
        if (typeof(pos) == "string") {
            pos = pos.split(" ");
            if(size > 3 || size < 0) {
                throw new Error("Invalid size argument in shifting postion: Must be \
                between 1 and 3");
            } else if (size == 3) {
                pos[0] = "-1.5";
            } else if (size == 2) {
                pos[0] = "-1";
            } else if (size == 1) {
                pos[0] = "-0.25";
            }
            pos = pos.join(" ");
        } else {
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
        }
        linkEl.setAttribute('position', pos);
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

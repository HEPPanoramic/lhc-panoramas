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

    // Save data into this session
    sessionStorage.setItem('images', ids);

    // Create the image components
    addImages(images, ids, folder);

    // Set the default background as random
    let rand = getRandomInt(0, ids.length);
    establishSky(ids[rand]);

    // Add the interactable enitities
    addEntities(ids);
}

/**
 * Adds the image entities to be later accessed by other enities
 * @param Array  images An array of all the image filenames
 * @param Array  ids    An array of all the names of the images
 * @param String folder The URI to the folder
 */
function addImages(images, ids, folder) {
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
}

/**
 * Sets the default panorma image for the initial  website
 * @param  String image The image to set as the default sky
 */
function establishSky(image) {
    var skyEl = document.querySelector("a-sky");
    skyEl.setAttribute("src", "#"+image);
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
    var group_size = 3;
    var groups = ids.map(function(e,i){
        return i%group_size===0 ? ids.slice(i,i+group_size) : null;
    }).filter(function(e){ return e; });

    var top_entityEl = document.querySelector("a-entity#links_top");
    for(var i=0; i < 3; i++) {
        let subEnt = document.createElement("a-entity");
        subEnt.setAttribute("template","src: #link");
        subEnt.setAttribute("data-src", "#" + ids[i]);
        subEnt.setAttribute("data-thumb", "#" + ids[i] + "-thumb");
        top_entityEl.append(subEnt);
    }
    var bottom_entityEl = document.querySelector("a-entity#links_bottom");
    for(var i=3; i < 6; i++) {
        let subEnt = document.createElement("a-entity");
        subEnt.setAttribute("template","src: #link");
        subEnt.setAttribute("data-src", "#" + ids[i]);
        subEnt.setAttribute("data-thumb", "#" + ids[i] + "-thumb");
        bottom_entityEl.append(subEnt);
    }
}

// Call makeAjaxCall which will cascade into the other functions
makeAjaxCall(folder, extractAjaxData);

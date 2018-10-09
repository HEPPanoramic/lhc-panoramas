AFRAME.registerComponent('load_assets', {
    init: function () {
        console.log('I am ready!');
    }
});

var images = [];
var folder = 'images/';

function makeAjaxCall(url, methodType, callback){
   var xhr = new XMLHttpRequest();
   xhr.open(methodType, url, true);
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

makeAjaxCall(folder, "GET", extractAjaxData);

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

    addImages(images, ids, folder);
    addEntities(ids);
    
    let rand = getRandomInt(0, ids.length);
    establishSky(ids[rand]);
}

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

function addEntities(ids) {
    var entityEl = document.querySelector("a-entity#links");
    for(var i=0; i < ids.length; i++) {
        let subEnt = document.createElement("a-entity");
        subEnt.setAttribute("template","src: #link");
        subEnt.setAttribute("data-src", "#" + ids[i]);
        subEnt.setAttribute("data-thumb", "#" + ids[i] + "-thumb");
        entityEl.append(subEnt);
    }
}

function establishSky(image) {
    var skyEl = document.querySelector("a-sky");
    skyEl.setAttribute("src", "#"+image);
}

function getRandomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

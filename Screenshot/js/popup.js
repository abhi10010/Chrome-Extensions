//
// utility methods
//
function $(id) { return document.getElementById(id); }
function show(id) { $(id).style.display = 'block'; }
function hide(id) { $(id).style.display = 'none'; }
$('clickimage').onclick = download;
//
// URL Matching test - to verify we can talk to this URL
//
var matches = ['http://*/*', 'https://*/*', 'ftp://*/*', 'file://*/*'],
    noMatches = [/^https?:\/\/chrome.google.com\/.*$/];
function testURLMatches(url) {
    var r, i;
    for (i=noMatches.length-1; i>=0; i--) {
        if (noMatches[i].test(url)) {
            return false;
        }
    }
    for (i=matches.length-1; i>=0; i--) {
        r = new RegExp('^' + matches[i].replace(/\*/g, '.*') + '$');
        if (r.test(url)) {
            return true;
        }
    }
    return false;
}

//
// Events
//
var screenshot, contentURL = '';
var canvas;

function sendScrollMessage(tab) {
    contentURL = tab.url;
    screenshot = {};
    chrome.tabs.sendRequest(tab.id, {msg: 'scrollPage'}, function() {
        openPage();
    });
}

chrome.extension.onRequest.addListener(function(request, sender, callback) {
    if (request.msg === 'capturePage') {
        capturePage(request, sender, callback);
    } else {
        console.error('Unknown message :' + request.msg);
    }
});


function capturePage(data, sender, callback) {
    

    //$('percentage').innerHTML = (data.complete * 100).toFixed(2) + '%';

    // Get window.devicePixelRatio from the page, not the popup
    var scale = data.devicePixelRatio && data.devicePixelRatio !== 1 ?
        1 / data.devicePixelRatio : 1;

    // if the canvas is scaled, then x- and y-positions have to make
    // up for it
    if (scale !== 1) {
        data.x = data.x / scale;
        data.y = data.y / scale;
        data.totalWidth = data.totalWidth / scale;
        data.totalHeight = data.totalHeight / scale;
    }


    if (!screenshot.canvas) {
        canvas = document.createElement('canvas');
        canvas.width = data.totalWidth;
        canvas.height = data.totalHeight;
        screenshot.canvas = canvas;
        screenshot.ctx = canvas.getContext('2d');
    }

    chrome.tabs.captureVisibleTab(
        null, {format: 'png', quality: 100}, function(dataURI) {
            if (dataURI) {
                var image = new Image();
                image.onload = function() {
                    screenshot.ctx.drawImage(image, data.x, data.y);
                    callback(true);
                };
                image.src = dataURI;
            }
        });
}

function openPage() {
    // come up with a filename
    //var name = contentURL.split('?')[0].split('#')[0];
    //if (name) {
    //    name = name
    //        .replace(/^https?:\/\//, '')
    //        .replace(/[^A-z0-9]+/g, '-')
    //        .replace(/-+/g, '-')
    //        .replace(/^[_\-]+/, '')
    //        .replace(/[_\-]+$/, '');
    //    name = '-' + name;
    //} else {
    //    name = '';
    //}
    name = 'screenshot' + '.png';

    canvas.toBlob(function(blob) {
        saveAs(blob, name); 
        $('percentage').innerHTML = 'images/button.png';
    });
   
}


function download() {
    chrome.tabs.getSelected(null, function(tab) {
    if (testURLMatches(tab.url)) {
        var loaded = false;
        chrome.tabs.executeScript(tab.id, {file: 'js/page.js'}, function() {
            loaded = true;
            show('loading');
            sendScrollMessage(tab);
        });
        
    } 
});
}


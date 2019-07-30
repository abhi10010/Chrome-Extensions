document.addEventListener('DOMContentLoaded', function () {
	// add event listener for buttons
	document.getElementById('open').addEventListener('click', loadSites);
    document.getElementById('clear').addEventListener('click', alert_msg);
});

// load sites in new background tabs
function loadSites(e) {
	var urlschemes = ['http', 'https', 'file', 'view-source'];
	var urls = document.getElementById('urls').value.split('\n');

	for(var i=0; i<urls.length; i++){
		theurl = urls[i].trim();
		// replace spaces with '+' sign globally to generate the desired url
		theurl = theurl.replace(new RegExp(' ','g'),'+');
		if(theurl != '') {
			if(urlschemes.indexOf(theurl.split(':')[0]) == -1) {
				theurl0 = 'http://www.google.co.in/search?q=' + theurl;
				theurl1 = 'https://www.amazon.in/s/field-keywords=' + theurl;
				theurl2 = 'https://www.bing.com/search?q=' + theurl; 
			}
			// open tabs
			if(theurl.split(':')[0] != 'view-source' && theurl.split(':')[0] != 'file') {
				chrome.tabs.create({url: theurl0, selected: false});
				chrome.tabs.create({url: theurl1, selected: false}); 
				chrome.tabs.create({url: theurl2, selected: false});
			}
		}
	}
}

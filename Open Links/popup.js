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
		if(theurl != '') {
			if(urlschemes.indexOf(theurl.split(':')[0]) == -1) {
				theurl = 'http://' + theurl;
			}
			// open tabs
			if(theurl.split(':')[0] != 'view-source' && theurl.split(':')[0] != 'file') {
				chrome.tabs.create({url: theurl, selected: false});
			}
		}
	}
}

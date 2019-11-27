
chrome.storage.sync.get('mytext', function(data) {
	document.querySelector('div').value = data.mytext;
});

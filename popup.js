function infoMessage (json){
	document.getElementById("log").textContent = JSON.stringify(json, undefined, 4)
}

document.body.onload = function() {
	chrome.storage.sync.get(['mixer','twitch'], function(details) {
		if (!chrome.runtime.error) {
			// infoMessage(details)
			// document.getElementById("log2").textContent = chrome.identity.getRedirectURL()
		}
	})
}


document.getElementById("mixerUpdate").onclick = updateMixer

async function updateMixer() {
	let token    = document.getElementById("mixerInput").value
	const url    = `https://mixer.com/api/v1/channels/${token}`
	let response = await fetch(url)
	let details  = await response.json()
	chrome.storage.sync.set({"mixer": details}, function () {
		if (chrome.runtime.error) {
			console.log("Runtime error.")
		}
	})
}


document.getElementById("twitch-oauth").onclick = connect
	function connect(){
		window.oauth2.start()
	}


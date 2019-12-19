function infoMessage (json){
	document.getElementById("log").textContent = JSON.stringify(json, undefined, 4)
}

document.body.onload = function() {
	chrome.storage.sync.get(['mixer','twitch'], function(details) {
		if (!chrome.runtime.error) {
			infoMessage(details)
			document.getElementById("log2").textContent = chrome.identity.getRedirectURL()
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

document.getElementById("twitch-1").onclick = twitch1
function twitch1(){
	chrome.identity.getProfileUserInfo(function(userinfo){
		infoMessage(userinfo)
	});
}

document.getElementById("twitch-2").onclick = twitch2
function twitch2(){

}
document.getElementById("twitch-3").onclick = twitch3
function twitch3(){

}

document.getElementById("twitch-oauth").onclick = connect
	function connect(){
		window.oauth2.start()
	}

async function updateTwitch() {
	let login    = document.getElementById("twitchInput").value
	let url    = `https://api.twitch.tv/helix/users?login=${login}`
	let response = await fetch(url,{
		headers: {
			'Client-ID': 'yr67fty5tcazl2ew3jda8sw17cy87d'
		},
	})
	let details  = await response.json()
	document.getElementById("log2").textContent = JSON.stringify(details, undefined, 4)
	chrome.storage.sync.set({"twitch": details.data[0]}, function () {
		if (chrome.runtime.error) {
			console.log("Runtime error.")
		}
	})
}

async function channelDetails (name) {
	const url = `https://mixer.com/api/v1/channels/${name}`
	const response = await fetch(url)
	const details = await response.json()
	if (details.online) {
		addStreamerElement(
			details.token,
			`https://mixer.com/${details.token}`,
			details.user.avatarUrl,
			details.name,
			details.viewersCurrent
		)
	}
}

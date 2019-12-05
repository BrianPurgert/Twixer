
document.body.onload = function() {
	chrome.storage.sync.get(['mixer','twitch'], function(details) {
		if (!chrome.runtime.error) {
			// document.getElementById("log").textContent = JSON.stringify(details.mixer, undefined, 4)
			// document.getElementById("log2").textContent = JSON.stringify(details.twitch, undefined, 4)

			let twitchPlaceholder = `${details.twitch.display_name} (${details.twitch.id})`
			document.getElementById("twitchInput").placeholder = twitchPlaceholder
			let mixerPlaceholder = `${details.mixer.token} (${details.mixer.userId})`
			document.getElementById("mixerInput").placeholder = mixerPlaceholder
		}
	})
}

// async function channelDetails (name) {
// 	const url = `https://mixer.com/api/v1/channels/${name}`
// 	let response = await fetch(url)
// 	let details = await response.json()
// }

// document.getElementById("mixerInput").addEventListener("keydown", function(event) {
// 	event.preventDefault();
// 	if (event.key === 'Enter') {
// 		document.getElementById("mixerUpdate").click();
// 	}
// })

document.getElementById("mixerUpdate").onclick = updateMixer

async function updateMixer() {
	let token    = document.getElementById("mixerInput").value
	const url    = `https://mixer.com/api/v1/channels/${token}`
	let response = await fetch(url)
	let details  = await response.json()
	// chrome.storage.local.clear()
	chrome.storage.sync.set({"mixer": details}, function () {
		if (chrome.runtime.error) {
			console.log("Runtime error.")
		}
	})
}

document.getElementById("twitchUpdate").onclick = updateTwitch
// https://api.twitch.tv/helix/streams?from_id=57102172

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



// const a = `https://api.twitch.tv/kraken/streams/followed?limit=100&offset=0`

// const b = `https://mixer.com/api/v1/users/search?query=${query}`
// let userId = ""
	// `https://mixer.com/api/v1/users/current`
	// `https://mixer.com/api/v1/users/${userId}/follows?fields=id,token&limit=100&page=0`
	// `https://mixer.com/api/v1/users/${userId}/follows?fields=id,online,name,token,viewersCurrent,partnered,costreamId,interactive,type,audience,user&where=online:eq:true&order=viewersCurrent:desc&limit=100&page=0`
// const c = `https://mixer.com/api/v1/users/${userId}/follows?limit=100&page=0&where=online:eq:true`


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

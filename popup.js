function infoMessage (json){
	document.getElementById("log").textContent = JSON.stringify(json, undefined, 4)
}

function htmlToElement (html) {
	let template = document.createElement('template')
	html = html.trim()
	template.innerHTML = html
	return template.content.firstChild
}

async function twitchValidate (init) {
	let streamsUrl    = `https://id.twitch.tv/oauth2/validate`
	let response = await fetch(streamsUrl,init)
	return await response.json()
}

async function twitchUser (userId, init){
	let streamsUrl    = `https://api.twitch.tv/helix/users?id=${userId}`
	let response = await fetch(streamsUrl,init)
	return await response.json()
}

document.body.onload = function() {
	chrome.storage.sync.get(['mixer','twitch'], function(details) {
		if (!chrome.runtime.error) {
			infoMessage(details)
			let mxToken = details.mixer.userId
			let twToken = details.twitch.access_token
			let init = {
				headers: {
					'Client-ID': 'yr67fty5tcazl2ew3jda8sw17cy87d',
					'authorization': `OAuth ${twToken}`,
					'Accept': 'application/vnd.twitchtv.v5+json'
				},
			}


			twitchValidate(init).then(r =>{
				twitchUser(r.user_id, init).then(r =>{
					infoMessage (r.data)
					let user = r.data[0]


					let twitchUser = document.getElementById('twitch-user')
					let twitchAvatar = htmlToElement(`<img class="twitch-avatar" alt="User Avatar" src="${user.profile_image_url}">`					)
					let twitchOauth = document.getElementById('twitch-oauth')

					twitchUser.insertBefore(twitchAvatar, twitchOauth)
					twitchOauth.placeholder = user.display_name


					// let twitchPlaceholder = `${details.twitch.display_name} (${details.twitch.id})`
					// document.getElementById("twitch-oauth").placeholder = twitchPlaceholder
				})

			})


			let mixerPlaceholder = `${details.mixer.token} (${details.mixer.userId})`
			document.getElementById("mixerInput").placeholder = mixerPlaceholder

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

function connect() {
	window.oauth2.start()
}


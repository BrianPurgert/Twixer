function element (html) {
	let template = document.createElement('template')
	template.innerHTML = html.trim()
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

function refresh(){
	chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
		chrome.tabs.reload(arrayOfTabs[0].id)
	})
}

function insertMixerUserInfo(details) {
	let mixerUser   = document.getElementById('mixer-user')
	let mixerAvatar = element(`<img class="avatar" alt="User Avatar" src="${details.mixer.avatarUrl}">`)
	let mixerInput  = document.getElementById('mixerInput')
	mixerUser.insertBefore(mixerAvatar, mixerInput)
	document.getElementById("mixerInput").placeholder = `${details.mixer.token}`
}

document.body.onload = function() {
	chrome.storage.sync.get(['mixer','twitch'], function(details) {
			if (typeof details.mixer !== 'undefined'){
				insertMixerUserInfo(details)
			}
			if (typeof details.twitch !== 'undefined'){
				let twToken = details.twitch.access_token
				let init    = {
					headers: {
						'Client-ID':     'yr67fty5tcazl2ew3jda8sw17cy87d',
						'authorization': `OAuth ${twToken}`,
						'Accept':        'application/vnd.twitchtv.v5+json'
					},
				}
				twitchValidate(init).then(r => {
					twitchUser(r.user_id, init).then(r => {
						let user = r.data[0]
						let twitchUser   = document.getElementById('twitch-user')
						let twitchAvatar = element(`<img class="avatar" alt="User Avatar" src="${user.profile_image_url}">`)
						let twitchOauth  = document.getElementById('twitch-oauth')

						twitchUser.insertBefore(twitchAvatar, twitchOauth)
						twitchOauth.placeholder = user.display_name
					})
				})
		}
	})
}

document.getElementById("mixer-update").onclick = updateMixer

document.getElementById("mixerInput").addEventListener("keydown", function(event) {
	if (event.key === "Enter") {
		document.getElementById("mixer-update").click()
	}
})


async function updateMixer() {
	let mixerInput = document.getElementById("mixerInput")
	let token    = mixerInput.value
	const url    = `https://mixer.com/api/v1/channels/${token}`
	let response = await fetch(url)
	let details  = await response.json()
	details = {
		"id": details.id,
		"token": details.token,
		"userId": details.userId,
		"bannerUrl": details.bannerUrl,
		"avatarUrl": details.user.avatarUrl
	}
	chrome.storage.sync.set({"mixer": details}, function () {
		document.getElementById("mixerInput").textContent = `${details.token}`
		refresh()
	})
}


document.getElementById("twitch-oauth").onclick = connect

function connect() {
	window.oauth2.start()
}


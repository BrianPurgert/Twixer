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

async function twitchUser (userId, twToken){
	let init    = {
		headers: {
			'Client-ID':     'yr67fty5tcazl2ew3jda8sw17cy87d',
			'authorization': `Bearer ${twToken}`,
			'Accept':        'application/vnd.twitchtv.v5+json'
		},
	}

	let streamsUrl    = `https://api.twitch.tv/helix/users`
	let response = await fetch(streamsUrl,init)
	return await response.json()
}

function refresh(){
	chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
		chrome.tabs.reload(arrayOfTabs[0].id)
	})
}

document.body.onload = function() {
	chrome.storage.sync.get(['twitch'], function(details) {
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
					twitchUser(r.user_id, twToken).then(r => {

						let user = r.data[0]
						let twitchUserEl   = document.getElementById('twitch-user')
						let twitchAvatar = element(`<img class="avatar" alt="User Avatar" src="${user.profile_image_url}">`)
						let twitchOauth  = document.getElementById('twitch-oauth')

						twitchUserEl.insertBefore(twitchAvatar, twitchOauth)
						twitchOauth.placeholder = user.display_name
						console.log(user.display_name)
					})
				})
		}
	})
}



document.getElementById("twitch-oauth").onclick = connect

function connect() {
	window.oauth2.start()
}


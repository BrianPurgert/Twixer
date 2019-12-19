// client-id: yr67fty5tcazl2ew3jda8sw17cy87d
// client-secret: 1pvfofspvt2bjujcjc3tn0ozcv05tg

// https://id.twitch.tv/oauth2/authorize?client_id=yr67fty5tcazl2ew3jda8sw17cy87d&redirect_uri=https://www.twitch.tv/robots.txt&response_type=token&scope=channel_feed_read+viewing_activity_read&force_verify=true

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
	// chrome.storage.local.clear()
	chrome.storage.sync.set({"mixer": details}, function () {
		if (chrome.runtime.error) {
			console.log("Runtime error.")
		}
	})
}

// document.getElementById("twitchUpdate").onclick = updateTwitch
document.getElementById("twitch-1").onclick = twitch1
function twitch1(){
	chrome.identity.getProfileUserInfo(function(userinfo){
		// console.log("userinfo",userinfo);
		infoMessage(userinfo)
	});
}

document.getElementById("twitch-2").onclick = twitch2
function twitch2(){
	// chrome.identity.getAccounts(function callback)
}
document.getElementById("twitch-3").onclick = twitch3
function twitch3(){
		let access_token_url = "https =//id.twitch.tv/oauth2/token"
		let authorization_url = "https =//id.twitch.tv/oauth2/authorize"
		let client_id = "yr67fty5tcazl2ew3jda8sw17cy87d"
		let client_secret = "1pvfofspvt2bjujcjc3tn0ozcv05tg"
		let redirect_url = chrome.identity.getRedirectURL()
		let scopes = ["user_read"]
		let key = "oauth2_token"
	let url = authorization_url    +
	          "?client_id="     + client_id        +
	          "&redirect_uri="  + redirect_url     +
	          "&response_type=token"                    +
	          "&scope="         + scopes.join('+') +
	          "&force_verify=true"

	chrome.storage.sync.get(['twitch'], function(details) {
		if (!chrome.runtime.error) {

		}
	})

			let get_auth_token = chrome.identity.getAuthToken

			infoMessage ({
				"getAuthToken": get_auth_token,
				"getRedirectURL": redirect_url
			})
			console.log(get_auth_token)


	// chrome.identity.getAccounts(function callback)
}



document.getElementById("twitch-oauth").onclick = connect

	function connect(){
		window.oauth2.start()
	}


//chrome-extension://cmjgjblfkpegeijaeddmfogbgpnjmlpe/index.html
// cmjgjblfkpegeijaeddmfogbgpnjmlpe
// https://id.twitch.tv/oauth2/authorize?client_id=v2kiaeylw9qbkwpfl7lmrczcchpkpc&redirect_uri=chrome-extension://cmjgjblfkpegeijaeddmfogbgpnjmlpe/options/options.html&response_type=token&scope=user_read&force_verify=true
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

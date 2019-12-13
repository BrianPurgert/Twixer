function log (output){
	let css = "text-shadow: 3px 0px 0px #CE5937, -3px 0px 0px #CE5937, 0px 3px 0px #4A78C1, 0px -3px 0px #4A78C1;" +
	          "background: #444;" +
	          "color: #bada55;" +
	          "padding: 2px;" +
	          "border-radius:2px;" +
	          "font-size: 15px;"

	console.log("%cTwixer %s", css, output.toString());
	console.log(output)
}

function htmlToElement (html) {
	let template = document.createElement('template')
	html = html.trim()
	template.innerHTML = html
	return template.content.firstChild
}

function mountMixerSidebar() {
	let mixerSidebar = htmlToElement(`<div id="mixer-side-nav" class=""><div class="side-nav-header"><h5>Followed Channels</h5></div><div id="live-channels"></div></div>`)
	let mixerSidebarParent = document.querySelector('b-app .content')
	mixerSidebarParent.appendChild(mixerSidebar)
}

// TODO:
//https://static-cdn.jtvnw.net/jtv_user_pictures/c829484a-c662-40de-a243-00ec253cabbb-profile_image-300x300.png
//https://static-cdn.jtvnw.net/previews-ttv/live_user_clix-{width}x{height}.jpg
async function twitchStreams (userId) {
	let init = { headers: { 'Client-ID': 'yr67fty5tcazl2ew3jda8sw17cy87d' }, }
	//ttps://api.twitch.tv/helix/users?login%5B%5D=solaryfortnite&login%5B%5D=calculator1x&login%5B%5D=je
	//https://api.twitch.tv/kraken/streams?channel%5B%5D=198506129&channel%5B%5D=
	let streamsUrl    = `https://api.twitch.tv/helix/users/follows?first=100&from_id=${userId}`
	let response = await fetch(streamsUrl,init)
	let streams  = await response.json()
	let xyz = streams.data.filter(stream => {
		return stream.type === "live"
	})
	console.log(xyz)
	let ids = streams.data.map(stream => {return `id=${stream.user_id}`}).join('&')
	let usersUrl = `https://api.twitch.tv/helix/users?${ids}`
	let usersResponse = await fetch(usersUrl,init)
	let users  = await usersResponse.json()

	const combined = streams.data.map(stream => {
		//TODO: Uncaught (in promise) TypeError: Cannot read property 'find' of undefined
		let result = users.data.find(user => {
			return user.id === stream.user_id
		})
		return {...stream, ...result}
	})
	console.log(combined)

	combined.forEach(streamer => {
		addStreamerElement(
			streamer.display_name,
			`https://www.twitch.tv/${streamer.user_name}`,
			streamer.profile_image_url,
			streamer.title,
			streamer.viewer_count,
			false
		)
	})

}

async function mixerStreams (userId) {
				let url      = `https://mixer.com/api/v1/users/${userId}/follows?fields=id,online,name,token,viewersCurrent,user,type&where=online:eq:true&order=viewersCurrent:desc&limit=100&page=0`
				let response = await fetch(url)
				let details  = await response.json()
				details.forEach(streamer => {
					console.log(streamer)
					addStreamerElement(
						streamer.token,
						`https://mixer.com/${streamer.token}`,
						streamer.user.avatarUrl,
						streamer.type.name,
						streamer.viewersCurrent,
						true
					)
				})
}

// async function channelDetails (name) {
// 	const url = `https://mixer.com/api/v1/channels/${name}`
// 	const response = await fetch(url)
// 	const details = await response.json()
// 	if (details.online) {
// 		addStreamerElement(
// 			details.token,
// 			`https://mixer.com/${details.token}`,
// 			details.user.avatarUrl,
// 			details.name,
// 			details.viewersCurrent
// 		)
// 	}
// }

function listElementsExist() {
	return !!([...document.querySelector('.side-nav-header').nextSibling.childNodes])
}

function getElements(cb) {
	const interval = setInterval(() => {
		if (listElementsExist()) {
			clearInterval(interval)
			cb([...document.querySelector('.side-nav-header').nextSibling.childNodes])
		}
	}, 1000)
}

// getElements((els) => {
// 	console.log(els)
// 	const out = els.map((el) => {
// 		const [channelName, game, viewerCount] = el.innerText.split('\n\n')
// 		return {channelName, game, viewerCount}
// 	})
// 	console.log(out)
// })

function streamerTemplate(channelName, href, src, game, viewerCount, isMixer){

	return `<div class="streamer-card tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done" style="transition-property: transform, opacity; transition-timing-function: ease;">
    <div>
        <div class="side-nav-card tw-align-items-center tw-flex tw-relative" style="">
        <a ${openNewTab} class="side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05" data-a-id="followed-channel-0" data-a-target="followed-channel" href="${href}">
            <div class="side-nav-card__avatar tw-align-items-center tw-flex-shrink-0">
                <figure aria-label="${channelName}" class="tw-avatar tw-avatar--size-30"><img class="tw-block tw-border-radius-rounded tw-image tw-image-avatar" alt="${channelName}" src="${src}"></figure>
            </div>
            <div class="tw-ellipsis tw-flex tw-full-width tw-justify-content-between">
                <div data-a-target="side-nav-card-metadata" class="tw-ellipsis tw-full-width tw-mg-l-1">
                    <div class="side-nav-card__title tw-align-items-center tw-flex">
                    	<p class="tw-c-text-alt tw-ellipsis tw-ellipsis tw-flex-grow-1 tw-font-size-5 tw-line-height-heading tw-semibold" data-a-target="side-nav-title" title="${channelName}">${channelName}</p>
                    </div>
                    <div data-a-target="side-nav-game-title" class="side-nav-card__metadata tw-pd-r-05">
                    	<p class="tw-c-text-alt-2 tw-ellipsis tw-font-size-6 tw-line-height-heading" title="${game}">${game}</p>
                    </div>
                </div>
                <div data-a-target="side-nav-live-status" class="side-nav-card__live-status tw-flex-shrink-0 tw-mg-l-05">
                    <div class="tw-align-items-center tw-flex">
                        <div class="twixer-status-indicator ${isMixer?'mixer-status-indicator':'twitch-status-indicator'}"></div>
                        <div class="tw-mg-l-05">
                        	<span class="tw-c-text-alt tw-font-size-6">${viewerCount}</span>
                        </div>
                    </div>
                    <div class="favorite-checkbox">
                    	<input class="star" type="checkbox" title="Favorite"/>
					</div>
                </div>
            </div>
        </a></div>
    </div>
</div>`
}

function kFormatter(num) {
	return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : Math.sign(num)*Math.abs(num)
}

// TODO: add option to open in current tab/new tab
// let openNewTab = 'rel="noopener noreferrer" target="_blank"'
let openNewTab = ''
function addStreamerElement (channelName, href, src, game, viewerCount,isMixer) {
	let followedStreamerTemplate = htmlToElement(
		streamerTemplate(
			channelName,
			href,
			src,
			game,
			kFormatter(viewerCount),
			isMixer
		)
	)
	console.log(window.location.hostname)
	if (window.location.hostname === "mixer.com"){
		let twitchFollowedChannels = document.querySelector('#live-channels')
		twitchFollowedChannels.appendChild(followedStreamerTemplate)
	} else if (window.location.hostname === "www.twitch.tv"){
		let twitchFollowedChannels = document.querySelector('[data-a-target="side-nav-header-expanded"] + div.tw-relative.tw-transition-group')
		twitchFollowedChannels.appendChild(followedStreamerTemplate)
	}
}

document.body.onload = function() {
	chrome.storage.sync.get(['mixer','twitch'], function(details) {
		if (!chrome.runtime.error) {
			if (window.location.hostname === "mixer.com"){
				mountMixerSidebar()
				twitchStreams(details.twitch.id)

			}
			mixerStreams(details.mixer.userId)
		}
	})
}

console.log(window.location.hostname)



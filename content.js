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

function twitchStreams () {
	chrome.storage.sync.get(['twitch'],async function(details) {
		if (!chrome.runtime.error) {
			let url    = `https://api.twitch.tv/helix/streams?from_id=${details.twitch.id}`
			let response = await fetch(url,{
				headers: {
					'Client-ID': 'yr67fty5tcazl2ew3jda8sw17cy87d'
				},
			})
			let details  = await response.json().data
		}
	})
}

async function mixerStreams (userId) {
				let url      = `https://mixer.com/api/v1/users/${userId}/follows?fields=id,online,name,token,viewersCurrent,user&where=online:eq:true&order=viewersCurrent:desc&limit=100&page=0`
				let response = await fetch(url)
				let details  = await response.json()
				details.forEach(streamer => {
					console.log(streamer)
					addStreamerElement(
						streamer.token,
						`https://mixer.com/${streamer.token}`,
						streamer.user.avatarUrl,
						streamer.name,
						streamer.viewersCurrent
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

// function listElementsExist() {
// 	return !!([...document.querySelector('.side-nav-header').nextSibling.childNodes])
// }

// function getElements(cb) {
// 	const interval = setInterval(() => {
// 		if (listElementsExist()) {
// 			clearInterval(interval)
// 			cb([...document.querySelector('.side-nav-header').nextSibling.childNodes])
// 		}
// 	}, 1000)
// }

// getElements((els) => {
// 	console.log(els)
// 	const out = els.map((el) => {
// 		const [channelName, game, viewerCount] = el.innerText.split('\n\n')
// 		return {channelName, game, viewerCount}
// 	})
// 	console.log(out)
// })

function streamerTemplate(channelName, href, src, game, viewerCount){
	let isMixer = true

	const template = `<div class="tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done" style="transition-property: transform, opacity; transition-timing-function: ease;">
    <div>
        <div class="side-nav-card tw-align-items-center tw-flex tw-relative" style="background-color: #212c3d"><a ${openNewTab} class="side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05" data-a-id="followed-channel-0" data-a-target="followed-channel" href="${href}">
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
                        <div style="background-color: ${ isMixer ? '#1fbaed' : '#1fbaed' }" class="twixer-status-indicator"></div>
                        <div class="tw-mg-l-05"><span class="tw-c-text-alt tw-font-size-6">${viewerCount}</span></div>
                    </div>
                    <div class="favorite-checkbox">
                    	<input class="star" type="checkbox" title="Favorite"/>
					</div>
                </div>
            </div>
        </a></div>
    </div>
</div>`
return template
}

// let openNewTab = 'rel="noopener noreferrer" target="_blank"'
let openNewTab = ''
function addStreamerElement (channelName, href, src, game, viewerCount) {
	let followedStreamerTemplate = htmlToElement(streamerTemplate(channelName, href, src, game, viewerCount))

	if (window.location.hostname === "mixer.com"){
		let twitchFollowedChannels = document.querySelector('#live-channels')
		twitchFollowedChannels.appendChild(followedStreamerTemplate)
	} else if (window.location.hostname === "www.twitch.tv"){
		let twitchFollowedChannels = document.querySelector('[data-a-target="side-nav-header-expanded"] + div.tw-relative.tw-transition-group')
		twitchFollowedChannels.appendChild(followedStreamerTemplate)
	}
}

function userFollows () {
	document.body.onload = function () {
		chrome.storage.sync.get("data", function (items) {
			if (!chrome.runtime.error) {
				console.log(items)
				document.getElementById("data").innerText = items.data
			}
		})
	}
}

document.body.onload = function() {
	chrome.storage.sync.get(['mixer','twitch'], function(details) {
		if (!chrome.runtime.error) {
			if (window.location.hostname === "mixer.com"){
				mountMixerSidebar()
			}

			mixerStreams(details.mixer.userId)
		}
	})
}

console.log(window.location.hostname)



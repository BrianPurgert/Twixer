function liveChannelsContainer(){
	return document.body.querySelector('#live-channels')
}

function liveChannels(){
	return document.body.querySelector('[data-a-target="side-nav-header-expanded"] + div.tw-relative.tw-transition-group > div:not(.streamer-card), #live-channels > div')
}

function element (html) {
	let template = document.createElement('template')
	template.innerHTML = html.trim()
	return template.content.firstChild
}

function mountMixerSidebar() {
	let header = `<div class="side-nav-header-mixer">
    <h5 class="tw-font-size-6 tw-semibold tw-upcase">Followed Channels</h5>
    <button id="toggle-sidebar">
      <svg class="collapse-icon" width="100%" height="100%" viewBox="0 0 20 20" x="0px" y="0px">
        <g><path d="M16 16V4h2v12h-2zM6 9l2.501-2.5-1.5-1.5-5 5 5 5 1.5-1.5-2.5-2.5h8V9H6z"></path></g>
      </svg>
    </button>
  </div>`
	let mixerSidebar = element(`<div id="mixer-side-nav" class="">${header}<div id="live-channels"></div></div>`)
	let mixerSidebarParent = document.querySelector('b-app .content')
	mixerSidebarParent.appendChild(mixerSidebar)

	let toggleButton = document.getElementById("toggle-sidebar")
	let content = document.querySelector("[_ngcontent-c0] + .content")
	toggleButton.addEventListener('click', function() {
		document.querySelector("#mixer-side-nav").classList.toggle("collapsed")
		content.classList.toggle("mixer-collapsed")
	})

}

function mountTwitchSidebar() {
	let header = `<div data-a-target="side-nav-header-expanded" class="side-nav-header tw-mg-1 tw-pd-t-05"><h5 class="tw-font-size-6 tw-semibold tw-upcase">Followed Channels</h5></div>`
	let twitchSidebar = element(`<div id="twitch-side-nav" class="side-nav-section">${header}<div id="live-channels"></div></div>`)
	let twitchSidebarOld = document.querySelector('.side-bar-contents .side-nav-section:not(.recommended-channels):not(.online-friends)')
	twitchSidebarOld.replaceWith(twitchSidebar)
}

function streamer(name, link, logo, game, viewers, isMixer, thumbnail, streamTitle, gameCover){
	return {
		name, link, logo, game, viewers, isMixer, favorite: false, thumbnail, streamTitle, gameCover
	}
}

async function twitchStreams (accessToken) {
	if (accessToken === '❌'){
		return []
	}
	let init = {
		headers: {
			'Client-ID': 'yr67fty5tcazl2ew3jda8sw17cy87d',
			'authorization': `OAuth ${accessToken}`,
			'Accept': 'application/vnd.twitchtv.v5+json'
		},
	}
	let streamsUrl    = `https://api.twitch.tv/kraken/streams/followed?limit=100&offset=0`
	let response = await fetch(streamsUrl,init)
	let streams  = await response.json()

	let twitchStreamers = streams.streams.map(twStreamer => {
		return streamer(
			twStreamer.channel.display_name,
			`https://www.twitch.tv/${twStreamer.channel.name}`,
			twStreamer.channel.logo,
			twStreamer.game,
			twStreamer.viewers,
			false,
			`https://static-cdn.jtvnw.net/previews-ttv/live_user_${twStreamer.channel.name}-1920x1080.jpg`,
			twStreamer.channel.status,
			`https://static-cdn.jtvnw.net/ttv-boxart/${twStreamer.game}-85x113.jpg`
		)
	})
	return twitchStreamers
}

async function mixerStreams (userId) {
	{  return []  }

	let url      = `https://mixer.com/api/v1/users/${userId}/follows?where=online:eq:true&order=viewersCurrent:desc&limit=100&page=0`
	let response = await fetch(url)
	let details  = await response.json()


	//https://videocdn.mixer.com/hls/22219478-216f80c8139b96f986fcc4eaf3ceed28_source/1773376470.ts
	let mixerStreamers = details.map(mxStreamer => {
		return streamer(
			mxStreamer.token,
			`https://mixer.com/${mxStreamer.token}`,
			mxStreamer.user.avatarUrl,
			mxStreamer.type.name,
			mxStreamer.viewersCurrent,
			true,
			`https://thumbs.mixer.com/channel/${mxStreamer.id}.small.jpg`,
			mxStreamer.name,
			mxStreamer.coverUrl
		)
	})

	return mixerStreamers
}

function streamerTemplate(channelName, href, src, game, viewerCount, isMixer, favorite){
let openNewTab = false

	return `
<div id="${isMixer? 'mixer' : 'twitch'}-${channelName}" class="streamer-card">
        <div class="side-nav-card tw-align-items-center tw-flex tw-relative">
        <a ${openNewTab? 'rel="noopener noreferrer" target="_blank"' : ''} class="side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05" data-a-id="followed-channel-0" data-a-target="followed-channel" href="${href}">
            <div class="side-nav-card__avatar tw-align-items-center tw-flex-shrink-0">
                <figure aria-label="${channelName}" class="tw-avatar tw-avatar--size-30"><img class="tw-block tw-image tw-image-avatar twixer-avatar" alt="${channelName}" src="${src}"></figure>
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
                    	<input id="${channelName}" ${favorite? 'checked' : ''} class="star" type="checkbox" title="Favorite"/>
					</div>
                </div>
            </div>
        </a></div>
</div>`
}

function favoriteToggle(name) {
	chrome.storage.sync.get(['favorites'], function(data) {
			let fav = new Set(data.favorites)
			fav.has(name) ? 	fav.delete(name) : fav.add(name)
			chrome.storage.sync.set({"favorites": [...fav]})
	})
}

function kFormatter(num) {
	return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : Math.sign(num)*Math.abs(num)
}

function addStreamerElement (name, link, logo, game, viewers, isMixer, favorite = false) {
	let followedStreamerTemplate = element(
		streamerTemplate(
			name,
			link,
			logo,
			game,
			kFormatter(viewers),
			isMixer,
			favorite
		)
	)
		liveChannelsContainer().appendChild(followedStreamerTemplate)
}

function streamerHover(id){
	// let siteName = id.split('-',1)
	// let site = siteName[0]
	// let name = siteName[1]
	// console.log(site)
	// console.log(name)
	ap('site name')
	console.log(id)
	// document.querySelector(".video-player-hosting-ui__container")
}

function streamerHoverListeners(){
	ap('streamerHoverListeners')
	liveChannelsContainer().addEventListener("mouseover", function (event) {
		// console.log(event.target)
		if (event.target && event.target.matches(".side-nav-card")){
			streamerHover(event.target)
		}
	}, false)
}

function favoriteListeners(mxToken,twToken) {
	liveChannelsContainer().addEventListener("click", function (event) {
		if (event.target && event.target.matches("input.star")) {
			favoriteToggle(event.target.id)
			updateStreams(mxToken,twToken)
		}
	})
}

function compare(a, b) {
	if (a.favorite && !b.favorite){     return -1	}
	if (!a.favorite && b.favorite){     return 1	}
	if (a.viewers > b.viewers) {    return -1	}
	if (a.viewers < b.viewers) {	return 1	}
	return 0
}

function ap (message){
	console.log('%c '+ message, 'background: rgb(19, 49, 72); color: white; display: block; line-height: 25px;text-align: center;')
}

function removeDefault(){
	while(document.body.contains(liveChannels())){
		liveChannels().remove()
	}
}

function sortAdd(streams, favorites) {
	streams = streams.map(streamer => {
		if (favorites.includes(streamer.name)) {
			streamer.favorite = true
		}
		return streamer
	})

	streams.sort(compare)
	removeDefault()

	let cards = document.body.querySelectorAll(".streamer-card")
		cards.forEach(card => {
			card.remove()
		})

	streams.forEach((streamer, index) => {
		addStreamerElement(
			streamer.name,
			streamer.link,
			streamer.logo,
			streamer.game,
			streamer.viewers,
			streamer.isMixer,
			streamer.favorite
		)
	})
}

async function updateStreams(mxToken, twToken) {
	let results = await Promise.all([
		mixerStreams(mxToken),
		twitchStreams(twToken),
	])

let streams = [...results[0], ...results[1]]

	chrome.storage.sync.get('favorites', function (details) {
			if (typeof details.favorites !== 'undefined') {
				sortAdd(streams, details.favorites)
			} else {
				chrome.storage.sync.set({'favorites': []})
				sortAdd(streams, [])
			}

	})
}

function checkUsers(details){
	if(typeof details.twitch === 'undefined'){
		removeDefault()
		let info = element('<div class="twixer-info"><h5>Fill out Twitch information by clicking on the Twixer extension icon</h5></div>')
		liveChannelsContainer().appendChild(info)
		return false
	}
	return true
}

document.body.onload = function() {
	chrome.storage.sync.get(['mixer','twitch'], function(details) {

			if (window.location.hostname === "mixer.com"){
				mountMixerSidebar()
			}
			if (window.location.hostname === "www.twitch.tv"){
				mountTwitchSidebar()
			}

			if (checkUsers(details)){
				let mxToken = '❌'
				let twToken = '❌'
				if (typeof details.mixer !== 'undefined'){
					mxToken = details.mixer.userId
				}
				if (typeof details.twitch !== 'undefined'){
					twToken = details.twitch.access_token
				}

				favoriteListeners(mxToken,twToken)
				streamerHoverListeners()
				updateStreams(mxToken,twToken)
				let intervalID = setInterval(updateStreams, 120000,mxToken, twToken)
			}

	})
}



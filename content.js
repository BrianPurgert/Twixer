import App from './App.vue'

const sidebar = '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > div.side-nav.tw-c-background-alt.tw-flex-shrink-0.tw-full-height > div > div.side-nav__overlay-wrapper.tw-flex.tw-full-height.tw-overflow-hidden.tw-relative > div > div.simplebar-scroll-content > div > div > div:nth-child(2) > div.tw-flex-grow-1 > div:nth-child(1) > div.tw-relative.tw-transition-group'
const username = '[data-a-target="user-display-name"]'
let mixerSidebarParent = document.querySelector('b-channel-page-wrapper > b-channel-web-page')


function htmlToElement (html) {
	let template = document.createElement('template')
	html = html.trim()
	template.innerHTML = html
	return template.content.firstChild
}


async function channelDetails (name) {
	const url = `https://mixer.com/api/v1/channels/${name}`
	const response = await fetch(url)
	const details = await response.json()
	if (details.online) {
		addStreamerElement(details.token, `https://mixer.com/${details.token}`, details.user.avatarUrl, details.name, details.viewersCurrent)
	}
}

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

getElements((els) => {
	console.log(els) // here do the map thing from above
	const out = els.map((el) => {
		const [channelName, game, viewerCount] = el.innerText.split('\n\n')
		return {channelName, game, viewerCount}
	})
	console.log(out)
})

function addStreamerElement (channelName, href, src, game, viewerCount) {
	let followedStreamerTemplate = htmlToElement(`<div class="tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done" style="transition-property: transform, opacity; transition-timing-function: ease;"><div><div class="side-nav-card tw-align-items-center tw-flex tw-relative" style="background-color: #212c3d" ><a rel="noopener noreferrer" target="_blank" class="side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05" data-a-id="followed-channel-0" data-a-target="followed-channel" href="${href}"><div class="side-nav-card__avatar tw-align-items-center tw-flex-shrink-0"><figure aria-label="${channelName}" class="tw-avatar tw-avatar--size-30"><img class="tw-block tw-border-radius-rounded tw-image tw-image-avatar" alt="${channelName}" src="${src}"></figure></div><div class="tw-ellipsis tw-flex tw-full-width tw-justify-content-between"><div data-a-target="side-nav-card-metadata" class="tw-ellipsis tw-full-width tw-mg-l-1"><div class="side-nav-card__title tw-align-items-center tw-flex"><p class="tw-c-text-alt tw-ellipsis tw-ellipsis tw-flex-grow-1 tw-font-size-5 tw-line-height-heading tw-semibold" data-a-target="side-nav-title" title="${channelName}">${channelName}</p></div><div data-a-target="side-nav-game-title" class="side-nav-card__metadata tw-pd-r-05"><p class="tw-c-text-alt-2 tw-ellipsis tw-font-size-6 tw-line-height-heading" title="${game}">${game}</p></div></div><div data-a-target="side-nav-live-status" class="side-nav-card__live-status tw-flex-shrink-0 tw-mg-l-05"><div class="tw-align-items-center tw-flex"><div style="background-color: #1fbaed" class="tw-border-radius-rounded tw-channel-status-indicator tw-channel-status-indicator--live tw-channel-status-indicator--small tw-inline-block tw-relative"></div><div class="tw-mg-l-05"><span class="tw-c-text-alt tw-font-size-6">${viewerCount}</span></div></div></div></div></a></div></div></div>`)
	let followedChannels = document.querySelector(sidebar)
	followedChannels.appendChild(followedStreamerTemplate)
}



// chrome.storage.sync.set({ mytext:  });
// chrome.storage.sync.get('mytext', function(data) {
// 	yourTextArea.value = data.mytext;
// });


channelDetails ('ninja')
channelDetails('NepentheZ')
channelDetails('shroud')

addMixerSidebar()


//On Mixer
function addMixerSidebar() {
	let mixerSidebar = htmlToElement(`<aside class="" style="width: 240px;position: absolute;top: 60px;left: 0;bottom: 0;background: #3d2121;"></aside>`)

}
// Insert sidebar as first child of document.querySelector('b-channel-web-page')
// add the style margin-left: 240px; to document.querySelector('.channel-page')

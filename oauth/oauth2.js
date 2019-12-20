(function() {
    window.oauth2 = {
        access_token_url: "https://id.twitch.tv/oauth2/token",
        authorization_url: "https://id.twitch.tv/oauth2/authorize",
        client_id: "yr67fty5tcazl2ew3jda8sw17cy87d",
        client_secret: "1pvfofspvt2bjujcjc3tn0ozcv05tg",
        redirect_url: chrome.identity.getRedirectURL(),
        scopes: ["user_read"],
        key: "oauth2_token",



        start: function() {

            let url = this.authorization_url    +
                      "?client_id="     + this.client_id        +
                      "&redirect_uri="  + this.redirect_url     +
                      "&response_type=token"                    +
                      "&scope="         + this.scopes.join('+') +
                      "&force_verify=true"

            chrome.identity.launchWebAuthFlow({'url': url, 'interactive': true},

                function(redirect_url) {
                    console.log(redirect_url)
                    let accessToken = redirect_url.split('&')[0].split('=')[1]
                    console.log(accessToken)
                    chrome.storage.sync.set({
                        "twitch": {
                            "access_token": accessToken,
                            "redirect_url": redirect_url
                        }
                    })
                })

        },
    }
})()


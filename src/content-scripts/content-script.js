chrome.runtime.onMessage.addListener(async function(
    request,
    sender,
    sendResponse
) {
    if (request.contentScriptQuery == 'readCookie') {
        var cookie = getCookie('gqauth');
        if (navigator.userAgent.indexOf('Chrome') != -1) {
            return sendResponse(cookie);
        }
        return cookie;
    }

    if (request.contentScriptQuery == 'setItem') {
        return await asyncSessionStorage
            .setItem(
                'b_and_p_buy_' + request.country,
                JSON.stringify(request.order)
            )
            .then(function() {
                browser.tabs
                    .query({ currentWindow: true })
                    .then(async (tabs) => {
                        browser.tabs.update(tabs[0].id, {
                            url: `https://www.lego.com/${localeCountryLanguage.toLowerCase()}/service/replacementparts/sale`,
                        });
                    }).catch((error) => console.log(error));

                return true;
            });
    }

    if (request.contentScriptQuery == 'removeItem') {
        return await asyncSessionStorage
            .removeItem('b_and_p_buy_' + request.country)
            .then(function() {

                return true;
            }).catch((error) => console.log(error));
    }
});

function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

const asyncSessionStorage = {
    setItem: async function(key, value) {
        await null;
        return sessionStorage.setItem(key, value);
    },
    getItem: async function(key) {
        await null;
        return sessionStorage.getItem(key);
    },
    removeItem: async function(key) {
        await null;
        return sessionStorage.removeItem(key);
    },
};
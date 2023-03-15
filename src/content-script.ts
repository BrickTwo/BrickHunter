console.log("bbbbbbbb")

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       console.log(sender.tab ?
//                   "from a content script:" + sender.tab.url :
//                   "from the extension", navigator.userAgent);
//       if (request.greeting === "hello")
//         sendResponse({farewell: "goodbye"});
//     }
//   );


chrome.runtime.onMessage.addListener(function(
    request,
    sender,
    sendResponse
) {
    console.log('contentscript', request)
    if (request.contentScriptQuery == 'loaded') {
        return true;
    }
    if (request.contentScriptQuery == 'readCookieGQAuth') {
        var cookie = getCookie('gqauth');
        console.log("cookie", cookie, navigator.userAgent.indexOf('Chrome'))
        if (navigator.userAgent.indexOf('Chrome') != -1) {
            return sendResponse(cookie);
        }
        return cookie;
    }

    // if (request.contentScriptQuery == 'readCookieSessionCookieId') {
    //     var cookie = getCookie('session_cookie_id');
    //     if (navigator.userAgent.indexOf('Chrome') != -1) {
    //         return sendResponse(cookie);
    //     }
    //     return cookie;
    // }
});

function getCookie(cname: string) {
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
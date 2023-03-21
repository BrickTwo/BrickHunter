import { PickABrick } from "./app/background/functions/pickabrick";

chrome.action.onClicked.addListener((tab: any) => {
  chrome.tabs.create({
    //url: '/partslists',
    url: 'index.html',
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.indexOf('https://www.lego.com') >= 0) {
    if (changeInfo.status == 'complete') {
      console.log("complete");
      (async () => {
        chrome.tabs.sendMessage(tabId, { contentScriptQuery: "loaded" }).
          then((resp) => { console.log("loaded", resp) })
          .catch((error) => {
            console.log("install script");
            chrome.scripting.executeScript({
              target: { tabId: tabId, allFrames: true },
              files: ['contentscript.js'],
            });
          });
      })();



      // chrome.tabs
      //   .sendMessage(tabId, {
      //     contentScriptQuery: 'loaded',
      //   })
      //   .then((resp) => { console.log("loaded", resp) })
      //   .catch((error) => {
      //     chrome.scripting.executeScript({
      //       target: { tabId: tabId, allFrames: true },
      //       files: ['contentscript.js'],
      //     });
      //   });
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background')
  switch (request.action) {
    case 'findBrick':
      PickABrick.finBrick(request.elementIds, localeCountryLanguage).then(resp => sendResponse(resp));
      return true;
    case 'addElementToCart':
      PickABrick.addElementToCart(request.authorization, request.items, request.cartType, localeCountryLanguage).then(resp => sendResponse(resp));
      return true;
    case 'readCart':
      PickABrick.readCart(request.authorization, localeCountryLanguage).then(resp => sendResponse(resp));;
      return true;
    case 'readQAuth':
      PickABrick.readQAuth().then(resp => sendResponse(resp));;
      return true;
  }

  return false;
});


const localeCountryLanguage = "de-DE";
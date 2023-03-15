import { PickABrick } from "./app/shared/functions/pickabrick";

chrome.action.onClicked.addListener((tab: any) => {
  chrome.tabs.create({
    //url: '/partslists',
    url: 'index.html',
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.indexOf('https://www.lego.com') >= 0) {
    if (changeInfo.status == 'complete') {
      chrome.tabs
        .sendMessage(tabId, {
          contentScriptQuery: 'loaded',
        })
        .then(() => { })
        .catch((error) => {
          chrome.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            files: ['contentscript.js'],
          });
        });
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background')
  switch (request.action) {
    case 'findBrick':
      PickABrick.finBrick(request.designIds, localeCountryLanguage).then(resp => sendResponse(resp));
      return true;
    case 'addElementToCart':
      PickABrick.addElementToCart(request.authorization, request.items, request.cartType, localeCountryLanguage).then(resp => sendResponse(resp));
      return true;
    case 'readQAuth':
      console.log('readQAuth')
      PickABrick.readQAuth().then(resp => sendResponse(resp));;
      return true;
  }

  return false;
});


const localeCountryLanguage = "de-DE";
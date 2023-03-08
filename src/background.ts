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
        .then(() => {})
        .catch((error) => {
          console.log('add content-script');
          chrome.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            files: ['contentscript.js'],
          });
        });
    }
  }
});

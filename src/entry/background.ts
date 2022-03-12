//import { set, get } from 'idb-keyval'

// const timeout = setTimeout(() => undefined, 5000);
/*if (typeof browse === "undefined") {
  browser = chrome;
}*/

chrome.action.onClicked.addListener((tab: any) => {
  // if (tab.id) {
  //     chrome.tabs.sendMessage(tab.id, { toggleVisible: true });
  // }
  console.log("blub");
  chrome.tabs.create({
    url: "options.html#/partslists",
  });
});

// browser.runtime.onMessage.addListener(async function (request) {

//     if (request.function === "start") {
//         var startTime = Date.now();
//         var currentTime = Date.now();
//         var lastPing = Date.now();
//         var i = 0;
//         console.log("bg:", "start", startTime);

//         do {
//             currentTime = Date.now();
//             if ((currentTime - lastPing) > 1000) {
//                 console.log("bg:", "ping", i++, currentTime);
//                 browser.runtime.sendMessage({ function: "ping", iteration: i, time: currentTime });
//                 lastPing = Date.now();
//             }
//         } while ((currentTime - startTime) < 10 * 60 * 1000)

//         console.log("bg:", "end",);
//         return "sendMessage successfull!!";
//     } else if (request.function === "findBrick") {

//         /*let stateFromIndexedDB: string = await get("PART_STORE");
//             if (stateFromIndexedDB) {
//                 let state = {};
//                 Object.assign(state, JSON.parse(stateFromIndexedDB))
//                 console.log(state);
//             }*/

//         var response = await findBrick(3004);
//         console.log(response);
//         return response;
//     }
// });

// async function findBrick(designId: number) {
//     var url = `https://bricksandpieces.services.lego.com/api/v1/bricks/items/${encodeURIComponent(
//         designId
//     )}?country=DE&orderType=buy`;

//     var response: any = await fetch(url, {
//         method: 'GET',
//         mode: 'cors',
//         cache: 'no-cache',
//         credentials: 'same-origin',
//         headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': 'saVSCq0hpuxYV48mrXMGfdKnMY1oUs3s',
//         },
//     })
//         .then((response) => {
//             clearTimeout(timeout);

//             if (response.status < 200 || response.status >= 300)
//                 return {
//                     status: response.status,
//                     message: response.json(),
//                 };

//             if (response.status == 204)
//                 return {
//                     status: response.status,
//                     message: '',
//                 };

//             return response.json();
//         })
//         .catch((err) => {
//             return {
//                 status: response.error,
//                 message: '',
//             };
//         });

//     return response;
// }

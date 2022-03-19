//import { set, get } from 'idb-keyval'

import { LegoApi } from "@/service/api/lego";
import { GetPaBFindPartsRequest } from "@/types/api-types";
import { BackgroundRequest, BackgroundRequestAction } from "@/types/types";
import browser from "webextension-polyfill";

// const timeout = setTimeout(() => undefined, 5000);
/*if (typeof browse === "undefined") {
  browser = chrome;
}*/

browser.action.onClicked.addListener((tab: any) => {
  // if (tab.id) {
  //     chrome.tabs.sendMessage(tab.id, { toggleVisible: true });
  // }
  browser.tabs.create({
    url: "index.html#/partslists",
  });
});

browser.runtime.onMessage.addListener(async (request: BackgroundRequest) => {
  console.log("background", request);
  switch (request.action) {
    case BackgroundRequestAction.FindPaBPart: {
      const response = await LegoApi.getPaBParts(
        request.request as GetPaBFindPartsRequest
      );

      console.log("bg response", response);

      return response;
    }
  }
});

//import { set, get } from 'idb-keyval'

import { LegoApi } from "@/service/api/lego";
import {
  AddToElementCartRequest,
  ElementCartQueryRequest,
  PickABrickQueryRequest,
  RemoveAllElementsFromCartRequest,
} from "@/types/api-types";
import {
  BackgroundRequest,
  BackgroundRequestAction,
  BackgroundResponse,
  BackgroundResponseAction,
  BackgroundTabIdRequest,
} from "@/types/types";
import { ConsoleSqlOutlined } from "@vicons/antd";
import browser from "webextension-polyfill";
import { sleep } from "@/utilities/general/sleep";

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
      const response = await LegoApi.pickABrickQuery(
        request.request as PickABrickQueryRequest
      );

      console.log("bg response", response);

      return response;
    }
    case BackgroundRequestAction.GetLegoTabId: {
      return await getLegoTab(
        (request.request as BackgroundTabIdRequest).location
      );
    }
    case BackgroundRequestAction.GoToPaB: {
      return await goToPaB(
        (request.request as BackgroundTabIdRequest).location
      );
    }
    case BackgroundRequestAction.GetAuthorization: {
      return await getAuthorization();
    }
    case BackgroundRequestAction.GetCart: {
      const response = await LegoApi.elementCartQuery(
        request.request as ElementCartQueryRequest
      );

      console.log("bg response", response);

      return response;
    }
    case BackgroundRequestAction.AddToCart: {
      const response = await LegoApi.addToElementCart(
        request.request as AddToElementCartRequest
      );

      console.log("bg response", response);

      return response;
    }
    case BackgroundRequestAction.ClearCart: {
      const response = await LegoApi.removeAllElementsFromCart(
        request.request as RemoveAllElementsFromCartRequest
      );

      console.log("bg response", response);

      return response;
    }
  }
});

async function getAuthorization() {
  const gqauthCookie = await browser.cookies.get({
    url: "https://www.lego.com",
    name: "gqauth",
  });
  if (gqauthCookie) {
    return gqauthCookie.value;
  } else {
    return false;
  }
}

let legoTabId: number | undefined = 0;

async function getLegoTab(location: string): Promise<boolean> {
  const tabs = await browser.tabs
    .query({
      url: "*://*.lego.com/*",
    })
    .catch((error) => console.log(error));

  if (!tabs || tabs.length === 0) {
    console.log("tabs", "not open");
    const legoTab = await browser.tabs.create({
      url: `https://www.lego.com/${location}`,
      active: false,
    });

    legoTabId = legoTab.id;

    browser.tabs.onUpdated.addListener(handleUpdated);
    return true;
  }

  if (tabs[0].status !== "complete") {
    browser.tabs.onUpdated.addListener(handleUpdated);
    return true;
  }

  const response: BackgroundResponse = {
    action: BackgroundResponseAction.Lego,
    response: tabs[0].id,
  };

  browser.runtime.sendMessage(response);
  return true;
}

async function goToPaB(location: string): Promise<boolean> {
  const tabs = await browser.tabs
    .query({
      url: "*://*.lego.com/*",
    })
    .catch((error) => console.log(error));

  if (!tabs || tabs.length === 0) {
    console.log("tabs", "not open");
    const legoTab = await browser.tabs.create({
      url: `https://www.lego.com/${location}/page/static/pick-a-brick`,
      active: false,
    });

    legoTabId = legoTab.id;
    return true;
  }

  browser.tabs
    .update(tabs[0].id, {
      url: `https://www.lego.com/${location}/page/static/pick-a-brick`,
      active: true,
    })
    .catch((error) => console.log(error));

  return true;
}

function handleUpdated(tabId: any, changeInfo: any, tabInfo: any) {
  if (legoTabId === tabId && changeInfo.status === "complete") {
    console.log("lego side completed", tabId, changeInfo, tabInfo);
    getAuthorization();
    browser.tabs.onUpdated.removeListener(handleUpdated);

    const response: BackgroundResponse = {
      action: BackgroundResponseAction.Lego,
      response: tabId,
    };

    browser.runtime.sendMessage(response);
  }
}

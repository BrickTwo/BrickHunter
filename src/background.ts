import { PickABrick } from './app/background/functions/pickabrick';
import {
  BackgroudnRequest,
  BackgroundRequestAction,
  IBackgroundAddElementRequest,
  IBackgroundFindBricksRequest,
  IBackgroundOpenBrickABrickRequest,
  IBackgroundReadQauthRequest,
  IBackgroundRequest,
} from './app/models/background-message';

chrome.action.onClicked.addListener((tab: any) => {
  chrome.tabs.create({
    //url: '/partslists',
    url: 'index.html',
  });
});

chrome.runtime.onMessage.addListener((request: BackgroudnRequest, sender, sendResponse) => {
  // console.log('background', request.action);
  switch (request.action) {
    case BackgroundRequestAction.FindBricks:
      const findBricksRequest = request as IBackgroundFindBricksRequest;
      PickABrick.finBricks(findBricksRequest.elementIds, localeCountryLanguage).then(resp => sendResponse(resp));
      return true;
    case BackgroundRequestAction.AddElementToCart:
      const addElementRequest = request as IBackgroundAddElementRequest;
      PickABrick.addElementToCart(
        addElementRequest.authorization,
        addElementRequest.items,
        addElementRequest.cartType,
        localeCountryLanguage
      ).then(resp => sendResponse(resp));
      return true;
    // case 'readCart':
    //   PickABrick.readCart(request.authorization, localeCountryLanguage).then(resp => sendResponse(resp));
    //   return true;
    case BackgroundRequestAction.ReadLegoQAuth:
      const readQauthRequest = request as IBackgroundReadQauthRequest;
      PickABrick.readQAuth(readQauthRequest.tabId).then(resp => sendResponse(resp));
      return true;
    case BackgroundRequestAction.GetLegoTabId:
      PickABrick.getLegoTab().then(resp => sendResponse(resp));
      return true;
    case BackgroundRequestAction.OpenPickABrick:
      const openBrickABrickRequest = request as IBackgroundOpenBrickABrickRequest;
      PickABrick.openPickABrick(openBrickABrickRequest.tabId, openBrickABrickRequest.affiliate, localeCountryLanguage);
      return true;
  }

  return false;
});

const localeCountryLanguage = 'de-DE';
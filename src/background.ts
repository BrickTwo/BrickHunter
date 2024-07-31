import { PickABrick } from './app/background/functions/pickabrick';
import {
  BackgroudnRequest,
  BackgroundRequestAction,
  BackgroundAddElementRequest,
  BackgroundChangeElementRequest,
  BackgroundFindBricksRequest,
  BackgroundOpenBrickABrickRequest,
  BackgroundReadCartRequest,
  BackgroundReadQauthRequest,
  BackgroundRequest,
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
      const findBricksRequest = request as BackgroundFindBricksRequest;
      PickABrick.findBricks(findBricksRequest.elementIds, findBricksRequest.locale).then(resp => sendResponse(resp));
      return true;
    case BackgroundRequestAction.AddElementToCart:
      const addElementRequest = request as BackgroundAddElementRequest;
      PickABrick.addElementToCart(
        addElementRequest.authorization,
        addElementRequest.items,
        addElementRequest.cartType,
        addElementRequest.locale
      ).then(resp => sendResponse(resp));
      return true;
    case BackgroundRequestAction.ChangeElementInCart:
      const changeElementRequest = request as BackgroundChangeElementRequest;
      PickABrick.changeElementInCart(
        changeElementRequest.authorization,
        changeElementRequest.items,
        changeElementRequest.cartType,
        changeElementRequest.locale
      ).then(resp => sendResponse(resp));
      return true;
    case BackgroundRequestAction.ReadCart:
      const readCartRequest = request as BackgroundReadCartRequest;
      PickABrick.readCart(readCartRequest.authorization, readCartRequest.locale, readCartRequest.deliveryChannels).then(
        resp => sendResponse(resp)
      );
      return true;
    case BackgroundRequestAction.ReadLegoQAuth:
      const readQauthRequest = request as BackgroundReadQauthRequest;
      PickABrick.readQAuth(readQauthRequest.tabId).then(resp => sendResponse(resp));
      return true;
    case BackgroundRequestAction.GetLegoTabId:
      PickABrick.getLegoTab().then(resp => sendResponse(resp));
      return true;
    case BackgroundRequestAction.OpenPickABrick:
      const openBrickABrickRequest = request as BackgroundOpenBrickABrickRequest;
      PickABrick.openPickABrick(
        openBrickABrickRequest.tabId,
        openBrickABrickRequest.affiliate,
        openBrickABrickRequest.locale
      );
      return true;
  }

  return false;
});

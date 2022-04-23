import {
  AddToElementCartRequest,
  ElementCartQueryRequest,
  PickABrickQueryRequest,
  RemoveAllElementsFromCartRequest,
} from "./api-types";
import {
  ICartPositionStore,
  IPartsListPositionStore,
  IPartStore,
} from "./store-types";

export interface IColor {
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
  external_ids: {
    LDraw?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
    BrickOwl?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
    LEGO?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
    Peeron?: {
      ext_ids: Array<number | null>;
      ext_descrs: Array<Array<string>>;
    };
    BrickLink?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
  };
}

export interface IPartsList {
  id: string;
  name: string;
  parts: IPart[];
}

export interface IPart extends Object {
  source: IPartsListPositionStore;
  detail: IPartStore;
  cart?: ICartPositionStore;
  color: IColor;
}

export interface BackgroundRequest {
  action: BackgroundRequestAction;
  request:
    | PickABrickQueryRequest
    | ElementCartQueryRequest
    | RemoveAllElementsFromCartRequest
    | AddToElementCartRequest
    | BackgroundTabIdRequest
    | undefined;
}

export enum BackgroundRequestAction {
  FindPaBPart = 1,
  GetLegoTabId = 2,
  GetAuthorization = 3,
  GetCart = 4,
  ClearCart = 5,
  AddToCart = 6,
  GoToPaB = 7,
}

export interface BackgroundResponse {
  action: BackgroundResponseAction;
  response: unknown;
}

export enum BackgroundResponseAction {
  Lego = 1,
}

export interface ICountry {
  value: string;
  label: string | undefined;
  languages: Array<ILanguage | undefined>;
  currency: string;
}

export interface ILanguage {
  value: string;
  label: string | undefined;
}

export interface BackgroundTabIdRequest {
  location: string;
}

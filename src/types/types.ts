import { GetPaBFindPartsRequest } from "./api-types";
import { PartsListPartStore, PartStore } from "./store-types";

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
  source: PartsListPartStore;
  detail: PartStore;
  color: IColor;
}

export interface BackgroundRequest {
  action: BackgroundRequestAction;
  request: GetPaBFindPartsRequest;
}

export enum BackgroundRequestAction {
  FindPaBPart = 1,
}

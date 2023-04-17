export interface Color {
  id: number;
  name: string;
  rgb: string;
  isTrans: boolean;
  categories: string[];
  externalIds: {
    lDraw?: {
      extIds: number[];
      extDescrs: string[];
    };
    brickOwl?: {
      extIds: number[];
      extDescrs: string[];
    };
    lego?: {
      extIds: number[];
      extDescrs: string[];
    };
    brickLink?: {
      extIds: number[];
      extDescrs: string[];
    };
  };
}

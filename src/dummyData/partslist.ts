export interface IPartsListPosition {
  source: string;
  designId: string;
  itemNumber?: number;
  searchids?: string[] | null;
  color: {
    id: number;
    brickLinkId: number;
    brickLinkName: string;
    legoId: number;
    legoName: string;
    bricksAndPiecesName: string;
    pickABrickName: string;
    colorCode: string;
  };
  qty: {
    min: number;
    have: number;
    balance: number;
    order: number;
  };
  image: {
    source: string;
    rsc: string;
  };
  bricksAndPieces: unknown;
  pickABrick: unknown;
  brickLink: unknown;
  rowNumber: string;
  selected: boolean;
  isSpecial: boolean;
}

// tslint:disable-next-line
export interface IPartsListPositions {
  positions: Array<IPartsListPosition>;
}

export const partsListPositions: IPartsListPositions = {
  positions: [
    {
      source: "brickLink",
      designId: "10202",
      searchids: ["10202", ""],
      color: {
        id: 12,
        brickLinkId: 11,
        brickLinkName: "Black",
        legoId: 26,
        legoName: "Black",
        bricksAndPiecesName: "Black",
        pickABrickName: "Black",
        colorCode: "#1B2A34",
      },
      qty: {
        min: 1,
        have: 0,
        balance: 1,
        order: 0,
      },
      bricksAndPieces: {
        color: "Black",
        colorFamily: "Black",
        description: "FLAT TILE 6X6",
        designId: 10202,
        isIPElement: false,
        imageUrl:
          "https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/6155125.jpg",
        itemNumber: 6155125,
        itemQuantity: 0,
        price: {
          amount: 0.62,
          currency: "EUR",
        },
        maxAmount: 200,
        isAvailable: true,
        unavailableReason: null,
        isSoldOut: false,
        category: "Plates",
        materialType: "ELEMENT",
      },
      pickABrick: null,
      brickLink: {
        wantedList: {
          itemtype: "P",
          maxprice: 1.8353,
          condition: "X",
          notify: "N",
          remarks: null,
        },
        strAltNo: "",
        mapPCCs: {
          "1": "6307467",
          "2": "6272112",
          "5": "6192007",
          "11": "6155125",
          "39": "6282864",
          "80": "6021488",
          "85": "6147337",
          "86": "6014617",
          "88": "6318734",
        },
        weight: 4,
      },
      image: {
        source: "brickLink",
        rsc: "https://img.bricklink.com/ItemImage/PN/11/10202.png",
      },
      rowNumber: "1",
      selected: false,
      isSpecial: false,
    },
    {
      source: "brickLink",
      designId: "10247",
      searchids: ["10247", ""],
      color: {
        id: 81,
        brickLinkId: 85,
        brickLinkName: "Dark Bluish Gray",
        legoId: 199,
        legoName: "Dark Stone Grey",
        bricksAndPiecesName: "Dk. St. Grey",
        pickABrickName: "Dark Stone Grey",
        colorCode: "#646464",
      },
      qty: {
        min: 4,
        have: 0,
        balance: 4,
        order: 0,
      },
      bricksAndPieces: {
        color: "Grey",
        colorFamily: "Dk. St. Grey",
        description: "PLATE 2X2 + ONE HULE Ø4,8",
        designId: 10247,
        isIPElement: false,
        imageUrl:
          "https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/6047417.jpg",
        itemNumber: 6047417,
        itemQuantity: 0,
        price: {
          amount: 0.11,
          currency: "EUR",
        },
        maxAmount: 200,
        isAvailable: true,
        unavailableReason: null,
        isSoldOut: false,
        category: "Plates, Special",
        materialType: "ELEMENT",
      },
      pickABrick: null,
      brickLink: {
        wantedList: {
          itemtype: "P",
          maxprice: 0.0422,
          condition: "X",
          notify: "N",
          remarks: null,
        },
        strAltNo: "",
        mapPCCs: {
          "1": "6061024",
          "2": "6302263",
          "3": "6061025",
          "5": "6014616",
          "11": "6061032",
          "85": "6047417",
          "86": "6045988",
        },
        weight: 0.74,
      },
      image: {
        source: "brickLink",
        rsc: "https://img.bricklink.com/ItemImage/PN/85/10247.png",
      },
      rowNumber: "2",
      selected: false,
      isSpecial: false,
    },
  ],
};

export interface BrickHunterV1Item {
  source: string;
  designId: string;
  itemNumber: number;
  color: {
    id: string;
    brickLinkId: string;
  };
  qty: {
    min: number;
    have: number;
  };
  brickLink: {
    wantedList: {
      itemtype: string;
      maxprice: number;
      condition: string;
      notify: string;
      remarks: string;
    };
  };
}

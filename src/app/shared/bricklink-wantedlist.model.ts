export class BrickLinkWantedListItem {
    constructor(
        public color: number,
        public condition: string,
        public itemId: string,
        public itemType: string,
        public maxPrice: number,
        public minQty: number,
        public qtyFilled: number,
        public notify: boolean,
        public remarks: string
    ) { }
}

export interface IBrickLinkWantedListItem {
    color: number,
    condition: string,
    itemId: string,
    itemType: string,
    maxPrice: number,
    minQty: number,
    qtyFilled: number,
    notify: boolean,
    remarks: string
}
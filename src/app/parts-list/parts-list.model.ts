export class Part {
    constructor(
        public color: number,
        public itemId: string,
        public designId: number,
        public elementId: number,
        public quantity: {
            amount: number,
            have: number
        }
    ) { }
}

export class PartsList {
    constructor(
        public id: string,
        public name: string,
        public source: string,
        public parts: Part[]
    ) { }
}
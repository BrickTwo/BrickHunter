export interface ILegoModel {
    elementId: number;
    designNumber: number;
    inStock?: boolean | undefined;
    price: {
        currencyCode: string;
        amount: number;
    };
    colourId: number;
    deliveryChannel: string;
    date?: Date | number | undefined;
}
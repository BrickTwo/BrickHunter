import { IPart } from ".";

export interface IPartsList {
    id: number;
    uuid: string;
    name: string;
    source: string;
    parts: IPart[];
}
import { IPart } from ".";

export interface IPartsList {
    id: number;
    uid: string;
    name: string;
    source: string;
    parts: IPart[];
}
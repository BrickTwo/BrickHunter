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
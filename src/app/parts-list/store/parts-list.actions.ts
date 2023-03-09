import { createAction, props } from "@ngrx/store";
import { Part, PartsList } from "../parts-list.model";

export const addPartsList = createAction(
    '[PartsList] Add Parts List',
    props<{
        partsList: PartsList
    }>()
);

export const updatePartsList = createAction(
    '[PartsList] Update Parts List',
    props<{
        id: string,
        partsList: PartsList
    }>()
);

export const deletePartsList = createAction(
    '[PartsList] Delete PArts List',
    props<{
        id: string
    }>()
);

export const addPartToPartsList = createAction(
    '[PartsList] Add Part to Parts List',
    props<{
        partsListId: string,
        part: Part
    }>()
);

export const updatePartInPartsList = createAction(
    '[PartsList] Update Part in Parts List',
    props<{
        partsListId: string,
        elementId: number,
        part: Part
    }>()
);

export const deletePartFromPartsList = createAction(
    '[PartsList] Delete Part from Parts List',
    props<{
        partsListId: string,
        elementId: number
    }>()
);
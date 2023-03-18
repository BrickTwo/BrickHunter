import { createAction, props } from "@ngrx/store";
import { BrickLinkWantedListItem } from "src/app/shared/bricklink-wantedlist.model";
import { Part, PartsList } from "../parts-list.model";

export const importPartsList = createAction(
    '[PartsList] Import Parts List',
    props<{
        partsListName: string,
        source: string,
        parts: BrickLinkWantedListItem[]
    }>()
);

export const loadRebrickableData = createAction(
    '[PartsList] Load Parts Infos',
    props<{
        partsListName: string,
        source: string,
        parts: BrickLinkWantedListItem[]
    }>()
);

export const loadBrickLinkData = createAction(
    '[PartsList] load BrickLink data',
    props<{
        partsListName: string,
        source: string,
        parts: Part[]
    }>()
);

export const importFail = createAction(
    '[PartsList] load BrickLink data',
    props<{
        errorMessage: string
    }>()
);

export const setPartsLists = createAction(
    '[PartsList] Set Parts Lists',
    props<{
        partsLists: PartsList[]
    }>()
);

export const addPartsList = createAction(
    '[PartsList] Add Parts List',
    props<{
        partsList: PartsList
    }>()
);

export const updatePartsList = createAction(
    '[PartsList] Update Parts List',
    props<{
        id: number,
        partsList: PartsList
    }>()
);

export const deletePartsList = createAction(
    '[PartsList] Delete Parts List',
    props<{
        id: number
    }>()
);

export const addPartToPartsList = createAction(
    '[PartsList] Add Part to Parts List',
    props<{
        partsListId: string,
        part: Part
    }>()
);

export const updatePartsInPartsList = createAction(
    '[PartsList] Update Parts in Parts List',
    props<{
        partsListId: number,
        parts: Part[]
    }>()
);

export const deletePartFromPartsList = createAction(
    '[PartsList] Delete Part from Parts List',
    props<{
        partsListId: string,
        elementId: number
    }>()
);

export const restorePartsLists = createAction(
    '[PartsList] Restore Parts Lists'
);
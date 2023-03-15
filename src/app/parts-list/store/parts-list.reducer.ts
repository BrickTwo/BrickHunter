import { Action, createReducer, on } from "@ngrx/store";
import { PartsList } from "../parts-list.model";
import * as PartsListActions from './parts-list.actions';

export interface State {
    partsLists: PartsList[];
    maxPartsListId: number;
}

const initialState: State = {
    partsLists: [],
    maxPartsListId: 0
};

const _partsListReducer = createReducer(
    initialState,

    on(PartsListActions.setPartsLists,
        (state, action) => ({
            ...state,
            partsLists: [...action.partsLists],
            maxPartsListId: (!action.partsLists.length) ? 0 : action.partsLists.reduce((p, c) => p.id > c.id ? p : c).id
        })
    ),

    on(PartsListActions.addPartsList,
        (state, action) => {
            let partsListId = state.maxPartsListId + 1;
            let partsList = { ...action.partsList, id: partsListId };
            return {
                ...state,
                partsLists: state.partsLists.concat({ ...partsList }),
                maxPartsListId: partsListId
            };
        }
    ),

    on(
        PartsListActions.updatePartsList,
        (state, action) => ({
            ...state,
            partsLists: state.partsLists.map(
                (partsList) => partsList.id === action.id ? { ...action.partsList } : partsList
            )
        })
    ),

    on(
        PartsListActions.deletePartsList,
        (state, action) => ({
            ...state,
            partsLists: state.partsLists.filter(
                (partsList) => partsList.id != action.id
            )
        })
    ),

    on(
        PartsListActions.updatePartsInPartsList,
        (state, action) => {
            let partsList = state.partsLists.find(p => p.id === action.partsListId);
            partsList.parts = partsList.parts.map(part => {
                let updatePart = action.parts.find(p => p.id === part.id);
                if (!updatePart) return part;
                return updatePart;
            });

            return {
                ...state,
                partsLists: state.partsLists
            }
        }
    ),
);

export function partsListReducer(state: State, action: Action) {
    return _partsListReducer(state, action);
}
import { Action, createReducer, on } from "@ngrx/store";
import { PartsList } from "../parts-list.model";
import * as PartsListActions from './parts-list.actions';

export interface State {
    partsLists: PartsList[];
}

const initialState: State = {
    partsLists: []
};

const _partsListReducer = createReducer(
    initialState,

    on(PartsListActions.addPartsList,
        (state, action) => ({
            ...state,
            partsLists: state.partsLists.concat({ ...action.partsList })
        })
    ),
    on(
        PartsListActions.updatePartsList,
        (state, action) => ({
            ...state,
            recipes: state.partsLists.map(
                (partsList) => partsList.id === action.id ? { ...action.partsList } : partsList
            )
        })
    ),

    on(
        PartsListActions.deletePartsList,
        (state, action) => ({
            ...state,
            recipes: state.partsLists.filter(
                (partsList) => partsList.id !== partsList.id
            )
        })
    ),
);

export function partsListReducer(state: State, action: Action) {
    return _partsListReducer(state, action);
  }
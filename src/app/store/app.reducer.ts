import { ActionReducerMap } from "@ngrx/store";
import * as fromPartsList from "../parts-list/store/parts-list.reducer";

export interface AppState {
    partsList: fromPartsList.State,
}

export const appReducer: ActionReducerMap<AppState> = {
    partsList: fromPartsList.partsListReducer,
};
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, tap, withLatestFrom } from "rxjs";
import { environment } from "src/environments/environment";
import * as fromApp from "src/app/store/app.reducer";
import { GetPartsRequest, GetPartsResponse, RebrickableModel, Part, PartsList } from "../parts-list.model";
import * as PartsListActions from "./parts-list.actions";
import { Color } from "src/app/shared/functions/color";
import { Guid } from "src/app/shared/functions/guid";
import { db } from "src/app/shared/functions/db";

@Injectable()
export class PartsListEffects {
    importPartsList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PartsListActions.importPartsList),
            switchMap(actionData => {
                const partIds = actionData.parts.map(item => { return item.itemId });
                const request = new GetPartsRequest(actionData.source, partIds);
                return this.http.post<GetPartsResponse[]>(environment.brickHunterApiBaseUrl + '/parts', request)
                    .pipe(map(response => ({ actionData, response })));
            }),
            map(({ actionData, response }) => {
                const parts = actionData.parts.map(item => {
                    const color = Color.getColor(item.color, actionData.source);

                    const part: Part = {
                        id: item.itemId,
                        color: color.id,
                        qty: item.minQty,
                        have: item.qtyFilled,
                        itemType: item.itemType,
                        maxPrice: item.maxPrice,
                        condition: item.condition,
                        notify: item.notify,
                        remarks: item.remarks,
                        source: {
                            source: actionData.source,
                            id: item.itemId,
                            color: item.color
                        }
                    };

                    const resp = response.find((resp) => {
                        return resp.externalIds.find(
                            (e) => e.externalId === item.itemId && e.source === "BrickLink"
                        );
                    });

                    if (resp) {
                        const elementIds = resp.elementIds
                            .filter((e) => e.colorId == color.id)
                            .map((item) => item.elementId)
                            .map((id) => parseInt(id))
                            .sort((a, b) => b - a) // numerical sort desc
                            .map((id) => id.toString());

                        const rebrickable: RebrickableModel = {
                            partNum: resp.partNum,
                            elementId: elementIds[0],
                            color: color.id,
                            name: resp.name,
                            imageUrl: resp.imageUrl,
                            partCatId: resp.partCatId,
                            yearFrom: resp.yearFrom,
                            yearTo: resp.yearTo,
                            isPrint: resp.isPrint,
                            externalIds: resp.externalIds,
                            elementIds: elementIds,
                        }

                        part.rebrickable = rebrickable;
                    }

                    return part;
                });

                const partsList: PartsList = {
                    id: 0,
                    uid: Guid.generate(),
                    name: actionData.partsListName,
                    source: actionData.source,
                    parts: parts
                };
                return PartsListActions.addPartsList({ partsList: partsList });
            })
        )
    );

    addPartsList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PartsListActions.addPartsList),
            withLatestFrom(this.store.select('partsList')),
            tap(([action, state]) => db.partsLists.add(state.partsLists.find(p => p.uid === action.partsList.uid)))
        ),
        { dispatch: false }
    );

    setPartsList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PartsListActions.restorePartsLists),
            switchMap(async () => {
                return await db.partsLists.toArray();
            }),
            map(partsLists => PartsListActions.setPartsLists({ partsLists: partsLists }))
        )
    );

    deletePartsList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PartsListActions.deletePartsList),
            switchMap(actionData => {
                return db.partsLists.delete(actionData.id)
            })
        ),
        { dispatch: false }
    );

    updatePartsToPartsList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PartsListActions.updatePartsInPartsList),
            withLatestFrom(this.store.select('partsList')),
            tap(([actionData, state]) => db.partsLists.update(actionData.partsListId, state.partsLists.find(p => p.id === actionData.partsListId)))
        ),
        { dispatch: false }
    );


    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, tap, withLatestFrom } from "rxjs";
import { environment } from "src/environments/environment";
import * as fromApp from "src/app/store/app.reducer";
import { GetPartsRequest, GetPartsResponse, RebrickableModel, Part, PartsList, GetBrickLinkResponse, GetBrickLinkRequest, BrickLinkModel } from "../parts-list.model";
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
                const request: GetPartsRequest = { source: actionData.source, ids: partIds };
                return this.http.post<GetPartsResponse[]>(environment.brickHunterApiBaseUrl + '/parts', request)
                    .pipe(map(responseParts => ({ actionData, responseParts })));
            }),
            switchMap(({ actionData, responseParts }) => {
                const partIds = actionData.parts.map(item => { return item.itemId });
                const request: GetBrickLinkRequest = { itemNumbers: partIds}
                return this.http.post<GetBrickLinkResponse[]>(environment.brickHunterApiBaseUrl + '/bricklink', request)
                    .pipe(map(responseBrickLink => ({ actionData, responseParts, responseBrickLink })));
            }),
            map(({ actionData, responseParts, responseBrickLink }) => {
                const parts = actionData.parts.map(item => {
                    const color = Color.getColor(item.color, actionData.source);

                    const part: Part = {
                        id: `${item.itemId}+${item.color}`,
                        elementId: 0,
                        elementIds: [],
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

                    const resp = responseParts.find((resp) => {
                        return resp.externalIds.find(
                            (e) => e.externalId === item.itemId && e.source === "BrickLink"
                        );
                    });

                    if (resp) {
                        const elementIds = resp.elementIds
                            .filter((e) => e.colorId == color.id)
                            .map((item) => item.elementId)
                            .map((id) => Number(id))

                        const rebrickable: RebrickableModel = {
                            partNum: resp.partNum,
                            color: color.id,
                            name: resp.name,
                            imageUrl: resp.imageUrl,
                            partCatId: resp.partCatId,
                            yearFrom: resp.yearFrom,
                            yearTo: resp.yearTo,
                            isPrint: resp.isPrint,
                            externalIds: resp.externalIds
                        }

                        part.elementIds = elementIds;
                        part.rebrickable = rebrickable;
                    }

                    const respBrickLink = responseBrickLink.find((resp) => resp.itemNo === item.itemId);
                    if(respBrickLink) {
                        const colorInfo = respBrickLink.colors.find(c => c.colorId === item.color);
                        let yearColor = 0;
                        let yearToColor = 0;
                        if(colorInfo) {
                            yearColor = colorInfo.yearFrom;
                            yearToColor = colorInfo.yearTo;
                        }

                        const brickLink: BrickLinkModel = {
                            itemId: respBrickLink.itemId,
                            itemType: respBrickLink.itemType,
                            itemNo: respBrickLink.itemNo,
                            itemName: respBrickLink.itemName,
                            year: respBrickLink.year,
                            yearTo: respBrickLink.yearTo,
                            yearColor: yearColor,
                            yearToColor: yearToColor,
                            weight: respBrickLink.weight,
                            dimX: respBrickLink.dimX,
                            dimY: respBrickLink.dimY,
                            dimZ: respBrickLink.dimZ,
                            dimXmm: respBrickLink.dimXmm,
                            dimYmm: respBrickLink.dimYmm,
                            dimZmm: respBrickLink.dimZmm,
                            hasSound: respBrickLink.hasSound,
                            isStickerPart: respBrickLink.isStickerPart
                        }

                        var elmts = respBrickLink.elementIds
                                                .filter(el => el.colorId === item.color)
                                                .filter(o=> !part.elementIds.some(i=> i === o.elementId))
                                                .map(el => el.elementId);

                        part.elementIds.push(...elmts);

                        part.brickLink = brickLink;
                    }

                    part.elementIds = part.elementIds?.map((id) => id).sort((a, b) => b - a) // numerical sort desc
                    part.elementId = part.elementIds[0];

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
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { PartsListDetailComponent } from "./parts-list-detail/parts-list-detail.component";
import { PartsListImportComponent } from "./parts-list-import/parts-list-import.component";
import { PartsListListComponent } from "./parts-list-list/parts-list-list.component";

@NgModule({
    declarations: [
        PartsListListComponent,
        PartsListDetailComponent,
        PartsListImportComponent
    ],
    imports: [
        MaterialModule,
        RouterModule.forChild([
            { path: '', component: PartsListListComponent },
            { path: ':id', component: PartsListDetailComponent } 
        ]),
        CommonModule,
        SharedModule,
        FormsModule
    ]
})
export class PartsListsModule { }
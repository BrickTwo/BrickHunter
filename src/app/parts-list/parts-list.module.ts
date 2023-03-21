import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PrimengModule } from "../primeng.module";
import { SharedModule } from "../shared/shared.module";
import { PartsListImportComponent, PartsListSettingsComponent, PartsTableComponent } from "./components";
import { PartsListDetailComponent, PartsListListComponent } from "./pages";

@NgModule({
    declarations: [
        PartsListListComponent,
        PartsListDetailComponent,
        PartsListSettingsComponent,
        PartsListImportComponent,
        PartsTableComponent
    ],
    imports: [
        PrimengModule,
        RouterModule.forChild([
            { path: '', component: PartsListListComponent },
            { path: ':id', component: PartsListDetailComponent }
        ]),
        CommonModule,
        SharedModule,
        FormsModule,
        FontAwesomeModule
    ]
})
export class PartsListsModule { }
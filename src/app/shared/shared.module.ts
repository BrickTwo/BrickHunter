import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PrimengModule } from "../primeng.module";
import { SideNavigationComponent } from "./layout";

@NgModule({
    declarations: [
        SideNavigationComponent
    ],
    imports: [
        PrimengModule,
        CommonModule,
        FontAwesomeModule
    ],
    exports: [
        SideNavigationComponent
    ]
})
export class SharedModule {}
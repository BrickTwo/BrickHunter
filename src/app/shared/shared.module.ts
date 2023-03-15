import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/material.module";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { PartsTableComponent } from "./parts-table/parts-table.component";

@NgModule({
    declarations: [
        FileUploadComponent,
        PartsTableComponent
    ],
    imports: [
        HttpClientModule,
        MaterialModule,
        CommonModule
    ],
    exports: [
        FileUploadComponent,
        PartsTableComponent
    ]
})
export class SharedModule {}
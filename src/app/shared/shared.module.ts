import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/material.module";
import { FileUploadComponent } from "./file-upload/file-upload.component";

@NgModule({
    declarations: [
        FileUploadComponent
    ],
    imports: [
        HttpClientModule,
        MaterialModule,
        CommonModule
    ],
    exports: [
        FileUploadComponent
    ]
})
export class SharedModule {}
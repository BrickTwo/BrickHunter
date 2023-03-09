import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @Input()
  requiredFileType: string;

  @Input()
  directRead: boolean = false;

  @Output()
  fileUpload = new EventEmitter<string | ArrayBuffer>();

  @Output()
  fileName = new EventEmitter<string>();

  fileNameDisplay = '';

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileNameDisplay = file.name;
      this.fileName.emit(file.name);

      if (this.directRead) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          const fileContent = event.target.result;
          this.fileUpload.emit(fileContent);
        };

        fileReader.readAsText(file);
      }
    }
  }
}

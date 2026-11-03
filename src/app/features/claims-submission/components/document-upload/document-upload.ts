import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { UploadedDocument } from '../../../../core/models/uploaded-document.model';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload.html',
  styleUrl: './document-upload.css'
})
export class DocumentUpload implements OnChanges {

  @Input() initialDocuments: UploadedDocument[] = [];

  @Output() documentsChanged =
    new EventEmitter<UploadedDocument[]>();

  documents: UploadedDocument[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDocuments']) {
      this.documents = [...(this.initialDocuments || [])];
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    for (const file of Array.from(input.files)) {

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds the 5 MB limit.`);
        continue;
      }

      const alreadyExists = this.documents.some(
        doc => doc.fileName === file.name &&
               doc.fileSize === file.size
      );

      if (alreadyExists) {
        alert(`${file.name} is already added.`);
        continue;
      }

      const document: UploadedDocument = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        fileName: file.name,
        fileType: file.type || 'Unknown',
        fileSize: file.size,
        uploadedAt: new Date().toISOString()
      };

      this.documents = [...this.documents, document];
    }

    this.emitDocuments();
    input.value = '';
  }

  removeDocument(id: number): void {
    this.documents = this.documents.filter(
      document => document.id !== id
    );

    this.emitDocuments();
  }

  clearDocuments(): void {
    this.documents = [];
    this.emitDocuments();
  }

  private emitDocuments(): void {
    this.documentsChanged.emit([...this.documents]);
  }
}
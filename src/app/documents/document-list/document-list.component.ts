import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Document } from '../document.model';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  constructor(private documentsService: DocumentsService) { }
  
  documents : Document[] = [];

  ngOnInit() {
    this.documents = this.documentsService.getDocuments();
  }

  onSelected(document: Document) {
    this.documentsService.documentSelectedEvent.emit(document);
  }

}

import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private documents: Document[] = [];
  
  documentSelectedEvent = new EventEmitter<Document>();

  constructor() { 
    this.documents = MOCKDOCUMENTS;
  }

  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id);
  }

  getDocuments(): Document[] {
    return this.documents.slice()
    .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
    .slice();
  }
}

// can routes have child routes? true


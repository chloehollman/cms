import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  documents: Document[];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;

    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);

    const documentsListClone = this.documents.slice();

    this.documentListChangedEvent.next(documentsListClone);
  }


  deleteDocument(document: Document) {
    if(!document) {
      return;
    }
    const pos = this.documents.indexOf(document);

    if (pos < 0) {
      return;
  }

  this.documents.splice(pos,1);

  const documentsListClone = this.documents.slice();
  
  this.documentListChangedEvent.next(documentsListClone);

  }

  getDocument(id: string): Document {
    for (const document of this.documents){
      if (document.id === id){
        return document;
      }
    }

    return null;
  }

  getDocuments(): Document[] {
    return this.documents.slice()
  }

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      let currentId = parseInt(document.id);


      if (currentId > maxId){
        maxId = currentId;
      }
    }
    return maxId;
  }
  
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument){
      return;
    }

    const pos = this.documents.indexOf(originalDocument);

    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;

    this.documents[pos] = newDocument;

    const documentsListClone = this.documents.slice();

    this.documentListChangedEvent.next(documentsListClone);


  }


}

// can routes have child routes? true


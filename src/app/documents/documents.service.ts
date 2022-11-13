import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  documents: Document[]=[];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) { 
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

  // getDocuments(): Document[] {
  //   return this.documents.slice()
  // }

  getDocuments() {
    this.http.get('https://wdd430-cms-b65fe-default-rtdb.firebaseio.com/documents.json')
    .subscribe(
      // success method
      (documents: 
        Document[] ) => {
        this.documents = documents;
        
        this.maxDocumentId = this.getMaxId();
        
        this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
        
        this.documentListChangedEvent.next(this.documents.slice());
      });
  
      (error: any) => {
        console.log(error);
      }
  }

  storeDocuments() {
    let documents = JSON.stringify(this.documents);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http
    .put("https://wdd430-cms-b65fe-default-rtdb.firebaseio.com/document.json", 
    documents, {
      
      headers: headers,
    })
    
    .subscribe(() => {
      this.documentListChangedEvent.next
      (this.documents.slice());
    });
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


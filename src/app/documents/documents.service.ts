import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Document } from './document.model';
// import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  documents: Document[]=[];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) { 
    // this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }


  sortAndSend() {
    this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  addDocument(document: Document) {
    if (!Document) {
      return;
    }

    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
    document,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend();
      }
    );
}

  //   this.maxDocumentId++;

  //   newDocument.id = this.maxDocumentId.toString();

  //   this.documents.push(newDocument);

  //   const documentsListClone = this.documents.slice();

  //   this.documentListChangedEvent.next(documentsListClone);
  // }


  deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  getDocument(id: string): Document {
    // for (const document of this.documents){
    //   if (document.id === id){
    //     return document;
    //   }
    // }

    // return null;
    return this.documents.find((document) => document.id === id);
  }

  getDocuments() {
    this.http.get<{ message: string, documents: Document[]}>('http://localhost:3000/documents')
      .subscribe(
        (documentData) => {
          this.documents = documentData.documents;
          // this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
          this.documentListChangedEvent.next(this.documents.slice());
        });
        (error: any) => {
          console.log(error);
        }
      
  }

  // getDocuments(): Document[] {
  //   return this.documents.slice()
  // }

  // getDocuments() {
  //   this.http.get('http://localhost:3000/documents')
  //   .subscribe(
  //     // success method
  //     (documents: 
  //       Document[] ) => {
  //       this.documents = documents;
        
  //       this.maxDocumentId = this.getMaxId();
        
  //       this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
        
  //       this.documentListChangedEvent.next(this.documents.slice());
  //     });
  
  //     (error: any) => {
  //       console.log(error);
  //     }
  // }

  storeDocuments() {
    let documents = JSON.stringify(this.documents);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
   

    this.http
    .put("http://localhost:3000/documents", 
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
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
      
  }



}

// can routes have child routes? true


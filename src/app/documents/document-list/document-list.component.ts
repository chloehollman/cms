import { Component, OnDestroy, OnInit, Output} from '@angular/core';
import { Document } from '../document.model';
import { DocumentsService } from '../documents.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents : Document[] = [];
  subscription: Subscription;
  
  constructor(private documentsService: DocumentsService) { }
  
  

  ngOnInit() {
   
    this.subscription = this.documentsService.documentListChangedEvent.subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        console.log(this.documents);
      }
    );
    
    this.documentsService.getDocuments();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
 
}

// this.documentsService.documentChangedEvent

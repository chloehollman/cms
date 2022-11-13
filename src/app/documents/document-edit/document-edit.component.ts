import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocumentsService } from '../documents.service';
import { Document } from '../document.model';



@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  id: string;

  constructor(
    private documentsService: DocumentsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe (
      (params: Params) => {
        this.id = params['id'];
        
        if(!this.id) {
          this.editMode = false;
          return;
        }
        this.originalDocument = this.documentsService.getDocument(this.id);

        if (!this.originalDocument){
          return;
        }
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      });

  }
onSubmit(form: NgForm){
  const value = form.value;
  const newDocument = new Document(
    "",
    value.id,
    value.name, 
    value.description, 
    value.url, 
    )

    if(this.editMode = true){
      this.documentsService.updateDocument(this.originalDocument, newDocument);
    }

    else {
      this.documentsService.addDocument(newDocument);

    }

   
}


onCancel() {
  this.router.navigate(['/documents']);
}
}


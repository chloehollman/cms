import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[]= [];
  subscription: Subscription;
  term: string;

constructor(private contactService: ContactService) { }




  ngOnInit() {
    this.subscription = this.contactService.contactListChangedEvent
    .subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );

    this.contactService.getContacts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


search(value: string) {

  this.term = value;
  
  }

   
}



// onSelected(contact: Contact) {
//   this.selectedContactEvent.emit(contact);
// }

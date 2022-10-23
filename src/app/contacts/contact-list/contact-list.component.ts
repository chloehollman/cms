import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  @Output() selectedContactEvent = new EventEmitter<Contact>();
constructor(private contactService: ContactService) { }

contacts: Contact[]= [];


  ngOnInit() {
    this.contacts = this.contactService.getContacts();
  }

    onSelected(contact: Contact) {
      this.contactService.contactSelectedEvent.emit(contact);
    
  }

}

// onSelected(contact: Contact) {
//   this.selectedContactEvent.emit(contact);
// }

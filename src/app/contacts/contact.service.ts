import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
// import { MOCKCONTACTS } from './MOCKCONTACTS';


@Injectable({
   providedIn: 'root'
})
export class ContactService {
   contacts: Contact[]=[];
   contactListChangedEvent = new Subject<Contact[]>();
   maxContactId: number;

   constructor(private http: HttpClient) {
      // this.contacts = MOCKCONTACTS;
      this.maxContactId = this.getMaxId();
   }


   sortAndSend() {
    this.contacts.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

   addContact (contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Document is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contact',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }

  deleteContact(contact: Contact) {

    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }



   getContact(id: string): Contact {
      return this.contacts.find((contact) => contact.id === id);
   }

  getContacts() {
    this.http.get<{ message: string, contacts: Contact[]}>('http://localhost:3000/contacts')
      .subscribe(
        (responseData) => {
          this.contacts = responseData.contacts;
          this.sortAndSend();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }


   getMaxId(): number {
      let maxId = 0;
  
      for (const contact of this.contacts) {
        let currentId = parseInt(contact.id);
  
  
        if (currentId > maxId){
          maxId = currentId;
        }
      }
      return maxId;
    }



    updateContact(originalContact: Contact, newContact: Contact) {
      if (!originalContact || !newContact) {
        return;
      }
  
      const pos = this.contacts.findIndex(d => d.id === originalContact.id);
  
      if (pos < 0) {
        return;
      }
  
      // set the id of the new Document to the id of the old Document
      newContact.id = originalContact.id;
      newContact._id = originalContact._id;
  
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
      // update database
      this.http.put('http://localhost:3000/contacts/' + originalContact.id,
        newContact, { headers: headers })
        .subscribe(
          (response: Response) => {
            this.contacts[pos] = newContact;
            this.sortAndSend();
          }
        );
    }
  
    storeContacts() {
      let contacts = JSON.stringify(this.contacts);
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
      this.http
      .put("http://localhost:3000/contacts", 
      contacts, {
        
        headers: headers,
      })
      
      .subscribe(() => {
        this.contactListChangedEvent.next
        (this.contacts.slice());
      });
    }

}
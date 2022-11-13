import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';


@Injectable({
   providedIn: 'root'
})
export class ContactService {
   contacts: Contact[]=[];
   contactListChangedEvent = new Subject<Contact[]>();
   maxContactId: number;

   constructor(private http: HttpClient) {
      this.contacts = MOCKCONTACTS;
      this.maxContactId = this.getMaxId();
   }

   addContact(newContact: Contact) {
      if (!newContact) {
        return;
      }
  
      this.maxContactId++;
  
      newContact.id = this.maxContactId.toString();
  
      this.contacts.push(newContact);
  
      const contactsListClone = this.contacts.slice();
  
      this.contactListChangedEvent.next(contactsListClone);
    }

   deleteContact(contact: Contact) {
      if(!contact) {
        return;
      }
      const pos = this.contacts.indexOf(contact);
  
      if (pos < 0) {
        return;
    }
  
    this.contacts.splice(pos,1);

    const contactsListClone = this.contacts.slice();
    
    this.contactListChangedEvent.next(contactsListClone);
    }



   getContact(id: string): Contact {
      return this.contacts.find((contact) => contact.id === id);
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
      if (!originalContact || !newContact){
        return;
      }
  
      const pos = this.contacts.indexOf(originalContact);
  
      if (pos < 0) {
        return;
      }
      newContact.id = originalContact.id;
  
      this.contacts[pos] = newContact;
  
      const contactsListClone = this.contacts.slice();
  
      this.contactListChangedEvent.next(contactsListClone);
  
  
    }


    getContacts() {
      this.http.get("https://wdd430-cms-b65fe-default-rtdb.firebaseio.com/contacts.json")
      .subscribe(
        // success method
        (contacts: 
          Contact[] ) => {
          this.contacts = contacts;
          
          this.maxContactId = this.getMaxId();
          
          this.contacts.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
          
          this.contactListChangedEvent.next(this.contacts.slice());
        });
    
        (error: any) => {
          console.log(error);
        }
    }
  
    storeContacts() {
      let contacts = JSON.stringify(this.contacts);
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
      this.http
      .put("https://wdd430-cms-b65fe-default-rtdb.firebaseio.com/contacts.json", 
      contacts, {
        
        headers: headers,
      })
      
      .subscribe(() => {
        this.contactListChangedEvent.next
        (this.contacts.slice());
      });
    }

}
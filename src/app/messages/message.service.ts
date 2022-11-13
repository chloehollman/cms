import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];

  messageListChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) { 
    this.messages = MOCKMESSAGES;
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
  }
  // getMesssages(): Message[] {
  //   return this.messages.slice();
  // }
  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      let currentId = parseInt(message.id);


      if (currentId > maxId){
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.messageListChangedEvent.emit(this.messages.slice());
  }

  getMessages() {
    this.http.get("https://wdd430-cms-b65fe-default-rtdb.firebaseio.com/messages.json")
    .subscribe(
      // success method
      (messages: 
        Message[] ) => {
        this.messages = messages;
        
        this.maxMessageId = this.getMaxId();
        
        this.messageListChangedEvent.next(this.messages.slice());
      });
  
      (error: any) => {
        console.log(error);
      }
  }

  storeContacts() {
    let contacts = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http
    .put("https://wdd430-cms-b65fe-default-rtdb.firebaseio.com/messages.json", 
    contacts, {
      
      headers: headers,
    })
    
    .subscribe(() => {
      this.messageListChangedEvent.next
      (this.messages.slice());
    });
  }
}

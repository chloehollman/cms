import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
// import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageListChangedEvent = new Subject<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) { 
    // this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId();
  }

  sortAndSend() {
    
    this.messageListChangedEvent.next(this.messages.slice());
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
  }


  getMessages() {
    this.http.get<{ message: string, messages: Message[]}>('http://localhost:3000/messages')
    .subscribe(
      // success method
      (responseData) => {
        this.messages = responseData.messages;
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
}
  getMesssages(): Message[] {
    return this.messages.slice();
  }
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
    if (!message) {
      return;
    }
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});


    this.http.post<{ response: string, newMessage: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          message._id = responseData.newMessage._id;
          message.id = responseData.newMessage.id;

          this.messages.push(message);
          this.sortAndSend();
        }
      );
  }
  



  storeMessages() {
    let messages = JSON.stringify(this.messages);
    
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http
    .put("http://localhost:3000/messages", 
    messages, {
      
      headers: headers,
    })
    
    .subscribe(() => {
      this.messageListChangedEvent.next
      (this.messages.slice());
    });

    

    
  }

  
}

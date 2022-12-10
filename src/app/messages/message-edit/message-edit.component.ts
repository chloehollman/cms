import { Component, OnInit, EventEmitter, ViewChild, ElementRef, Output } from "@angular/core";
import { Contact } from "src/app/contacts/contact.model";
import { ContactService } from "src/app/contacts/contact.service";
import { Message } from '../message.model';
import { MessageService } from "../message.service";

@Component({
    selector: 'cms-message-edit',
    templateUrl: './message-edit.component.html',
    styleUrls: ['./message-edit.component.css']
})

export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender: Contact;

  constructor(
    private messageService: MessageService,
    private contactService: ContactService) { }

  ngOnInit() {
    this.currentSender = this.contactService.getContact('101');
  }

  onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const msgTextValue = this.msgText.nativeElement.value;


  const newMessage= new Message(
    '',
    '',
    subjectValue,
    msgTextValue,
    this.currentSender);

    this.messageService.addMessage(newMessage);
    
    this.onClear();

}

onClear() {
  this.subject.nativeElement.value = '';
  this.msgText.nativeElement.value = '';

}
}
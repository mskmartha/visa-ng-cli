import { Component, Input, OnInit, EventEmitter, Output, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import * as moment from 'moment';
import { HttpClient } from '../http.client';
import { ChatComponentService } from './chat.component.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  providers: [],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @Input() id;
  @Input() type;
  @Input() group;
  comments: IComment[] = [];
  message = '';
  currentUser: any;
  user: string;
  url: string;
  constructor(private _chatComponentService: ChatComponentService) {}
  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.user = `${this.currentUser.userName}`;
    if (this.group) {
      this.comments = this.group.comments;
    }else { // getComments api only for main questionnaire
      this._chatComponentService.getComments(this.type, this.id, this.user).subscribe(res => {
        this.comments = res;
      });
    }
  }
  sendMessage(message) {
    let groupId = '';
    let teamId = '';
    if (this.group) {
      groupId = this.group.groupId;
      teamId = (this.group.teamId) ? (this.group.teamId) : '';
    }
    this._chatComponentService.postMessage(this.type, this.id, groupId, this.user, message, teamId).subscribe(res => {
      const date = moment();
      this.comments.push({
        comment: message,
        userName: this.user,
        creationDate: date.toISOString()
      });
    });
    this.message = '';
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}

export interface IComment {
  comment: string;
  creationDate: string;
  userName: string;
}

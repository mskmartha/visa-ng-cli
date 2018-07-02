import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {HttpClient} from '../http.client';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() question: any;
  @Input() parentForm;
  @Input() isViewDisabled = false;
  @Output() commentEmitter = new EventEmitter();
  newComments = [];
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  currentUser = '';
  currentUserDetail:any = '';
  commentFormControl = new FormControl('');
  constructor(private customHttp: HttpClient) {}

  ngOnInit() {
    this.currentUserDetail = JSON.parse(sessionStorage.getItem('detailedUserInfo'));
    this.currentUser = this.currentUserDetail.ntId;
    this.scrollToBottom();
    this.question.comments.forEach((obj, index) => {
      if(obj.userName === this.currentUser) {
        this.question.comments[index]['avatarImage'] = this.currentUserDetail.avatarImage;
        this.question.comments[index]['name'] = this.currentUserDetail.firstName + ' ' + this.currentUserDetail.lastName;
      } else {
        this.customHttp.get('/config-services/user/' + obj.userName).subscribe((obj) => {
          let res = (obj.json());
          this.question.comments[index]['avatarImage'] = res.avatarImage;
          this.question.comments[index]['name'] = res.firstName + ' ' + res.lastName;
        });
      }
    });
  }
  appendComment(newComment) {
    this.question.comments.push({comment : newComment.value,
      creationDate : '',
      avatarImage: this.currentUserDetail.avatarImage,
      name: this.currentUserDetail.firstName + ' ' + this.currentUserDetail.lastName,
      userName : this.currentUser});
    // Keeping the track of the new comments in a new Array
    this.newComments.push(newComment.value);
    // Emit an event to the parent to post the comments along with the submit
    this.commentEmitter.emit({comments: this.newComments, parentForm: this.parentForm});
    this.scrollToBottom();
  }
  // Method to scroll to the bottom of the comment section
  scrollToBottom() {
    if(this.question.comments.length > 0) {
      setTimeout(() => { try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error(err);
      }
      });
    }
  }
}

import {Component, NgModule, Inject, ViewChild, Input, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgForm, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DclWrapperComponent, StepWizComponent } from '../../shared/multistep-wizard/multistep-wrapper.component';

@Component({
  selector : 'app-chat-wrapper',
  template: `
  <div class="chat-window">
    <app-chat [id]="model.data.id" [type]="model.data.type" [group]="model.data"></app-chat>
  </div>
  `,
  providers: [],
})
export class ChatWrapperComponent implements OnInit {
  @Input() model: any;
  constructor() {
  }
  ngOnInit() {
    console.log(this.model);
  }
}

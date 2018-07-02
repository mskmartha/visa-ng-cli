import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRowQuestionComponent } from './multi-row-question.component';

describe('MultiRowQuestionComponent', () => {
  let component: MultiRowQuestionComponent;
  let fixture: ComponentFixture<MultiRowQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiRowQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiRowQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

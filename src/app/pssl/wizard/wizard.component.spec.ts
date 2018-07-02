/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PSSLWizardComponent } from './wizard.component';

describe('PSSLWizardComponent', () => {
  let component: PSSLWizardComponent;
  let fixture: ComponentFixture<PSSLWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PSSLWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PSSLWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

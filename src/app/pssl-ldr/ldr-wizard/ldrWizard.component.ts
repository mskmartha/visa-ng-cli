/**
 * Created by smartha on 6/14/17.
 */
import {Component, AfterViewInit, Input, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {NgForm, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LLDRFindingsService } from './ldr-findings.service';
import { Customer } from './ldr-form.interface';
import {LLDRService} from '../pssl-ldr.service';
import { GlobalSharedService } from '../../shared/shared.service';
@Component({
  selector : 'ldr-wizard',
  templateUrl : './ldrWizard.component.html',
  styles: [`:host ::ng-deep .mat-form-field-infix {
    min-width: 450px;
  }`],
  providers: [LLDRFindingsService, LLDRService, GlobalSharedService]
})
export class LDRWizardComponent implements OnInit {
    public SADetails;
    public myForm: FormGroup;
    public ldrEnumDtls: Array<any> = [];
    public editLDR = false;
    public modalStepper = true;
    public showProgess = false;
    public records = false;
    public norecords = false;
    public recordsErr = false;
    public submitSASucess = false;
    public errOnSubmit = false;
    subscription   : any;
    globalEnums      : any;
    psslData      : any;
    isDisabled:boolean = false;
    constructor(@Inject(MAT_DIALOG_DATA) SADetails: any, private api: GlobalSharedService, private _dialog: MatDialog, private _lldrService: LLDRFindingsService, private _fb: FormBuilder, private _lldrServ: LLDRService) {
        this.SADetails = SADetails;
        this.subscription    = this.api.getData('pssl').subscribe( _psslData => {
            this.psslData = _psslData;
            console.log("psslData",this.psslData)
        });
        this.subscription    = this.api.getData('enums').subscribe( _enumsData => {
            this.globalEnums = _enumsData;
            console.log("globalEnums",this.globalEnums)
        });
    }

    ngOnInit() {
        switch(this.SADetails.action) {
            case 'edit' :
                this.isDisabled = false;
                this.getFindingDetail();
                break;
            case 'view' :
                this.isDisabled = true;
                this.getFindingDetail();
                break;
            default : break;
        }
        this.myForm = this._fb.group({
            ldrFindingsDOList: this._fb.array([
                this.initAddFindings(),
            ])
        });

        this.showProgess = false;
    }

    getFindingDetail() {
        this._lldrServ.getFinding(this.SADetails.id, this.SADetails.applicationId, this.SADetails.findingId).subscribe((res)=> {
            this.myForm.controls['ldrFindingsDOList']["controls"][0].controls['findingId'].setValue(res.ldrFindingsDOList[0].findingId);
            this.myForm.controls['ldrFindingsDOList']["controls"][0].controls['findingName'].reset({ value: res.ldrFindingsDOList[0].findingName, disabled: this.isDisabled});
            this.myForm.controls['ldrFindingsDOList']["controls"][0].controls['findingDesc'].reset({ value: res.ldrFindingsDOList[0].findingDesc, disabled: this.isDisabled});
            this.myForm.controls['ldrFindingsDOList']["controls"][0].controls['remediation'].reset({ value: res.ldrFindingsDOList[0].remediation, disabled: this.isDisabled});
            this.myForm.controls['ldrFindingsDOList']["controls"][0].controls['severity'].reset({ value: res.ldrFindingsDOList[0].severity, disabled: this.isDisabled});
            this.myForm.controls['ldrFindingsDOList']["controls"][0].controls['componentName'].reset({ value: res.ldrFindingsDOList[0].componentName, disabled: this.isDisabled});
            this.myForm.controls['ldrFindingsDOList']["controls"][0].controls['status'].reset({ value: res.ldrFindingsDOList[0].status, disabled: this.isDisabled});
            this.myForm.controls['ldrFindingsDOList']["controls"][0].controls['comments'].reset({ value: res.ldrFindingsDOList[0].comments, disabled: this.isDisabled});
        }, err => {
            this.showProgess = false
            this.recordsErr = true;
            this.records = false;
            this.norecords = false;
        });
    }
    submitLDRForm(res) {
        this.myForm.patchValue({
            'findingId':res.ldrFindingsDOList.findingId || '',
            'findingName': res.ldrFindingsDOList.findingName,
            'findingDesc': res.ldrFindingsDOList.findingDesc,
            'remediation': res.ldrFindingsDOList.remediation,
            'severity': res.ldrFindingsDOList.severity,
            'componentName': res.ldrFindingsDOList.componentName,
            'status': res.ldrFindingsDOList.status,
            'comments': res.ldrFindingsDOList.comments,
        });
    }

    initAddFindings() {
        this.showProgess = false
        this.recordsErr = false;
        this.records = true;
        this.norecords = false;
        return this._fb.group({
            'findingId':[''],
            'findingName': ['', Validators.required],
            'findingDesc': ['', Validators.required],
            'remediation': ['', Validators.required],
            'severity': ['', Validators.required],
            'componentName': ['', Validators.required],
            'status': ['', Validators.required],
            'comments': [''],

        });
    }

    addFindings() {
        const control = <FormArray>this.myForm.controls['ldrFindingsDOList'];
        control.push(this.initAddFindings());
    }

    removeFindings(i: number) {
        const control = <FormArray>this.myForm.controls['ldrFindingsDOList'];
        control.removeAt(i);
    }

    save(model: Customer) {

    }
    submitFindings(){
        this.modalStepper = false;
        this.showProgess = true;
        this._lldrService.submitFindings(JSON.stringify(this.myForm.value),this.SADetails).subscribe(res => {
            this.modalStepper = false;
            this.showProgess = false;
            this.submitSASucess = true;
        }, err => {
            this.modalStepper = false;
            this.errOnSubmit = true;
            this.showProgess = false;
        })
    }
}

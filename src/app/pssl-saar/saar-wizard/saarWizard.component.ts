/*
//TODO: convert to reactive form and use QuestionControlService
//TODO: Ability to add multiple findings
*/
import {Component, AfterViewInit, Input, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {NgForm, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SAARFindingsService } from './saar-finding.service';
import { SAARService } from '../pssl-saar.service';
import { GlobalSharedService } from '../../shared/shared.service';
import { SaarMitigationWizardComponent } from './saarMitigationWizard.component';
import { UtilsService } from '../../shared/utils.service';
@Component({
  selector : 'saar-wizard',
  templateUrl : './saarWizard.component.html',
  providers: [SAARService, SAARFindingsService, GlobalSharedService, UtilsService],
  styleUrls: ['./saarWizard.component.css']
})
export class SaarWizardComponent implements OnInit {
    public utils: UtilsService;
    public SAARDetails;
    public saarForm: FormGroup;
    public showProgess = false;
    modalStepper = true;
    submitSASucess = false;
    errOnSubmit = false;
    // public enums;
    subscription: any;
    enums: any;
    psslData: any;
    _api;
    public vulnerabilityTypes = {};
    types: any[];
    vtDescObj: any;
    mitigationList = [];
    tsrList = [];

    public ldrEnumDtls: Array<any> = [];
    isDisabled = false;
    constructor(@Inject(MAT_DIALOG_DATA) saarDetails: any, private api: GlobalSharedService,
      private _saarService: SAARService, private _saarFindingService: SAARFindingsService,
      private _dialog: MatDialog, public saOne: FormBuilder, public saTwo: FormBuilder,
      public saThree: FormBuilder, private _fb: FormBuilder, private utilService: UtilsService) {
        this.utils = utilService;
        this.subscription    = this.api.getData('pssl').subscribe( _psslData => {
            this.psslData = _psslData;
        });
        this.subscription    = this.api.getData('enums').subscribe( _enumsData => {
            this.enums = _enumsData;
        });
        this.SAARDetails = saarDetails;
    }
    ngOnInit() {
        switch (this.SAARDetails.action) {
            case 'edit' :
                this.isDisabled = false;
                break;
            case 'view' :
                this.isDisabled = true;
                break;
            default :
                this.getFindingDetail();
                break;
        }
        this.saarForm = this._fb.group({
            // name: ['', [Validators.required, Validators.minLength(5)]],
            saarFindingDOList: this._fb.array([
                this.initAddFindings(),
            ])
        });
        this.showProgess = false;
    }

    initAddFindings() {
        return this._fb.group({
            'id': [''],
            'findingName': ['', Validators.required],
            'findingType': ['', Validators.required],
            'vid': ['', Validators.required],
            'impact': ['', Validators.required],
            'likely': ['', Validators.required],
            'description': [''],
            'vtInfo': [''],
            'attackVector': ['', Validators.required],
            'dataAsset': ['', Validators.required],
            'mitigation': ['', Validators.required],
            'mitgatnPopover': [''],
            'resolution': [''],
            'resolutionStatus': ['', Validators.required],
            'tsr': [{value: '', disabled: true}],
            'kcc': [{value: '', disabled: true}]
        });
    }

    getFindingDetail() {
        this._saarService.getFinding(this.SAARDetails.findingId).subscribe((res)=> {
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['id'].setValue(res.saarFindingDOList[0].id);
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['findingName'].reset({ value: res.saarFindingDOList[0].findingName, disabled: this.getDisabledStatus()});
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['findingType'].reset({ value: res.saarFindingDOList[0].findingType, disabled: this.getDisabledStatus() });
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['impact'].reset({ value: res.saarFindingDOList[0].impact, disabled: this.getDisabledStatus() });
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['likely'].reset({ value: res.saarFindingDOList[0].likely, disabled: this.getDisabledStatus() });
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['description'].reset({ value: res.saarFindingDOList[0].description, disabled: this.getDisabledStatus() });

            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['vtInfo'].reset(res.saarFindingDOList[0].description);

            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['attackVector'].reset({ value: res.saarFindingDOList[0].attackVector, disabled: this.getDisabledStatus() });
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['dataAsset'].reset({ value: res.saarFindingDOList[0].dataAsset, disabled: this.getDisabledStatus() });
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['mitigation'].reset({ value: res.saarFindingDOList[0].mitigation, disabled: this.getDisabledStatus() });

            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['mitgatnPopover'].reset(res.saarFindingDOList[0].mitigation);

            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['vid'].reset({ value: res.saarFindingDOList[0].vid, disabled: this.getDisabledStatus() });
            this.getThreatCategory(0, res.saarFindingDOList[0].findingType,res.saarFindingDOList[0].vid);
            this.prefillVulnrDtls(0, res.saarFindingDOList[0].vid);
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['resolution'].reset({ value: res.saarFindingDOList[0].resolution, disabled: this.getDisabledStatus() });
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['resolutionStatus'].reset({ value: res.saarFindingDOList[0].resolutionStatus, disabled: this.getDisabledStatus() });
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['tsr'].reset({ value: res.saarFindingDOList[0].tsr});
            this.saarForm.controls['saarFindingDOList']['controls'][0].controls['kcc'].reset({ value: ''});

        });
    }

    getDisabledStatus() {
        switch (this.SAARDetails.action) {
            case 'edit' :
                this.isDisabled = false;
                return this.isDisabled;
            case 'view' :
                this.isDisabled = true;
                return this.isDisabled;
            default : break;
        }
    }


    getVulnrTypes(index: number, tc: string) {
        this._saarFindingService.getThreatCategory(tc).subscribe(res => {
            this.vulnerabilityTypes[index] = res;
            // when findingtype is changed from dropdown reset impact,likely, mitigation, description
            this.mitigationList = [];
            this.tsrList = [];
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['impact'].reset('');
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['likely'].reset('');
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['description'].reset('');
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['vtInfo'].reset('');
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['mitigation'].reset('');
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['mitgatnPopover'].reset('');
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['tsr'].reset('');
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['kcc'].reset('');
        });
    }
    getThreatCategory(index: number, tc: string, vid?: number) {
        this._saarFindingService.getThreatCategory(tc).subscribe(res => {
            this.vulnerabilityTypes[index] = res;
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['vid'].reset(vid || null);
        });
    }
    prefillVulnrDtls(index: number, vid: number, vt?: any) {
        this._saarFindingService.getVulnerabilityDtls(vid).subscribe(res => {
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['impact'].reset(res.impact);
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['likely'].reset(res.likely);
            this.vulnerabilityTypes[index].forEach(q => {
                if (q.vid === vid) {
                    this.saarForm.controls['saarFindingDOList']['controls'][index].controls['vtInfo'].reset(q.description);
                }
            });
            res.vulnerabilityMitigationDOList.forEach(q => {
                this.mitigationList.push(q);
                // commented for popover to model change
                // this.saarForm.controls['saarFindingDOList']['controls'][index].controls['mitgatnPopover'].reset(this.mitigationList.join(','));
            });
            res.vulnerabilityTSRDOList.forEach(t => {
                this.tsrList.push(t.tsrType + '-' + t.tsrNo);
                this.saarForm.controls['saarFindingDOList']['controls'][index].controls['tsr'].reset(this.tsrList.join(','));
            });
            this.saarForm.controls['saarFindingDOList']['controls'][index].controls['kcc'].reset('');
        });
    }

    getMitigations() {
      const dialogRef = this._dialog.open(SaarMitigationWizardComponent, {
        data: {
            mitigationList: this.mitigationList
        }
      });
    }

    generateArray(obj) {
        return Object.keys(obj).map((key) => {
            return obj[key];
        });
    }

    addFindings() {
        const control = <FormArray>this.saarForm.controls['saarFindingDOList'];
        control.push(this.initAddFindings());
    }

    removeFindings(i: number) {
        const control = <FormArray>this.saarForm.controls['saarFindingDOList'];
        control.removeAt(i);
    }
    submitFindings() {
        this.modalStepper = false;
        this.showProgess = true;
        this._saarFindingService.submitFindings(JSON.stringify(this.saarForm.value), this.SAARDetails).subscribe(res => {
            // this.saarFindingDetails = res;
            this.showProgess = false;
            this.modalStepper = false;
            this.submitSASucess = true;
        }, err => {
            this.showProgess = false;
            this.modalStepper = false;
            this.submitSASucess = false;
            this.errOnSubmit = true;
        });
    }
}

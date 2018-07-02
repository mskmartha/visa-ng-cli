import { Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { GlobalSharedService } from './shared.service';

@Injectable()
export class UtilsService {
    subscription: any;
    globalenums;
    constructor(private router: Router, private api: GlobalSharedService) {
        this.subscription    = this.api.getData('enums').subscribe( _enumsData => {
            this.globalenums = _enumsData;
        });
    }
    changeRoute(routeValue?: string) {
        this.router.navigate([routeValue]);
    }
    getFromSessionStorage() {
        if (!Array.isArray(this.globalenums) || !this.globalenums.length) {
            this.globalenums = JSON.parse(sessionStorage.getItem('enums'));
        }
        return this.globalenums;
    }

    metaDataTypes() {
        /*
        "metaDataTypes": {
            "1": "SA",
            "2": "SAT",
            "3": "SAAR",
            "4": "KCC",
            "5": "KCCP1",
            "6": "KCCP2",
            "7": "Unknown"
        },
        */
        return this.globalenums.metaDataTypes;
    }
    genericSeverityRatings() {
        const a = this.getFromSessionStorage();
        class KCCActnsModel {
            constructor(
                private id: string,
                private text: string,
            ) {}
        }
        const gsrList: KCCActnsModel[] = Object.getOwnPropertyNames(a.genericSeverityRatings)
        .map((key: string) => new KCCActnsModel(key, a.genericSeverityRatings[key]));

        return gsrList;
    }
    genericStates() {
        const colorCodes = [
            '#d3ddeb', // "0": ""
            '#2196f3', // "1": "Pending Triage"
            '#2196f3', // "2": ""
            '#2196f3', // "3": "In Progress"
            '#d3ddeb', // "4": "Abandoned"
            '#417505', // "5": "Completed"
            '#d3ddeb', // "6": "Error"
            '#417505', // "7": "Accepted"
            '#2196f3', // "8": "In Review"
            '#2196f3', // "9": "Need More Info"
            '#d3ddeb', // "10": "Not Started"
            '#F1C40F', // "11": "On Hold"
            '#d3ddeb', // "12: "Unknown"
            '#d3ddeb' // "13: "Pending Scoping"
        ];
        /*
        "genericStates": {
          "1": "Pending Triage",
          "3": "In Progress",
          "4": "Abandoned",
          "5": "Completed",
          "6": "Error",
          "7": "Accepted",
          "8": "In Review",
          "9": "Need More Info",
          "10": "Not Started",
          "11": "On Hold",
          "12": "Unknown",
          "13": "Pending Scoping"
        },
        */
        const a = this.getFromSessionStorage();
        class StatesModel {
            constructor(
                private label: string,
                private color: string,
            ) {}
        }
        const statesList: StatesModel[] = Object.getOwnPropertyNames(a.genericStates)
        .map((key: string) => new StatesModel(a.genericStates[key], colorCodes[key]));

        const statesMap: { [key: string]: StatesModel } = Object.getOwnPropertyNames(a.genericStates)
        .reduce((map: any, key: string) => {
            map[key] = new StatesModel(a.genericStates[key], colorCodes[key]);
            return map;
        }, {});
        return statesMap;
    }
    saActions() {
        // map with "saActions" in global enums
        const mdIcons = [
            '', // "0": ""
            'play_circle_filled', // "1": "Start Triage"
            'play_arrow', // "2": "Abandon"
            'visibility_off', // "3": "Clone"
            'find_in_page', // "4": "View Triage"
            'details', // "5": "Manage SA"
            'find_in_page', // "6": "Edit",
            'find_in_page', // "7": "View SA Workflow",
            'find_in_page', // "8": "Unknown"
            '', // 9
            '', // 10
            '', // 11
            '', // 12
            '', // 13
            '', // 14
            '', // 15
            '', // 16
            '', // 17
            '', // 18
            '', // 19
            'play_circle_filled', // "20": "Start Scoping"
            'find_in_page', // "21": "View Scoping"
            'find_in_page', // "22": "Edit Scoping",
            'find_in_page' // "23": "Edit Triage"
        ];
        const a = this.getFromSessionStorage();
        class SAActnsModel {
            constructor(
                private name: string,
                private mdIcon: string,
            ) {}
        }
        const saActnsList: SAActnsModel[] = Object.getOwnPropertyNames(a.saActions)
        .map((key: string) => new SAActnsModel(a.saActions[key], mdIcons[key]));

        const saActnsMap: { [key: string]: SAActnsModel } = Object.getOwnPropertyNames(a.saActions)
        .reduce((map: any, key: string) => {
            map[key] = new SAActnsModel(a.saActions[key], mdIcons[key]);
            return map;
        }, {});
        return saActnsMap;
    }
    kccActions() {
        const mdIcons = [
            '', // "0": ""
            'pause', // "1": "Pause"
            'play_arrow', // "2": "Resume"
            'visibility_off', // "3": "Abandon"
            'find_in_page', // "4": "View Triage"
            'details', // "5": "Manage KCC"
            'find_in_page', // "6": "View KCC"
            'info', // "7": "Need More Info"
            'check_circle', // "8": "Accept"
            'mode_edit', // "9": "Edit",
            'save', // "10": "Save",
            'rate_review', // "11": "In Review"
            'done', // "12": "Submit"
            'done_all', // "13": "Complete KCC"
            'find_in_page', // "14": "View Pre-PPR",
            'find_in_page', // "15": "View Pre-PIR"
        ];
        const a = this.getFromSessionStorage();
        class KCCActnsModel {
            constructor(
                private name: string,
                private mdIcon: string,
            ) {}
        }
        const kccActnsMap = new Map();
        for (let key in a.kccActions) {
            let val = a.kccActions[key];
            if (typeof val == "string")
            kccActnsMap.set(key, new KCCActnsModel(a.kccActions[key], mdIcons[key]));
        }
        return kccActnsMap;
    }
    getHttpHeader(res: any, header: string) {
        const headers = res.headers;
        return headers.get(header);
    }

    jsonToStrMap(jsonStr) {
      return this.objToStrMap(JSON.parse(jsonStr));
    }

    objToStrMap(obj) {
      const strMap = new Map();
      for (const k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
      }
      return strMap;
    }
}

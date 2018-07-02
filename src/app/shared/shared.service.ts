import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

export interface UsersData {
    uID: string;
}
export interface EnumsData {
    uID: string;
}
export interface PSSLData {
    uID: string;
}
export interface KCCData {
    uID: string;
}
export interface CSAData {
  uID: string;
}
@Injectable()
export class GlobalSharedService {
  psslData: Observable<PSSLData[]>;
  saModalClose: Observable<UsersData[]>;
  kccModalClose: Observable<UsersData[]>;
  csaModalClose: Observable<UsersData[]>;
  KCCP1: Observable<UsersData[]>;
  KCCP2: Observable<UsersData[]>;
  manageCsaUpdateTabStatus: Observable<any>;
  manageKccUpdateTabStatus: Observable<any>;
  resizeModal: Observable<any>;
  usersMap = new Map();
  statusMap = new Map();
  private _sharingData: BehaviorSubject<UsersData[]>;
  private _enumsData: BehaviorSubject<EnumsData[]>;
  private _psslData: BehaviorSubject<PSSLData[]>;
  private _kccData: BehaviorSubject<KCCData[]>;
  private _csaData: BehaviorSubject<CSAData[]>;
  private _manageCsaUpdateTabStatus: BehaviorSubject<any>;
  private _manageKccUpdateTabStatus: BehaviorSubject<any>;
  private _resizeModal: BehaviorSubject<any>;
  private dataStore: {
    sharingData: UsersData[],
    enumsData: EnumsData[],
    psslData: PSSLData[],
    kccData: KCCData[],
    csaData: CSAData[],
    manageCsaUpdateTabStatus: any,
    manageKccUpdateTabStatus: any,
    resizeModal: any,
    departmentsData: any
  };
  constructor() {
    this.dataStore = {
      sharingData: [],
      enumsData: [],
      psslData: [],
      kccData: [],
      csaData: [],
      manageCsaUpdateTabStatus: [],
      manageKccUpdateTabStatus: [],
      resizeModal: [],
      departmentsData: []
    };
    this._sharingData = <BehaviorSubject<UsersData[]>>new BehaviorSubject([]);
    this._enumsData = <BehaviorSubject<EnumsData[]>>new BehaviorSubject([]);
    this._psslData = <BehaviorSubject<PSSLData[]>>new BehaviorSubject([]);
    this._kccData = <BehaviorSubject<KCCData[]>>new BehaviorSubject([]);
    this._csaData = <BehaviorSubject<CSAData[]>>new BehaviorSubject([]);
    this._manageCsaUpdateTabStatus = <BehaviorSubject<any>>new BehaviorSubject([]);
    this._manageKccUpdateTabStatus = <BehaviorSubject<any>>new BehaviorSubject([]);
    this._resizeModal = <BehaviorSubject<any>>new BehaviorSubject([]);
  }

  saveData( item, data ) {
    if (item === 'userInfo') {
      this._sharingData.next(data);
    }
    if (item === 'users') {
      data.forEach((obj) => {
        this.usersMap.set(obj.id, obj.cn);
      });
    }
    if (item === 'enums') {
      this._enumsData.next(data);
      const statesList: GenericStates[] = Object.getOwnPropertyNames(data.genericStates)
        .map((key: string) => new GenericStates(parseInt(key, 10), data.genericStates[key]));
      statesList.forEach((obj) => {
        this.statusMap.set(obj.id, obj.value);
      });
    }
    if (item === 'pssl') {
      this._psslData.next(data);
    }
    if (item === 'kcc') {
      this._kccData.next(data);
    }
    if (item === 'csa') {
      this._csaData.next(data);
    }
    if (item === 'saModalClose') {
      this._csaData.next(data);
    }
    if (item === 'kccModalClose') {
      this._csaData.next(data);
    }
    if (item === 'csaModalClose') {
      this._csaData.next(data);
    }
    if (item === 'KCCP1') {
      this._csaData.next(data);
    }
    if (item === 'KCCP2') {
      this._csaData.next(data);
    }
    if (item === 'manageCsaUpdateTabStatus') {
      this._manageCsaUpdateTabStatus.next(data);
    }
    if (item === 'manageKccUpdateTabStatus') {
      this._manageCsaUpdateTabStatus.next(data);
    }
    if (item === 'resizeModal') {
      this._resizeModal.next(data);
    }
  }

  getData(item)  {
    if (item === 'userInfo') {
      return this._sharingData.asObservable();
    }
    if (item === 'enums') {
      return this._enumsData.asObservable();
    }
    if (item === 'pssl') {
      return this._psslData.asObservable();
    }
    if (item === 'kcc') {
      return this._kccData.asObservable();
    }
    if (item === 'csa') {
      return this._csaData.asObservable();
    }
    if (item === 'saModalClose') {
      if (this._csaData) {
        return this._csaData.asObservable();
      } else {
        this._csaData.next([]);
      }
    }
    if (item === 'kccModalClose') {
      if (this._csaData) {
        return this._csaData.asObservable();
      } else {
        this._csaData.next([]);
      }
    }
    if (item === 'csaModalClose') {
      if (this._csaData) {
        return this._csaData.asObservable();
      } else {
        this._csaData.next([]);
      }
    }
    if (item === 'KCCP1') {
      if (this._csaData) {
        return this._csaData.asObservable();
      } else {
        this._csaData.next([]);
      }
    }
    if (item === 'KCCP2') {
      if (this._csaData) {
        return this._csaData.asObservable();
      } else {
        this._csaData.next([]);
      }
    }
    if (item === 'manageCsaUpdateTabStatus') {
      if (this._manageCsaUpdateTabStatus) {
        return this._manageCsaUpdateTabStatus.asObservable();
      } else {
        this._manageCsaUpdateTabStatus.next([]);
      }
    }
    if (item === 'manageKccUpdateTabStatus') {
      if (this._manageCsaUpdateTabStatus) {
        return this._manageCsaUpdateTabStatus.asObservable();
      } else {
        this._manageCsaUpdateTabStatus.next([]);
      }
    }
    if (item === 'resizeModal') {
      if (this._resizeModal) {
        return this._resizeModal.asObservable();
      } else {
        this._resizeModal.next([]);
      }
    }
  }
  getUser(key: any) : string {
    if (this.usersMap.size !== 0) {
      return this.usersMap.get(parseInt(key, 10));
    } else {
      return 'Empty';
    }
  }
  getStatus(key: any) : string {
    if (this.statusMap.size !== 0) {
      return this.statusMap.get(parseInt(key, 10));
    } else {
      return 'Empty';
    }
  }

}
class GenericStates {
  constructor(public id: number, public value: string) {}
}

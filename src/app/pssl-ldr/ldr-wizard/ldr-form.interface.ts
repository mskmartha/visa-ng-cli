/**
 * Created by smartha on 6/14/17.
 */
export interface Customer {
    name: string;
    findings: Address[];
}

export interface Address {
    findingName: string;
    findingDesc: string;
    remediation: string;
    severity: string;
    componentName: string;
    findingStatus: string;
    findingComments: string;
}
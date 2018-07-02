import { TSRTypes } from './tsrTypes';

export class TSRGroups {
    tsrGroupId: number;
    tsrGroupName: string;
    tsrTypes: TSRTypes;

    constructor(data: any) {
        if (data) {
            this.tsrGroupId = data.id;
            this.tsrGroupName = data.name;
            this.tsrTypes = new TSRTypes(data.tsrTypes);
        }
    }
}

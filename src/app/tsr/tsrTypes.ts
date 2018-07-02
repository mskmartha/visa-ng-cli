export class TSRTypes {
    tsrTypeId: number;
    tsrTypeName: string;
    constructor(data: any) {
        if (data) {
            this.tsrTypeId = data.id;
            this.tsrTypeName = data.name;
        }
    }
}

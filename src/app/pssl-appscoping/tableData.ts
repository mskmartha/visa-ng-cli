export class TableData {
   constructor(
    public id : string,
    public key: string,
    public summary: string,
    public networkChanges: boolean,
    public authFlow: boolean,
    public dataFlow: boolean,
    public manualFeature: boolean,
    public severity: string,
    public comments: string,
    public newMF ?: boolean,
    public ranKey ?: string

   ){

   }
}
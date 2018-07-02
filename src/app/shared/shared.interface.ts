export interface ICustomBttns {
    buttonId: number;
    buttonTxt: string;
    action: number;
    class: string;
    canShow: boolean;
    enableOnFormDirty: boolean;
}
export interface IInjectData {
    isViewDisabled: boolean;
    id: string;
    formId: string;
    // submit button specific
    canShow: boolean;
    actionId: number;
    submitBtnlabel: string;

    teamId: number;
    stateId: number;
    customLabels: boolean;
    customBttns: ICustomBttns[];
}
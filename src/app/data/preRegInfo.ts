export interface PreRegInfo {
    mobileNo : string;
    stateId : string;
    action : number;
    status: number;
    message: string
}
export interface PreRegInfoResponse {
    voterInformation : PreRegInfo[];
}
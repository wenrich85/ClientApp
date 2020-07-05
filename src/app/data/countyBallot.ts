export interface CountyBallot {
    precintBallots: PrecintBallot[]
    electionDate : Date;
    isComplete : boolean;
    isApproved : boolean;
    creator: string;
    approver: string;
    lastModifiedDt: Date;
    approvalDate: Date;
}

export interface PrecintBallot {
    precintName: string;
    precintId: string;
    seats: Seat[]
}

export interface Seat {
    seatName: string;
    candidates: Candidate[]
}

export interface Candidate {
    candidateName: string;
    party: string;
}

export interface CompleteBallot{
    precintName: string;
    precintId: string;
    electionDate : Date;
    isComplete : boolean;
    isApproved : boolean;
    creator: string;
    approver: string;
    lastModifiedDt: Date;
    approvalDate: Date;
    seats: Seat[];
    county: string;
    state: string;
    status: number;
    message: string;  

}
import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CompleteBallot } from '../models/countyBallot';


@Injectable({
    providedIn: 'root'
})

export class BallotService{
    
    BASE_URL = 'https://e-vote-api.azurewebsites.net/api/Ballot/';

    private ballot :CompleteBallot;

    private ballotSubject = new Subject();

    ballots = this.ballotSubject.asObservable();

    constructor(private http: HttpClient){
    }


    async getBallot(electionDate, precinctId, role){
        let params = new URLSearchParams();
        params.append('precintID', precinctId );
        params.append('electionDate', electionDate);
        let headers = new HttpHeaders();

        let raw = {
            "electionDate": electionDate,
            "precintId": precinctId,
            "role": role,
       
        };
        
        await this.http.post<CompleteBallot>(this.BASE_URL+'Initiate', raw ).subscribe(response => {
            this.ballot = response
            this.ballotSubject.next(this.ballot)

        })
    }


    async saveBallot(ballot){

        // ballot.isComplete = true
        await this.http.post<CompleteBallot>(this.BASE_URL+'publish', ballot ).subscribe(response => {
            this.ballot = response
            console.log(response)
            this.ballotSubject.next(this.ballot)
    })
}

    async submitBallot(ballot){

        await this.http.post<CompleteBallot>(this.BASE_URL+'publish', ballot ).subscribe(response => {
            this.ballot = response
            console.log(response)
            this.ballotSubject.next(this.ballot)

         })
    }
}
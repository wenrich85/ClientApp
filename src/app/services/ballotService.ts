import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient,  } from '@angular/common/http';
import { Http } from '@angular/http';
import { CompleteBallot } from '../data/countyBallot';

@Injectable({
    providedIn: 'root'
})

export class BallotService{
    
    BASE_URL = 'http://localhost:5000/api';

    private ballot: CompleteBallot;

    private ballotSubject = new Subject();

    ballots = this.ballotSubject.asObservable();

    constructor(private http : Http){
        this.getBallot()
    }


    getBallot(){
        this.http.get(this.BASE_URL + '/Ballot/Initiate').subscribe(response => {
            this.ballot = response.json();
            this.ballotSubject.next(this.ballot)
        })
    }

    publishBallot(ballotSubmission: CompleteBallot){
        this.http.post(this.BASE_URL+ '/Ballot/Publish', ballotSubmission)
        .subscribe(response => {
            this.ballot = response.json();
            this.ballotSubject.next(this.ballot)
        })
    }
}
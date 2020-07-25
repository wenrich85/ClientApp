import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CompleteBallot, Seat, Candidate } from '../../models/countyBallot';
import { BallotService } from '../../services/ballotService';
import * as $ from 'jquery';
import 'bootstrap-notify'
import { VoterVerificationService } from 'app/services/voterVerificationService';

@Component({
    selector: 'ballot',
    templateUrl: 'ballot.component.html'
})
export class Ballot implements OnInit {
    ballot;
    public isVoting = false;
    public isCreator = false;
    public isApprover = false;

    voted = {
        "mobileNo": "string",
        "stateId": "string",
        "action": 0,
        "precintName": "string",
        "precintId": 0,
        "electionDate": 0,
        "votes": [

         ]}

    stageVotes= []

    voteSelction(vote){
        this.voted.votes.push(vote)

    }
    constructor(private formBuilder: FormBuilder, private router: Router, private ballotS: BallotService, private elRef: ElementRef, private vvs: VoterVerificationService) { }


    //Intialize the Canidate Array and Set the Precinct
    //Need to insert the Precinct from the user 
    ngOnInit() {  

        this.vvs.preRegistrant.subscribe(res =>
            {console.log(res)})
        //Decide if Voting Page      
        console.log(this.elRef.nativeElement.parentElement.nodeName);
        if (this.elRef.nativeElement.parentElement.nodeName === 'VOTE-CMP'){
            console.log("Voter Page");
            this.isVoting = true;
        }
        else if (this.elRef.nativeElement.parentElement.nodeName === 'BALLOT-COMPILER'){
            console.log("Ballot Creator Page");
            this.isCreator = true;
        }
        else{
            console.log("Ballot Approver Page");
            this.isApprover = true;
        }

        this.ballotS.ballots.subscribe(ballot => {
            this.ballot = ballot;
            console.log(this.ballot)
        })
        // this.populateTestDate();        
    }

    populateTestDate() {
        let c1: Candidate = {
            candidateName: "Black Cherry",
            party: "D"
        }

        let c2: Candidate = {
            candidateName: "Tangerine",
            party: "D"
        }

        let s1: Seat = {
            seatName: "Whiteclaw",
            candidates: []
        }

        s1.candidates.push(c1);
        s1.candidates.push(c2);

        let c3: Candidate = {
            candidateName: "Finn",
            party: "D"
        }

        let c4: Candidate = {
            candidateName: "Max",
            party: "D"
        }

        let s2: Seat = {
            seatName: "Goodest Boy",
            candidates: []
        }

        s2.candidates.push(c3);
        s2.candidates.push(c4);

        this.ballot = new CompleteBallot;
        this.ballot.seats = [];
        this.ballot.seats.push(s1)
        this.ballot.seats.push(s2)
        
    }

    //Get the Precinct - Later add routing to grad for the user
    getPrecinct() {
        return 'West Chester';
    }    

    stageVote(event, seatId, candidateId){

        if (!this.isVoting)
        {
            console.log("Not voting - Ignore User Clicks");
            return;
        }

        let voteSelection = {"seatID":seatId,"candidateId":candidateId}
       
        for (let i = 0; i < this.stageVotes.length; i++){
            // console.log(vote.seatID)
            let vote = this.stageVotes[i]
            if(vote.seatID === voteSelection.seatID){                
                if(vote.candidateId === voteSelection.candidateId){
                    this.unselectCandidate(i)
                    this.classToggler(voteSelection.candidateId)
                    console.log(this.stageVotes)
                    return;
                }
                this.replaceSeat(i, voteSelection)
                this.classToggler(voteSelection.candidateId)
                console.log(this.stageVotes)            
                return;
            }
        }
        this.stageVotes.push(voteSelection)
        this.classToggler(candidateId)  
        console.log(this.stageVotes)   
    }


    unselectCandidate(index){
        console.log("Unselect Canidate - No Replacement")
        this.stageVotes.splice(index, 1)
    }

    replaceSeat(index, vote){
        console.log("Previously Selected Candidate Replaced")
        this.classToggler(this.stageVotes[index].candidateId)
        this.stageVotes.splice(index,1)
        this.stageVotes.push(vote)
    }

    
    classToggler(id){
        var element = document.getElementById(id);
            element.classList.toggle("canidateSelector")
    }

    //User Submits thier Vote
    SubmitVote(){
        this.voted.votes = this.stageVotes
        console.log(this.voted)
        $[`notify`]({message: 'Ballot Submitted Successfully'}, {type: 'success'});  
        // this.router.navigate(["/authorize"]);//Send Back to the Authorize Page 

    }

    //Save the Current Ballot to the DB - Creator
    SaveBallot() {
        $[`notify`]({message: 'Ballot Saved Successfully'}, {type: 'success'});
        // this.ballotS.saveBallot(this.voted)
        this.ballot.status=7005;
        this.ballotS.saveBallot(this.ballot)
        // this.router.navigate(["/authorize"]);//Send home
    }

    //Send the Current Ballot for Approval - Creator
    Approval() {
        $[`notify`]({message: 'Ballot Submitted for Approval'}, {type: 'success'});
        this.ballot.status=7005;
        this.ballot.isComplete = true
        this.ballotS.saveBallot(this.ballot)
        // this.router.navigate(["/authorize"]);
      
    }

    //Save the Current Ballot to the DB - Ballot Builder
    ApproveBallot() {
        $[`notify`]({message: 'Ballot Approved'}, {type: 'success'});
        //this.router.navigate(["/authorize"]);//Send Somewhere?
    }

    //Send the Current Ballot for Approval - Ballot Builder
    RejectBallot() {
        $[`notify`]({message: 'Ballot Rejected'}, {type: 'danger'});
        //this.router.navigate(["/authorize"]);//Send Somewhere?
    }


}

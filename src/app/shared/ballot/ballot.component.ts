import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'ballot',
    templateUrl: 'ballot.component.html'
})

export class Ballot implements OnInit {

    ballotViewForm: FormGroup;

    public displayPresidents = false;
    public displaySenators = false;
    public displayHouse = false;
    public displayGovernors = false;
    public displayStateSenators = false;
    public displayStateHouse = false;
    public displayMayors = false

    constructor(private formBuilder: FormBuilder, private router: Router) { }

    //Intialize the Canidate Array and Set the Precinct
    //Need to insert the Precinct from the user 
    ngOnInit() {
        this.ballotViewForm = this.formBuilder.group({
            Precinct: [this.getPrecinct(), Validators.required],
            presidentialCanidates: new FormArray([]),
            senatorialCanidates: new FormArray([]),
            houseCanidates: new FormArray([]),
            governorCanidates: new FormArray([]),
            stateSenatorialCanidates: new FormArray([]),
            stateHoueseCanidates: new FormArray([]),
            mayoralCanidates: new FormArray([])
        });

        this.addCanidatetoBallot('President', 'Donald Trump', 'Republican');
        this.addCanidatetoBallot('President', 'Joe Biden', 'Democrat');

        this.addCanidatetoBallot('Senator', 'Senator 1', 'Republican');
        this.addCanidatetoBallot('Senator', 'Senator 2', 'Democrat');

        this.addCanidatetoBallot('House', 'House 1', 'Republican');
        this.addCanidatetoBallot('House', 'House 2', 'Democrat');

        this.addCanidatetoBallot('Governor', 'Governor 1', 'Republican');
        this.addCanidatetoBallot('Governor', 'Governor 2', 'Democrat');

        this.addCanidatetoBallot('State Senator', 'State Senator 1', 'Republican');
        this.addCanidatetoBallot('State Senator', 'State Senator 2', 'Democrat');

        this.addCanidatetoBallot('State House', 'State House 1', 'Republican');
        this.addCanidatetoBallot('State House', 'State House 2', 'Democrat');

        this.addCanidatetoBallot('Mayor', 'Mayor 1', 'Republican');
        this.addCanidatetoBallot('Mayor', 'Mayor 2', 'Democrat');
    }




    //Add the Canidates to the List
    addCanidatetoBallot(Seat: String, CanidateName: String, Party: String) {
        switch (Seat) {

            case 'President':
                this.presidentialCanidates.push(this.formBuilder.group({
                    candidateName: [CanidateName, Validators.required],
                    party: [Party, [Validators.required]]
                }));
                this.displayPresidents = true;
                break;

            case 'Senator':
                this.senatorialCanidates.push(this.formBuilder.group({
                    candidateName: [CanidateName, Validators.required],
                    party: [Party, [Validators.required]]
                }));
                this.displaySenators = true;
                break;

            case 'House':
                this.houseCanidates.push(this.formBuilder.group({
                    candidateName: [CanidateName, Validators.required],
                    party: [Party, [Validators.required]]
                }));
                this.displayHouse = true;
                break;

            case 'Governor':
                this.governorCanidates.push(this.formBuilder.group({
                    candidateName: [CanidateName, Validators.required],
                    party: [Party, [Validators.required]]
                }));
                this.displayGovernors = true;
                break;

            case 'State Senator':
                this.stateSenatorialCanidates.push(this.formBuilder.group({
                    candidateName: [CanidateName, Validators.required],
                    party: [Party, [Validators.required]]
                }));
                this.displayStateSenators = true;
                break;

            case 'State House':
                this.stateHoueseCanidates.push(this.formBuilder.group({
                    candidateName: [CanidateName, Validators.required],
                    party: [Party, [Validators.required]]
                }));
                this.displayStateHouse = true;
                break;

            case 'Mayor':
                this.mayoralCanidates.push(this.formBuilder.group({
                    candidateName: [CanidateName, Validators.required],
                    party: [Party, [Validators.required]]
                }));
                this.displayMayors = true;
                break;

        }
    }

    get presidentialCanidates() { return this.ballotViewForm.controls.presidentialCanidates as FormArray; }
    get senatorialCanidates() { return this.ballotViewForm.controls.senatorialCanidates as FormArray; }
    get houseCanidates() { return this.ballotViewForm.controls.houseCanidates as FormArray; }
    get governorCanidates() { return this.ballotViewForm.controls.governorCanidates as FormArray; }
    get stateSenatorialCanidates() { return this.ballotViewForm.controls.stateSenatorialCanidates as FormArray; }
    get stateHoueseCanidates() { return this.ballotViewForm.controls.stateHoueseCanidates as FormArray; }
    get mayoralCanidates() { return this.ballotViewForm.controls.mayoralCanidates as FormArray; }


    //Get the Precinct - Later add routing to grad for the user
    getPrecinct() {
        return 'West Chester';
    }

    //Save the Current Ballot to the DB
    Save() {

        
        alert("Save Button");
    }

    //Send the Current Ballot for Approval
    Approval() {
        alert("Approval Button");
    }

}
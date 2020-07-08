import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'ballot-builder',
    templateUrl: './ballotbuilder.component.html',
})

export class BallotBuilder implements OnInit {
    ballotForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.ballotForm = this.formBuilder.group({
            seatName:  ['', Validators.required],
            candidates: new FormArray([
            ])
        });

        this.onAddCandidate();
    }

    get candidates() { return this.ballotForm.controls.candidates as FormArray; }

    onAddCandidate(){
        this.candidates.push(this.formBuilder.group({
            candidateName: ['', Validators.required],
            party: ['', [Validators.required]]
        }));
    }

    onReset(){
        this.ballotForm.reset();
        this.candidates.clear();
        this.onAddCandidate();
    }

    onSubmit(){
        console.log("hello there")
    }
}

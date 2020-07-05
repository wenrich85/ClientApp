import { Component, Output, EventEmitter } from '@angular/core'
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { VoterVerificationService } from 'app/services/voterVerificationService';
import { PreRegInfo } from 'app/data/preRegInfo';
import * as $ from 'jquery';
import 'bootstrap-notify'

@Component({
    selector: 'voter-verification',
    templateUrl: './voterVerification.component.html'
})

export class VoterVerification {
    constructor(private fb: FormBuilder, private vvs: VoterVerificationService) { }
    @Output('voterIsRegistered') voterIsRegistered: EventEmitter<PreRegInfo> = new EventEmitter();

    voterVerificationForm = this.fb.group({
        phoneNumber: ['', Validators.required],
        stateId: ['', Validators.required],
        recaptcha: [null, Validators.required]
    });

    preReg: PreRegInfo;
    showRequiredMessage: boolean = false;

    siteKey = "6Lc6kwEVAAAAABYqeOkugVG2usNCwFh340PkZGUH"

    //Drivers license Formatting. Do we need Custom Validation for each state?
    //https://ntsi.com/drivers-license-format/
    isFieldValid(field: string) {
        return !this.voterVerificationForm.get(field).valid && this.voterVerificationForm.get(field).touched;
    }

    onSubmit() {
        console.log(this.voterVerificationForm.value.phoneNumber);

        if (!this.voterVerificationForm.valid) {
            Object.keys(this.voterVerificationForm.controls).forEach(field => {
                const control = this.voterVerificationForm.get(field);
                control.markAsTouched({ onlySelf: true });

            });
            $[`notify`]({
                // options
                message: 'Oops. Please fill in all fields correctly' 
            },{
                // settings
                type: 'danger'
            });

            this. showRequiredMessage = true;
            return;
        }
        
        this.preReg= {
            mobileNo:this.voterVerificationForm.value.phoneNumber,
            stateId: this.voterVerificationForm.value.stateId,
            action: 5003,
            status: 0,
            message:null

        }

        this.vvs.getPreRegInfo(this.preReg)
            .subscribe(pre => {
                this.voterIsRegistered.emit(pre);
            })

   

        //Call Service HERE
        //If successful call the voterIsRegistered() parent method like seen below. 
        //If invalid display error message on front end: "Your information was invalid. Please try again."

    }


}

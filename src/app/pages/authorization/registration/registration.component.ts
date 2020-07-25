import { Component, Output, EventEmitter, Input } from '@angular/core'
import { FormBuilder, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionDemographics, QuestionResponse } from 'app/models/questionResponse';
import { VoterVerificationService } from '../../../services/voterVerificationService';
import { map } from 'rxjs/operators';
import { PreRegInfo } from 'app/models/preRegInfo';
import * as $ from 'jquery';
import 'bootstrap-notify'

@Component({
    selector: 'registration',
    templateUrl: './registration.component.html'
})



export class RegistrationComponent {
    constructor(private fb: FormBuilder, private router: Router, private vvs: VoterVerificationService, public activatedRoute: ActivatedRoute) { }
    @Output('displayVoterRegistration') displayVoterRegistration: EventEmitter<QuestionResponse> = new EventEmitter<QuestionResponse>();
    @Input() questions: QuestionResponse

    preRegInfo: any

    mobile = ''

    ngOnInit() {
        //  this.displayForm = true;
        // this.displayQuestions = false;
        // console.log(this.router.events.pipe(
        //     filter(e => e instanceof NavigationState).
        //     map(() => this.router.getCurrentNavigation().extras.state)
        // ))

        this.activatedRoute.paramMap
            .pipe(map(() => window.history.state))
            .subscribe(res => this.preRegInfo = res)
        console.log(this.mobile = this.preRegInfo["mobileNo"])

    }

    getPhone() {

        this.activatedRoute.paramMap
            .pipe(map(() => window.history.state))
            .subscribe(res => this.preRegInfo = res)
        return this.preRegInfo["mobileNo"]
    }
    stateId() {

        this.activatedRoute.paramMap
            .pipe(map(() => window.history.state))
            .subscribe(res => this.preRegInfo = res)
        return this.preRegInfo["stateId"]
    }

    registrationVerificationForm = this.fb.group({
        mNumber: [this.getPhone(), Validators.required],
        idNumber: [this.stateId(), Validators.required],        
        ssn: ['', Validators.required],
        dob: ['', Validators.required],
        county: ['', Validators.required],
        fName: ['', Validators.required],
        lName: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],

    });
    public displayForm = true
    public displayQuestions = false

    showQuestions() {
        this.displayQuestions = true
        this.displayForm = false
    }

    isFieldValid(field: string) {
        return !this.registrationVerificationForm.get(field).valid && this.registrationVerificationForm.get(field).touched;
    }

    onSubmit() {

        if (!this.registrationVerificationForm.valid) {
            Object.keys(this.registrationVerificationForm.controls).forEach(field => {
                const control = this.registrationVerificationForm.get(field);
                control.markAsTouched({ onlySelf: true });

                //Display the Input Error Message to the User
                this.displayInputErrorMessage(control);
            });
            return;

        }

        let qd: QuestionDemographics = {
            firstName: this.registrationVerificationForm.value.fName,
            lastName: this.registrationVerificationForm.value.lName,
            middleName: "",
            action: 5005,
            mobileNo: this.registrationVerificationForm.value.mNumber,
            stateId: this.registrationVerificationForm.value.idNumber,
            streetAddress: this.registrationVerificationForm.value.address,
            city: this.registrationVerificationForm.value.city,
            county: this.registrationVerificationForm.value.county,
            state: this.registrationVerificationForm.value.state,
            zip: this.registrationVerificationForm.value.zip,
            dob: this.registrationVerificationForm.value.dob,
            ssn: this.registrationVerificationForm.value.ssn,
            // ssn: '123456987'
        }

        // console.log(qd)
        this.vvs.creditFile(qd)
        console.log('hello')
        this.vvs.getQuestions()
            .subscribe(res => console.log(res))
        this.showQuestions()

        // )

        // console.log(test)


        //Send all the fields to the API to be entered into the database
        // alert("Everything was entered into the DB correclty");
        // this.router.navigate(["/authorize"])


    }

    //Display the Input Error Message to the User
    displayInputErrorMessage(control: AbstractControl) {
        //Valid Input - No Error Message
        if (control.valid && control.touched)
            return;

        //Input is not Valid, Display Error Message
        switch (control) {
            case this.registrationVerificationForm.controls.ssn:
                $[`notify`]({message: 'Please enter a valid 9-Digit Social Security Number'}, {type: 'danger'});
                break;

            case this.registrationVerificationForm.controls.dob:
                $[`notify`]({message: 'Please enter a valid Date of Birth'}, {type: 'danger'});
                break;

            case this.registrationVerificationForm.controls.county:
                $[`notify`]({ message: 'Please enter a valid County Name' }, { type: 'danger' });
                break;

            case this.registrationVerificationForm.controls.fName:
                $[`notify`]({ message: 'Please enter a valid First Name' }, { type: 'danger' });
                break;

            case this.registrationVerificationForm.controls.lName:
                $[`notify`]({ message: 'Please enter a valid Last Name' }, { type: 'danger' });
                break;

            case this.registrationVerificationForm.controls.address:
                $[`notify`]({ message: 'Please enter a valid Street Address' }, { type: 'danger' });
                break;

            case this.registrationVerificationForm.controls.city:
                $[`notify`]({ message: 'Please enter a valid City Name' }, { type: 'danger' });
                break;

            case this.registrationVerificationForm.controls.state:
                $[`notify`]({ message: 'Please enter a valid 2 letter state abbreviation' }, { type: 'danger' });
                break;

            case this.registrationVerificationForm.controls.zip:
                $[`notify`]({ message: 'Please enter a valid  5-Digit Zip Code' }, { type: 'danger' });
                break;           
        }

    }
}

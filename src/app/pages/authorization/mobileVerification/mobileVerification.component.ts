import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { PreRegInfo } from '../../../models/preRegInfo';
import { VoterVerificationService } from '../../../../app/services/voterVerificationService';

@Component({
    selector: 'mobile-verification',
    templateUrl: './mobileVerification.component.html'
})

export class MobileVerification implements OnInit {
    constructor(private fb: FormBuilder, private vvs: VoterVerificationService) { }
    @Output('mobileVerificationResponse') mobileVerificationResponse: EventEmitter<any> = new EventEmitter();
    @Input() prereg: PreRegInfo;

    OTPType = ''

    ngOnInit() {
        console.log(this.prereg.message)
        if (this.prereg.action === 6001) {
            this.OTPType = 'Mobile OTP'
        } else { this.OTPType = ' Mailed OTP' }
    }

    mobileVerificationForm = this.fb.group({
        mobileCode: ['', Validators.required]
    });

    onSubmit() {

        if (!this.mobileVerificationForm.valid) {
            return;
        }
        this.prereg.message = this.mobileVerificationForm.value.mobileCode
        this.prereg.action = 5001
        this.vvs.getPreRegInfo(this.prereg)
            .subscribe(res =>{
                this.prereg
            })
        console.log(this.prereg.status)
        switch (this.prereg.status) {
            case 1001:
                this.prereg.message = this.mobileVerificationForm.value.mobileCode
                this.prereg.action = 5001
                this.vvs.getPreRegInfo(this.prereg)
                    .subscribe(ans => {
                        console.log(ans)
                        this.mobileVerificationResponse.emit(ans);
                    })
                break;
            case 1002: //
                this.prereg.message = this.mobileVerificationForm.value.mobileCode
                this.prereg.action = 5002
                this.vvs.getPreRegInfo(this.prereg)
                    .subscribe(ans => {
                        this.mobileVerificationResponse.emit(ans);
                    })

        }
    }
}

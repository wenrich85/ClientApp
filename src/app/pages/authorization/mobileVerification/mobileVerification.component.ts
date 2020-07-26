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
    
    @Input() prereg;

    OTPType = ''

  ngOnInit() {



        console.log(this.prereg.message)
        if (this.prereg.action === 6001||this.prereg.action === 9001) {
            this.OTPType = 'Mobile OTP'
        } else { this.OTPType = ' Mailed OTP' }
        
    }

    mobileVerificationForm = this.fb.group({
        mobileCode: ['', Validators.required]
    });

    async onSubmit() {

        if (!this.mobileVerificationForm.valid) {
            return;
        }
        this.prereg.message = this.mobileVerificationForm.value.mobileCode
        this.mobileVerificationForm.reset()

        if(this.prereg.action === 6001||this.prereg.action === 9001)
        {
            this.prereg.action = 5001
            await this.vvs.getPreRegInfo(this.prereg)
                .subscribe(res =>
                    {
                        console.log(res)
                        if(res.action ===6002 || res.action === 9001){
                            this.prereg = res
                            console.log(res)
                            this.mobileVerificationResponse.emit()
                            return
                        }
                        
                    })
            
            return
        }else if(this.prereg.action === 6003)
        {
            this.prereg.action = 5002
            await this.vvs.getPreRegInfo(this.prereg)
                .subscribe(res => 
                    {
                            console.log(res);
                    })
            this.mobileVerificationResponse.emit(this.prereg) 

        }
             
    }
}

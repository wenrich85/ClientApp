import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { PreRegInfo } from '../../models/preRegInfo';
import { QuestionResponse } from 'app/models/questionResponse';
import * as $ from 'jquery';
import 'bootstrap-notify';
import { VoterVerificationService } from 'app/services/voterVerificationService';
import { ThrowStmt } from '@angular/compiler';


@Component({
    selector: 'authorization',
    templateUrl: './authorization.component.html'
})

export class Authorization implements OnInit{
    constructor(private router: Router, private vvs: VoterVerificationService) { }

    public displayVoterVerification = true;
    public displayMobileVerification = false;
    public displayFacialRecognition = false;
    public preReg;
    public mobPreReg: PreRegInfo;
    title = 'Authorization'

    
    

    async ngOnInit(){
       
        await this.vvs.preRegistrant
            .subscribe(res =>{
                this.preReg = res
                console.log(res)
            })
        if (!this.preReg){
            this.displayVoterVerification = true
        }

    }



    @ViewChild('alert', { static: true }) alert: ElementRef;

    closeAlert() {
        this.alert.nativeElement.classList.remove('show');
    }

    showAlert() {
        this.alert.nativeElement.classList.add('show');
    }


    questionRouter(response: QuestionResponse) {
        console.log(response.mobileNo)
    }

    errorNotifications(message: string) {
        $[`notify`]({

            message: message
        },
            {
                // settings
                type: 'danger'
            });
    }



    voterVerificationResponse(res) {
        if(res.action !== 5003)
        {   
            this.preReg = res
            this.checkStatusCode()
        }
        
    }

    mobileVerificationResponse(res) {
        console.log('res: '+res.action)
        console.log('preReg: '+this.preReg.action)
        if(res.action !== 5001)
        {      
            this.preReg = res
            console.log("test: " + this.preReg.action)
            this.checkStatusCode()
        }
    }

    facialRecognitionResponse(response) {
        this.checkStatusCode()
    }
  

   
    checkStatusCode(){
      
        let denialReasons = {
            1000: 'Your account is locked until '+this.preReg.message,
            1004: 'Our records indicate that you have voted. ',
            1006: 'Your account was not found.'
        }
        if(denialReasons[this.preReg.status]){
            this.clearDisplay()
            // this.displayVoterVerification = false
            this.title = denialReasons[this.preReg.status]
            return
        }
        this.checkActionCode()
    }

    routes=
    {
        reg:'/registration',
        vote:'/vote'
    }

    checkActionCode(){
        console.log(this.preReg.action)
        switch(this.preReg.action){
           
            case 6000:
                if(this.preReg.status === 1001){
                    this.router.navigateByUrl(this.routes.reg, { state: { mobileNo: this.preReg.mobileNo, stateId: this.preReg.stateId } })
                    break;
                }else if(this.preReg.status === 1003){
                    this.router.navigate([this.routes.vote])
                    break;
                }
                else if (this.preReg.status === 1002){
                    this.preReg.action = 6003
                    this.clearDisplay()
                    this.displayMobileVerification = true
                }
                this.title = "I cannot determine your status"
                break;
            case 6001:
                this.clearDisplay()
                this.displayMobileVerification =true
                break;
            case 6002:
                this.clearDisplay()
                this.displayFacialRecognition = true
                break;
            case 9001:
                this.otpErrorResponse()
                break;
            case 9003:
                this.otpErrorResponse()
                break;
           
                

        }
        
    }

    clearDisplay(){
        this.displayVoterVerification = false
        this.displayMobileVerification = false
        this.displayFacialRecognition = false
    }

    otpErrorResponse(){
                     
        if (typeof(this.preReg.message) === "string")
        {
            this.errorNotifications('OTP was incorrect you have used '+this.preReg.message+' of 3 attempts')
            this.displayMobileVerification = true
            return
        }
        this.errorNotifications('Your account is locked until '+this.preReg.message.toString()) 

    }
}

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
        console.log("Made it here")
        await this.vvs.preRegistrant
            .subscribe(res =>{
                this.preReg = res
                console.log(res)
            })
        if (!this.preReg){
            this.displayVoterVerification = true
        }

        


    }

    // voterIsRegistered(event) {
    //     this.displayVoterVerification = false;
    //     this.displayMobileVerification = true;
    //     return this.preReg = event
    // }

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



    voterVerificationResponse(response: PreRegInfo) {

        this.preReg 
        this.checkStatusCode()
        // this.preReg = response;
        // if(response.action === 6001){
        //     this.displayVoterVerification = false;
        //     this.displayMobileVerification = true;
        //     this.displayFacialRecognition = false;
        // } else {
        //     this.errorNotifications('Error please try again.' + response.message);
        // }
    }

    mobileVerificationResponse() {
        console.log("Made it")
        this.checkStatusCode()
    //     console.log(response)

    //     switch (response.status) {
    //         case 1000:
    //             this.router.navigate(['/authorize'])
    //             this.errorNotifications('Your account is locked please try again after ' + response.message);
    //             break;
    //         case 1001:
    //             this.preReg = response;
    //             this.displayVoterVerification = false;
    //             this.displayMobileVerification = false;
    //             this.displayFacialRecognition = true;
    //             return 
    //         case 1002:
    //             this.router.navigate(["/authorize"]);
    //             break;
    //         case 1003:
    //             this.preReg = response;
    //             this.displayVoterVerification = false;
    //             this.displayMobileVerification = false;
    //             this.displayFacialRecognition = true;
    //             break;
    //         case 1004:
    //             this.router.navigate(['/authorize'])
    //             this.errorNotifications('Our records indicate that you have already voted.');
    //             break;
    //         case 1005:
    //             this.errorNotifications('Your account was not found');

    //             break;
    //         case 1006:
    //             this.router.navigate(['/authorize'])
    //             this.errorNotifications('Please come in to the office to register');
    //             break;
    //         default:
    //             this.errorNotifications('Your account was not found');
    //             break;
    //     }
    }

    facialRecognitionResponse(response) {
        this.checkStatusCode()
    }
    //     if (response.action === 6000) {
    //         if (response.status === 1003) {
    //             switch (response.role) {
    //                 case 0:
    //                     this.router.navigate(["/vote"]);
    //                     break;
    //                 case 1:
    //                     this.router.navigate(["/ballot"]);
    //                     break;
    //                 case 2:
    //                     this.router.navigate(["/approve"]);
    //                     break;
    //                 default:
    //                     this.errorNotifications('Your account was not found');
    //                     this.router.navigate(['/authorize'])
    //                     break;
    //             }
    //         } else {

    //             this.router.navigateByUrl('/registration', { state: { mobileNo: response.mobileNo, stateId: response.stateId } })
    //         }
    //     } else {
    //         this.router.navigate(['/authorize'])
    //         this.errorNotifications('Facial Recognition Failure. Come in to the office to register.');
    //     }
    // }

    // registrationVerificationResponse(response: string) {
    //     alert('HELLO! ' + response);
    //     console.log(response)
    // }

   
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
                this.title = "I can not determine your status"
                break;
            case 6001:
                this.clearDisplay()
                this.displayMobileVerification =true
                break;
            case 6002:
                this.clearDisplay()
                this.displayFacialRecognition = true
                break;

        }
        
    }

    clearDisplay(){
        this.displayVoterVerification = false
        this.displayMobileVerification = false
        this.displayFacialRecognition = false
    }
}

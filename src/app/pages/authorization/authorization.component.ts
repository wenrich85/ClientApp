import { Component, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router';
import { PreRegInfo } from '../../../app/data/preRegInfo';
import { QuestionResponse } from 'app/data/questionResponse';
import * as $ from 'jquery';
import 'bootstrap-notify'

@Component({
    selector: 'authorization',
    templateUrl: './authorization.component.html'
})

export class Authorization {
    constructor(private router: Router) {}

    public displayVoterVerification = true;
    public displayMobileVerification = false;
    public displayRegistration = false;
    public preReg : PreRegInfo;
    public mobPreReg : PreRegInfo;

    voterIsRegistered(event){
        this.displayVoterVerification = false;
        this.displayMobileVerification = true;
        return this.preReg = event  
    }

    displayVoterRegistration(){
        this.displayVoterVerification = false;
        this.displayMobileVerification = false;
        this.displayRegistration = true;

    }

    @ViewChild('alert', { static: true }) alert: ElementRef;

    closeAlert() {
      this.alert.nativeElement.classList.remove('show');
    }

    showAlert(){
        this.alert.nativeElement.classList.add('show');
    }


    questionRouter(response: QuestionResponse){
        console.log(response.mobileNo)
    }

    errorNotifications(message:string){
        $[`notify`]({
            
            message: message
        },
        {
            // settings
            type: 'danger'
        });

    }
  


    

    mobileVerificationResponse(response: PreRegInfo){ 
        console.log(response)
        let el = document.getElementById('notification')
        switch(response.status){
            case 1000:
                this.router.navigate(['/authorize'])
                this.errorNotifications('Your account is locked please try again after '+ response.message);
                break;
            case 1001:
                if(response.action === 6002){
                    this.router.navigateByUrl('/registration',{state:{mobileNo:response.mobileNo, stateId:response.stateId }})
                    break;
                    }else if(response.action === 9001){
                    this.errorNotifications('You have entered '+response.message+ ' incorrect attempt(s)');
                    break;
                    }

                this.router.navigate(["/authorize"]);//mail in code view
                this.displayVoterVerification = false;
                this.displayMobileVerification = true;
                return this.preReg = response;
            case 1002:
                this.router.navigate(["/authorize"]);
                break;
            case 1003:
                // if()
                this.router.navigate(["/vote"]);
                break;
            case 1004:
                this.router.navigate(['/authorize'])
                this.errorNotifications('Our records indicate that you have already voted.');
                break;
            case 1005:
                this.errorNotifications('Your account was not found');

                break;
            case 1006:
                this.router.navigate(['/authorize'])
                this.errorNotifications('Please come in to the office to register');
                break;
            default:
                this.errorNotifications('Your account was not found');
                break;





        }

        //If Else or Switch statement some like
        // if(response == "Voted"){
        //     this.router.navigate(['/voted'])
        // }
        //We need to add components for the next steps and add their routes.
        //Compoents needed are a 'Pre-Register', 'Register', 'Vote', 'Already Voted'
        //Depending on response in method call redirect to the necessary component.
    }

    registrationVerificationResponse(response: string){ 
        alert('HELLO! ' + response);
        console.log(response)
    }


}

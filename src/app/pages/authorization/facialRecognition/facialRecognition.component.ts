import { Component, ElementRef, OnInit, Output, Renderer2, ViewChild, Input, EventEmitter } from '@angular/core';
import { FacialRecognitionService } from '../../../services/facialRecognition.service';
import { FacialRecognitionResponse } from 'app/models/face.model';
import { FaceVerification } from 'app/models/faceVerification.model';
import { PreRegInfo } from '../../../models/preRegInfo';
import { VoterVerificationService } from '../../../../app/services/voterVerificationService';
import * as $ from 'jquery';
import 'bootstrap-notify';

@Component({
    selector: 'facial-recognition',
    templateUrl: './facialRecognition.component.html'
})

export class FacialRecognition implements OnInit {
    @Input() preReg: PreRegInfo;
    @Output('facialRecognitionResponse') facialRecognitionResponse: EventEmitter<any> = new EventEmitter();
    @ViewChild('video', { static: true }) videoElement: ElementRef;
    @ViewChild('canvas', { static: true }) canvas: ElementRef;

    imageString = '';
    facialResponse: FacialRecognitionResponse;
    cognitiveServiceCount = 0;

    videoWidth = 0;
    videoHeight = 0;
    constraints = {
        video: {
            facingMode: "environment",
            width: { ideal: 4096 },
            height: { ideal: 2160 }
        }
    };

    constructor(private renderer: Renderer2, private faceService: FacialRecognitionService, private vvs: VoterVerificationService) { }

    ngOnInit() {
        this.startCamera();
    }

    startCamera() {
        if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
        } else {
            this.errorNotifications("Sorry, camera not available.");
        }
    }

    attachVideo(stream) {
        this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
        this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
            this.videoHeight = this.videoElement.nativeElement.videoHeight;
            this.videoWidth = this.videoElement.nativeElement.videoWidth;
        });
    }

    capture() {
        this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
        this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
        this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    }

    submit() {
        if (this.cognitiveServiceCount == 3) {
            this.clear()
            this.errorNotifications("Max attempts tried.");
            this.preReg.action = 9999;
            this.facialRecognitionResponse.emit(this.preReg);
            return;
        }

        var canvasElement = this.canvas.nativeElement as HTMLCanvasElement
        this.imageString = canvasElement.toDataURL('image/png');
        this.clear();
        this.cognitiveServiceCount = this.cognitiveServiceCount + 1;

        this.faceService.scanImage(this.imageString).subscribe(res => {
            this.facialResponse = res as FacialRecognitionResponse;

            if (!this.facialResponse[0]) {
                console.log("0 IDs")
                this.errorNotifications("Invalid photo please try again.");
                return;
            } else if (this.facialResponse[1]) {
                console.log("Multiple IDs")
                this.errorNotifications("More than one face was in the photo please try again.");
                return;
            } else {
                this.preReg.action = 5006;
                this.vvs.getPreRegInfo(this.preReg)
                    .subscribe(resp => {
                        this.preReg = resp;
                        console.log(this.preReg)

                        if (this.preReg.action == 6000) {
                            if (this.preReg.message) {
                                //Face ID Exists in DB
                                //Call Verify within Cognitive Services and handle response. 
                                console.log("VERIFY USER")
                                this.faceService.verifyUserFace(this.facialResponse[0].faceId, this.preReg.message).then(resp => {
                                    let verifyResp: FaceVerification = JSON.parse(resp);

                                    if (verifyResp.isIdentical) {
                                        console.log("ACCESS GRANTED")
                                        this.facialRecognitionResponse.emit(this.preReg);
                                    } else {
                                        console.log("ACCESS DENIED")
                                        this.errorNotifications("Facial Recognition Services did not match what is on record. Please try again.");
                                        return;
                                    }
                                });
                            } else { //User Face ID does not exists save to DB
                                console.log("SAVE USER")
                                this.preReg.action = 5007;
                                this.preReg.message = this.facialResponse[0].faceId;
                                this.vvs.getPreRegInfo(this.preReg)
                                    .subscribe(resp => {
                                        if(this.preReg.action === 6000){
                                            this.facialRecognitionResponse.emit(this.preReg);
                                            console.log(resp)
                                        }
                                        

                                        
                                    });
                            }
                        } else {
                            //Request Failed
                            this.errorNotifications("Server Error. Try again");
                            return;
                        }
                    })
            }
        });
    }



    clear() {
        this.canvas.nativeElement.getContext('2d').clearRect(0, 0, this.videoWidth, this.videoHeight);
    }

    handleError(error) {
        console.log('Error: ', error);
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
}

import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { Page } from "ui/page";
import { View } from "ui/core/view";
import { Animation, AnimationDefinition } from "ui/animation";
import * as enums from "ui/enums";
import { CouchbaseService } from '../services/couchbase.service';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    Information: View;
    formReserve: View;
    showInfo: boolean = false;
    reserve: Array<any> = [];
    docId: string = 'reservations';

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private page: Page,
        private modalService: ModalDialogService,
        private couchbaseService: CouchbaseService,
        private vcRef: ViewContainerRef) {
            super(changeDetectorRef);

            this.reservation = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });
    }

    ngOnInit() {
        
    }

    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text});
    }

    onSubmit() {   
        this.showInformation();

        let doc = this.couchbaseService.getDocument(this.docId);
        if( doc == null) {
            console.log('This is your first reservation');
            this.couchbaseService.createDocument({"reservations": []}, this.docId);
        }
        else {
            this.reserve = doc.reservations;
            this.reserve.push(this.reservation.value);
            this.couchbaseService.updateDocument(this.docId, {"reservations": this.reserve});
        }
    }

    showInformation() {
        this.Information = <View>this.page.getViewById<View>("information");
        this.formReserve = <View>this.page.getViewById<View>("formReserve");
        
        let definitions = new Array<AnimationDefinition>();

        let a1: AnimationDefinition = {
            target: this.formReserve,
            scale: { x: 1, y: 0 },
            opacity: 0,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a1);

        let a2: AnimationDefinition = {
            target: this.Information,
            scale: { x: 1, y: 1 },
            opacity: 1,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a2);

        let animationSet = new Animation(definitions);

        animationSet.play().then(() => {
            this.showInfo = true;
        })
        .catch((e) => {
            console.log(e.message);
        });
    }
    
}
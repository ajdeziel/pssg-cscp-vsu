import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { ApplicationType } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import * as _ from 'lodash';
import { CaseService } from "../../../services/case.service";
import { ContactService } from "../../../services/contact.service";

@Component({
    selector: 'app-vtf-case-information',
    templateUrl: './vtf-case-information.component.html',
    styleUrls: ['./vtf-case-information.component.scss'],
})
export class VTFCaseInformationComponent extends FormBase implements OnInit {
    @Input() lookupData: iLookupData;
    @Input() isDisabled: boolean = false;
    @Input() formType: ApplicationType;
    public form: FormGroup;

    isValid: boolean = false;
    didCheck: boolean = false;

    constructor(private controlContainer: ControlContainer,
        private caseService: CaseService,
        private contactService: ContactService,
    ) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);

        this.isValid = this.form.get('isValid').value;
        this.didCheck = this.form.get('didCheck').value;
        console.log("vtf case info component");
        console.log(this.form);
    }

    caseInfoChange() {
        let info = {
            caseNumber: this.form.get('vtfCaseNumber').value,
            firstName: this.form.get('firstName').value,
            lastName: this.form.get('lastName').value,
            birthDate: this.form.get('birthDate').value,
        }

        if (info && info.caseNumber && info.birthDate && info.firstName && info.lastName) {
            //validate
            console.log("TODO - validate info here!");
            this.isValid = true;
            this.didCheck = true;

            this.form.get('isValid').patchValue(this.isValid);
            this.form.get('didCheck').patchValue(this.didCheck);
        }
        else {
            //haven't filled in all fields
        }
    }

    getContactIdFromCase(caseNumber) {
        this.caseService.getCaseByCaseNumber(caseNumber).subscribe((caseRes: any) => {
            console.log("case res");
            console.log(caseRes);
            if (caseRes.value && caseRes.value.length > 0) {
                let contactId = caseRes.value[0]._customerid_value;
                console.log(contactId);
                if (contactId) {
                    this.getContact(contactId);
                }
            }
            else {
                this.clearVTFApplicant(this.form.parent);
            }
        }, (err) => {
            console.log(err);
        });
    }

    getContact(contactId) {
        this.contactService.getContact(contactId).subscribe((contactRes: any) => {
            console.log("contact res");
            console.log(contactRes);
            if (contactRes) {
                this.setVTFApplicant(contactRes, this.form.parent);
            }
            else {
                this.clearVTFApplicant(this.form.parent);
            }
        }, (err) => {
            console.log(err);
        });
    }
}
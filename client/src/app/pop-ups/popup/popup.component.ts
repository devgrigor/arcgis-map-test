import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DonationService} from "../../services/donation.service";
import {EnumService} from "../../services/enum.service";
import {HelperService} from "../../services/helper.service";
import {PlatformLocation} from '@angular/common';

@Component({
  selector: 'popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.css']
})

export class PopupComponent implements OnInit {
  baseUrl: any;
  finished: boolean;
  enums: any;
  error_message: any;
  private donationForm: any;

  donation: any = {};

  constructor(public form_builder: FormBuilder,
              public enumService: EnumService,
              public helperService: HelperService,
              public donationService: DonationService,
              public platformLocation: PlatformLocation) {

    this.baseUrl = (platformLocation as any).location.origin;

  }

  initValidation() {
    this.donationForm = this.form_builder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
      ])],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      antigen: ['', Validators.compose([Validators.required])],
      bloodGroup: ['', Validators.compose([Validators.required])],
      contactNumber: ['',
        Validators.compose([Validators.required,
          Validators.pattern(/^((00|\+)([0-9]{12}))$/i)
        ])],
    });
  }

  /**
   * Pseudo Constructor
   */
  ngOnInit() {
    this.initValidation();
    this.resetDonationWatcher();
    // Getting enums
    this.enumService
      .query()
      .subscribe((data: {antigen, bloodGroup}) => this.enums = data);

    // If we have a linkId in url getting the donation itself
    this.helperService.getLinkId()
      .subscribe(linkId => {
        if (!linkId) {
          return;
        }
        this.donationService
          .show({linkId: linkId})
          .subscribe(donation => {
              this.donation = donation;
            },
            err => {
              this.helperService.closePopUp();
            });
      });
  }

  /**
   * Validating the form
   * @returns {boolean}
   */
  validate() {
    const consrols = this.donationForm.controls;
    console.log(consrols);
    if (consrols.email.invalid) {
      this.error_message = 'Invalid field email';
      return false;
    }
    if (consrols.firstName.invalid) {
      this.error_message = 'Invalid field First Name';
      return false;
    }
    if (consrols.lastName.invalid) {
      this.error_message = 'Invalid field Last Name';
      return false;
    }
    if (consrols.contactNumber.invalid) {
      this.error_message = 'Invalid field Contact Number, should be 00 xxx xxx xxx xxx or + xxx xxx xxx xxx';
      return false;
    }
    if (consrols.antigen.invalid) {
      this.error_message = 'Choose one of antigens';
      return false;
    }
    if (consrols.bloodGroup.invalid) {
      this.error_message = 'Choose one of Blood Groups';
      return false;
    }
    for (let i in consrols.controls) {
      if (consrols.controls[i].invalid) {
        this.error_message = 'Invalid field ' + i;
        // To show errors one by one
        return false;
      }
    }
    this.error_message = '';
    return true;
  }


  /**
   * Storing donor
   */
  storeDonor() {
    if (!this.validate()) {
      return false;
    }
    this.storeDonorObservable()
      .subscribe(data => {
        this.donation = data;
        this.finished = true;
      });
  }

  /**
   * Storing donor
   * @returns any
   */
  storeDonorObservable() {
    const data = this.donation;
    if (data.linkId) {
      return this.donationService.update(data, {linkId: data.linkId})
    }

    data['geo'] = [this.helperService.coordinates.latitude, this.helperService.coordinates.longitude];
    return this.donationService.create(data)

  }

  delete() {
    this.donationService
      .remove({linkId: this.donation.linkId})
      .subscribe(() => this.helperService.closePopUp())
  }

  resetDonationWatcher() {
    this.helperService.resetDonationObservable
      .subscribe(() => {
        this.donation = {};
        this.finished = false;
      });
  }
}

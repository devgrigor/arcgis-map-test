import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject'


@Injectable()
export class HelperService {
  getLinkIdObservable: Subject<any>;
  resetDonationObservable = new Subject();
  linkId: any;
  popUpMode: any = {};
  coordinates: any = {};
  donation = {};

  getLinkId() {
    return this.getLinkIdObservable = new Subject();
  }

  /**
   * Open popup by name
   */
  openPopUp(linkId?) {
    this.popUpMode.title = 'Become a Donor';
    if (linkId) {
      this.popUpMode.title = 'Edit your donation';
    }
    this.getLinkIdObservable.next(linkId);
    this.popUpMode.show = true;
  }


  /**
   * Closing popup
   */
  closePopUp() {
    this.popUpMode.show = false;
    this.popUpMode.type = false;
    this.resetDonationObservable.next();
  }

  locationObservable() {
    const subject = new Subject();
    if (window.navigator && window.navigator.geolocation) {
      window.navigator
        .geolocation
        .getCurrentPosition(
          position => subject.next(position),
          error => {
            switch (error.code) {
              case 1:
                console.log('Permission Denied');
                break;
              case 2:
                console.log('Position Unavailable');
                break;
              case 3:
                console.log('Timeout');
                break;
            }
          });
    }
    return subject;
  }

}

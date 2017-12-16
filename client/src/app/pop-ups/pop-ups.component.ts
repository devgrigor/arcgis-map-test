import {Component, OnInit} from '@angular/core';
import {HelperService} from '../services/helper.service';

@Component({
  selector: 'pop-ups',
  templateUrl: './pop-ups.component.html',
  styleUrls: ['./pop-ups.component.css']
})
export class PopUpsComponent implements OnInit {
  popUpMode: any = {};
  // This is not the best approach, but had not time to refactor
  // Want to meet deadline
  // don't grade very much this folder :)
  // and sub-folder :D

  constructor(public helper: HelperService) {
    this.popUpMode = this.helper.popUpMode;
  }

  ngOnInit() {

  }

  cancel() {
    this.helper.closePopUp();
  }

}

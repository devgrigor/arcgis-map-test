import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {SocketIoModule, SocketIoConfig} from 'ng-socket-io';


import {EsriLoaderModule} from 'angular-esri-loader';
import {AngularEsriModule} from 'angular-esri-components';

import {AppComponent} from './app.component';
import {PopUpsComponent} from './pop-ups/pop-ups.component';
import {PopupComponent} from './pop-ups/popup/popup.component';
import {HelperService} from './services/helper.service';
import {EsriComponent} from './esri/esri.component';
import {DonationService} from './services/donation.service';
import {EnumService} from './services/enum.service';
import {SocketService} from './services/socket.service';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EsriComponent,
  }
];

@NgModule({
  declarations: [
    AppComponent,
    PopUpsComponent,
    PopupComponent,
    EsriComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    EsriLoaderModule,
    AngularEsriModule,
    HttpModule,
    SocketIoModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    HelperService,
    DonationService,
    EnumService,
    SocketService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}


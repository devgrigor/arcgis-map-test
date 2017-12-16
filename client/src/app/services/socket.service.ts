import {Injectable} from '@angular/core';
import {Socket} from 'ng-socket-io';
import {HttpClientService} from './http-client.service';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SocketService extends Socket {
  connectedSocket = new Subject();

  constructor() {
    super({
      url: HttpClientService.uri, options: {}
    });
    //Because someone Forgot that calls can be async (very angry face)
    this.on('connect', (data) => {
      this.connectedSocket.next()
    });
  }

  getNewDonations() {
    return this.connectedSocket
      .flatMap(event => this.fromEvent('donation:save'))
  }

  removedDonations() {
    return this.connectedSocket
      .flatMap(event => this.fromEvent('donation:remove'))
  }
}

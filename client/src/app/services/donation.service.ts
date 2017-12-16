import {Injectable} from '@angular/core';
import {HttpClientService} from "./http-client.service";
import {Http} from "@angular/http";

@Injectable()
export class DonationService extends HttpClientService {
  url: any = 'donations';

  constructor(public http: Http) {
    super(http);
  }

  show(queryParams = {}) {
    return this.get(this.url + '/:linkId', queryParams);
  }

  create(data: any, queryParams = {}) {
    return this.post(this.url, data, queryParams);
  }

  update(data: any, queryParams = {}) {
    return this.put(this.url + '/:linkId', data, queryParams);
  }

  remove(queryParams = {}) {
    return this.delete(this.url + '/:linkId', queryParams);
  }

}

import {Injectable} from '@angular/core';
import {HttpClientService} from "./http-client.service";
import {Http} from "@angular/http";

@Injectable()
export class EnumService extends HttpClientService {
  url: any = 'enums';

  constructor(public http: Http) {
    super(http);
  }

}

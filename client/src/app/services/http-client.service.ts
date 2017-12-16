import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable'
import * as _ from 'lodash'

@Injectable()
export class HttpClientService {
  userToken: any;
  url: any;
  static uri = 'http://localhost:9050';
  host: any = HttpClientService.uri + '/api/';


  /**
   * Constructor
   * @param {Http} http
   */
  constructor(public http: Http) {
    this.userToken = window.localStorage.getItem('user_token');
  }


  /**
   * Mapping values
   * @returns {(res) => Promise<any>}
   */
  protected mapJson() {
    return res => res.json();
  }


  getHeaders(additional: any = []) {
    let headers = new Headers();

    if (this.userToken) {
      headers.append('Authorization', 'Bearer ' + this.userToken);
    }

    // Adding aditional headers
    for (let i in additional) {
      headers.append(additional[i].name, additional[i].value);
    }

    return headers;
  }

  regex = /:(\w+)*/g;

  /**
   * Returns parametrized url
   * @param params
   * @param {string} url
   * @returns {string}
   */
  parametrizeUrl(params: any, url: string) {
    const urlParams = url.match(this.regex);
    for (let i in urlParams) {
      const urlParam = urlParams[i].replace(':', '');
      params[urlParam] = (params[urlParam] && '/' + params[urlParam]) || '';
      url = url.replace(`/:${urlParam}`, `${params[urlParam]}`);
    }
    return url;
  }

  catcher() {
    return e => {
      if (e.status === 401) {
        return Observable.throw('Unauthorized');
      }
    };
  }

  getQueryParams(params: any) {
    if (!params) {
      return '';
    }

    let query = '?';

    for (let i in params) {
      if (params[i] && _.isObject(params[i])) {
        query += `${i}=${JSON.stringify(params[i])}&`;
      } else {
        query += `${i}=${params[i]}&`;
      }
    }

    // Removing last &
    query = query.slice(0, -1);

    return query;
  }

  get(url: any, params = {}, additional: any = []) {
    const headers = this.getHeaders(additional);
    url = this.parametrizeUrl(params, url);
    params = this.getQueryParams(params);

    return this.http
      .get(this.host + url + params, {
        headers: headers
      })
      .map(this.mapJson())
      .catch(this.catcher());
  }

  post(url: any, data: any, params = {}, additional: any = []) {
    const headers = this.getHeaders(additional);
    url = this.parametrizeUrl(params, url);

    return this.http
      .post(this.host + url, data, {
        headers: headers
      })
      .map(this.mapJson())
      .catch(this.catcher());

  }

  put(url: any, data: any, params = {}, additional: any = []) {
    const headers = this.getHeaders(additional);
    url = this.parametrizeUrl(params, url);

    return this.http
      .put(this.host + url, data, {
        headers: headers
      })
      .map(this.mapJson())
      .catch(this.catcher());

  }

  delete(url: any, params = {}, additional: any = []) {
    const headers = this.getHeaders(additional);
    url = this.parametrizeUrl(params, url);

    return this.http
      .delete(this.host + url, {
        headers: headers
      })
      .map(this.mapJson())
      .catch(this.catcher());
  }

  setUserToken(token: any) {
    window.localStorage.setItem('user_token', token);
    this.userToken = token;
  }

  query(params: any = '', queryParams = {}) {
    return this.get(this.url + '/' + params, queryParams);
  }

  show(queryParams = {}) {
    return this.get(this.url + '/:_id', queryParams);
  }

  create(data: any, queryParams = {}) {
    return this.post(this.url, data, queryParams);
  }

  update(data: any, queryParams = {}) {
    return this.put(this.url + '/:_id', data, queryParams);
  }

  remove(queryParams = {}) {
    return this.delete(this.url + '/:_id', queryParams);
  }
}

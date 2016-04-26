///<reference path='../node_modules/angular2/typings/browser.d.ts'/>

import 'es6-shim';
import 'angular2/bundles/angular2-polyfills';
import 'rxjs/Rx';
// import 'ng2-bootstrap';
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './components/app/app.component';
import { HTTP_PROVIDERS, Http, Response } from 'angular2/http';
import {Injector} from 'angular2/core';
import {IResponse} from '../../commons/RamAPI';

const injector = Injector.resolveAndCreate([HTTP_PROVIDERS]);
const http = injector.get(Http);

// import {enableProdMode} from 'angular2/core';
// enableProdMode();

const url = '/api/1/Party/Identity/'+
sessionStorage.getItem('RAM_identity_value')+'/'+
sessionStorage.getItem('RAM_identity_type');

http.get(url)
.map((res:Response) => res.json())
.subscribe((res:IResponse<{_id:string}>) => {
  sessionStorage.setItem('RAM_identity_id', res.data._id);
  bootstrap(AppComponent,[]).catch(err => console.error(err));
});

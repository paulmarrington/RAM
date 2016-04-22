///<reference path='../node_modules/angular2/typings/browser.d.ts'/>

import 'es6-shim';
import 'angular2/bundles/angular2-polyfills';
import 'rxjs/Rx';
// import 'ng2-bootstrap';
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './components/app/app.component';

// import {enableProdMode} from 'angular2/core';
// enableProdMode();

bootstrap(AppComponent,[]).catch(err => console.error(err));

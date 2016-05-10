/// <reference path="../typings/browser.d.ts" />

import 'es6-shim';
import 'jquery';
import 'bootstrap';
import 'zone';
import 'reflect-metadata';
import 'rxjs/Rx';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app/app.component';
import 'ng2-bootstrap';

// enableProdMode();

bootstrap(AppComponent, []).catch(err => console.error(err));
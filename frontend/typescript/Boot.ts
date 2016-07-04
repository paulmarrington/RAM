/// <reference path="../typings/index.d.ts" />

import 'es6-shim';
import 'zone';
import 'reflect-metadata';
import 'rxjs/Rx';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app/app.component';
import 'ng2-bootstrap';
import {APP_ROUTER_PROVIDERS} from './routes';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

// enableProdMode();

bootstrap(AppComponent, [APP_ROUTER_PROVIDERS,
{ provide: LocationStrategy, useClass: HashLocationStrategy }]).catch(err => console.error(err));
/// <reference path="./_ClientTypes" />

import "jquery";
import "angular";
import "angular-ui-router";
import "angular-loading-bar";
import "angular-ui-router";
import "lodash";
import "restangular";
import "angular-bootstrap";

import ui = angular.ui;

import {HomeCtrl} from "./controllers/home/HomeCtrl";
import {Page1Ctrl} from "./controllers/page1/Page1Ctrl";
import {Page2Ctrl} from "./controllers/page2/Page2Ctrl";
import {FourOFourCtrl} from "./controllers/404/FourOFourCtrl";
import {LayoutCtrl} from "./controllers/LayoutCtrl";

type TemplateCache = { get(page: string): string };

let app = angular.module("ram", [
    "ui.router",
    "angular-loading-bar",
    "restangular",
    "ui.bootstrap",
    "templates"
]);

app.controller("LayoutCtrl", LayoutCtrl)
    .controller("Page1Ctrl", Page1Ctrl)
    .controller("Page2Ctrl", Page2Ctrl)
    .controller("HomeCtrl", HomeCtrl)
    .controller("404Ctrl", FourOFourCtrl)
    ;

app.config(($stateProvider: ui.IStateProvider,
    $urlRouterProvider: ui.IUrlRouterProvider): any => {
    $urlRouterProvider.otherwise("/404");

    $stateProvider.state("layout", {
        templateProvider: ($templateCache: TemplateCache) => $templateCache.get("layout.html"),
        controller: "LayoutCtrl"
    }).state("layout.page1", {
        templateProvider: ($templateCache: TemplateCache) => $templateCache.get("page1/index.html"),
        controller: "Page1Ctrl",
        url: "/page1/"
    }).state("layout.page2", {
        templateProvider: ($templateCache: TemplateCache) => $templateCache.get("page2/index.html"),
        controller: "Page2Ctrl",
        url: "/page2/"
    }).state("layout.404", {
        templateProvider: ($templateCache: TemplateCache) => $templateCache.get("404/index.html"),
        controller: "404Ctrl",
        url: "/404"
    }).state("layout.home", {
        templateProvider: ($templateCache: TemplateCache) => $templateCache.get("home/index.html"),
        controller: "HomeCtrl",
        url: ""
    });
});

import "js/templates";

angular.element(document).ready(function() {
  angular.bootstrap(document, [ "ram" ]);
});

export default app;
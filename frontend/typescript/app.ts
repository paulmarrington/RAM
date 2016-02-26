/// <reference path="_ClientTypes.ts" />

import {LayoutCtrl} from "./controllers/Layout.client.ctrl";
import {Page1Ctrl} from "./controllers/page1/Page1.client.ctrl";
import {Page2Ctrl} from "./controllers/page2/Page2.client.ctrl";
import {HomeCtrl} from "./controllers/home/Home.client.ctrl";
import {FourOFourCtrl} from "./controllers/404/FourOFour.client.ctrl";
import {IProvider} from "restangular";

export function Boot() {

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

    app.config(($stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider): any => {
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

    app.config((RestangularProvider: IProvider): any => {
        RestangularProvider.setBaseUrl("/api");
        RestangularProvider.addResponseInterceptor(
            (data:any,operation:string,model:string,url:any,response:any,deffered:any) => {
            return data["data"];
        });
    });

    angular.element(document).ready(function() {
        angular.bootstrap(document, ["ram"]);
    });
}


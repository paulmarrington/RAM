/// <reference path="_ClientTypes.ts" />

import {LayoutCtrl} from "./controllers/Layout.client.ctrl";
import {PartyCtrl} from "./controllers/party/Party.client.ctrl";
import {HomeCtrl} from "./controllers/home/Home.client.ctrl";
import {FourOFourCtrl} from "./controllers/404/FourOFour.client.ctrl";
import {IProvider} from "restangular";
import {RelationshipTableWidget} from "./widgets/RelationshipTable.widget";
import {RAMRestServices} from "./services/RAMRestServices.client";

export function Boot() {

    type TemplateCache = { get(page: string): string };

    let app = angular.module("ram", [
        "ui.router",
        "angular-loading-bar",
        "restangular",
        "ui.bootstrap",
        "templates"
    ]);

    app.service("RAMRestServices",RAMRestServices);

    app.controller("LayoutCtrl", LayoutCtrl)
        .controller("PartyCtrl", PartyCtrl)
        .controller("HomeCtrl", HomeCtrl)
        .controller("404Ctrl", FourOFourCtrl);

    app.directive("relationshipTable", RelationshipTableWidget.Factory());

    app.config(($stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider): any => {
        $urlRouterProvider.otherwise("/404");

        $stateProvider.state("layout", {
            templateProvider: ($templateCache: TemplateCache) => $templateCache.get("layout.html"),
            controller: "LayoutCtrl"
        }).state("layout.party", {
            templateProvider: ($templateCache: TemplateCache) => $templateCache.get("party/index.html"),
            controller: "PartyCtrl",
            url: "/party/:party"
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
            (data: any, operation: string, model: string, url: any, response: any, deffered: any) => {
                return data["data"];
            });
    });

    angular.element(document).ready(function() {
        angular.bootstrap(document, ["ram"]);
    });
}


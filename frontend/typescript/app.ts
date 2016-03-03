/// <reference path="_ClientTypes.ts" />

import {LayoutCtrl} from "./controllers/Layout.client.ctrl";
import {PartyListCtrl} from "./controllers/partyList/PartyList.client.ctrl";
import {PartyRelationsCtrl} from "./controllers/partyRelations/PartyRelations.client.ctrl";
import {HomeCtrl} from "./controllers/home/Home.client.ctrl";
import {FourOFourCtrl} from "./controllers/404/FourOFour.client.ctrl";
import {IProvider} from "restangular";
import {RelationshipTableWidget} from "./widgets/RelationshipTable.widget";

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
        .controller("PartyListCtrl", PartyListCtrl)
        .controller("PartyRelationsCtrl", PartyRelationsCtrl)
        .controller("HomeCtrl", HomeCtrl)
        .controller("404Ctrl", FourOFourCtrl);

    app.directive("relationshipTable", RelationshipTableWidget.Factory());

    app.config(($stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider): any => {
        $urlRouterProvider.otherwise("/404");

        $stateProvider.state("layout", {
            templateProvider: ($templateCache: TemplateCache) => $templateCache.get("layout.html"),
            controller: "LayoutCtrl"
        }).state("layout.partyList", {
            templateProvider: ($templateCache: TemplateCache) => $templateCache.get("partyList/index.html"),
            controller: "PartyListCtrl",
            url: "/party/:party"
        }).state("layout.partyRelations", {
            templateProvider: ($templateCache: TemplateCache) => $templateCache.get("partyRelations/index.html"),
            controller: "PartyRelationsCtrl",
            url: "/party/:party/relations"
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


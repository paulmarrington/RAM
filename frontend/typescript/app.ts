/// <reference path="_all.ts" />

namespace ram {
    import ui = angular.ui;

    let app = angular.module("ram", [
        "ui.router",
        "angular-loading-bar",
        "angular.filter",
        "restangular",
        "ui.bootstrap",
        "templates"
    ]);

    type TemplateCache = {get(page:string):string};

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
            templateProvider: ($templateCache: TemplateCache)=> $templateCache.get("layout.html"),
            controller: "LayoutCtrl"
        }).state("layout.page1", {
            templateProvider: ($templateCache: TemplateCache)=> $templateCache.get("page1/index.html"),
            controller: "Page1Ctrl",
            url: "/page1/"
        }).state("layout.page2", {
            templateProvider: ($templateCache: TemplateCache)=> $templateCache.get("page2/index.html"),
            controller: "Page2Ctrl",
            url: "/page2/"
        }).state("layout.404", {
            templateProvider: ($templateCache: TemplateCache)=> $templateCache.get("404/index.html"),
            controller: "404Ctrl",
            url: "/404"
        }).state("layout.home", {
            templateProvider: ($templateCache: TemplateCache)=> $templateCache.get("home/index.html"),
            controller: "HomeCtrl" ,
            url: ""
        });

    });
}
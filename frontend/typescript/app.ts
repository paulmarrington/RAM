/// <reference path="_all.ts" />

module ram {

    import ui = angular.ui;

    let app = angular.module("ram", [
        "ui.router",
        "angular-loading-bar",
        "angular.filter",
        "restangular",
        "templates"
    ]);

    app.controller("LayoutCtrl", LayoutCtrl)
        .controller("Page1Ctrl", Page1Ctrl)
        .controller("Page2Ctrl", Page2Ctrl);

    app.config(($stateProvider: ui.IStateProvider,
    $urlRouterProvider: ui.IUrlRouterProvider): any => {
        $urlRouterProvider.otherwise("/404.html");
        $stateProvider.state("layout", {
            templateProvider: ($templateCache: {get(page:string):string})=> $templateCache.get("layout.html"),
            controller: "LayoutCtrl"
        }).state("layout.page1", {
            templateProvider: ($templateCache: {get(page:string):string})=> $templateCache.get("page1/index.html"),
            controller: "Page1Ctrl"
        }).state("layout.page2", {
            templateProvider: ($templateCache: {get(page:string):string})=> $templateCache.get("page2/index.html"),
            controller: "Page2Ctrl"
        });
    });
}
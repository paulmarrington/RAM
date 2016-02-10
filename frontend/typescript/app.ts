/// <reference path="_all.ts" />

module ram {

    import ui = angular.ui;

    let app = angular.module("ram", [
        "ui.router",
        "angular-loading-bar",
        "angular.filter",
        "restangular"
    ]);

    app.controller("LayoutCtrl", LayoutCtrl)
        .controller("Page1Ctrl", Page1Ctrl)
        .controller("Page2Ctrl", Page2Ctrl);

    app.config(($stateProvider: ui.IStateProvider, $urlRouterProvider: ui.IUrlRouterProvider): any => {
        $urlRouterProvider.otherwise("/404.html");
        $stateProvider.state("layout", {
            templateUrl: "/views/layout.html",
            controller: "LayoutCtrl"
        }).state("layout.page1", {
            templateUrl: "/views/page1/index.html",
            controller: "Page1Ctrl"
        }).state("layout.page2", {
            templateUrl: "/views/page2/index.html",
            controller: "Page2Ctrl"
        });
    });
}
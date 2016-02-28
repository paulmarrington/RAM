/// <reference path="../../_ClientTypes.ts" />
import * as api from "../api/IRamScope";
import * as restNg from "restangular";

export class Page2Ctrl {
    public static $inject = [
        "$scope",
        "Restangular"
    ];

    constructor(
        private $scope: api.IRamScope, restAngualr:restNg.IService
    ) {
    }
}



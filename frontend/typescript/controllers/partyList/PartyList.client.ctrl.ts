/// <reference path="../../_ClientTypes.ts" />

import * as api from "../api/IRamScope";
import * as restNg from "restangular";


export interface IPartyListScope extends ng.IScope {

}

export class PartyListCtrl {
    public static $inject = [
        "$scope",
        "Restangular"
    ];

    constructor(private $scope: IPartyListScope, restAngualr: restNg.IService) {
    }
}

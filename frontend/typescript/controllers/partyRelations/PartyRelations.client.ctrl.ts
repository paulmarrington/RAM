/// <reference path="../../_ClientTypes.ts" />
import * as api from "../api/IRamScope";
import * as restNg from "restangular";

export interface IPartyRelationsScope extends ng.IScope {
    businessNames: Array<string>;
}

export class PartyRelationsCtrl {
    public static $inject = [
        "$scope",
        "Restangular"
    ];

    constructor(private $scope: IPartyRelationsScope, restAngualr: restNg.IService) {
        $scope.businessNames = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
    }
}



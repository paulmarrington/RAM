/// <reference path="../../_ClientTypes.ts" />

import * as api from "../api/IRamScope";
import * as enums from "../../commons/RamEnums";
import * as cApi from "../../commons/RamAPI";
import * as cUtils from "../../commons/RamUtils";
import * as restNg from "restangular";

export class HomeCtrl {
    public static $inject = [
        "$scope",
        "Restangular"
    ];

    constructor(
        private $scope: api.IRamScope, restNg: restNg.IService
    ) {
        $scope.helpers = cUtils.Helpers;
        let relations = restNg.all("relations");
        relations.one("123").getList().then((individual_business_authorisations: Array<cApi.IndividualBusinessAuthorisation>) => {
            $scope.individual_business_authorisations = individual_business_authorisations;
        });
    }
}

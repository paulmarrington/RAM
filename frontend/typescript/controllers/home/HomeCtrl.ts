/// <reference path="../../_ClientTypes" />

import * as api from "../api/IRamScope";
import * as enums from "../../commons/RamEnums";
import * as cApi from "../../commons/RamAPI";
import * as cUtils from "../../commons/RamUtils";

export class HomeCtrl {
    public static $inject = [
        "$scope"
    ];

    constructor(
        private $scope: api.IRamScope
    ) {
        $scope.helpers = cUtils.Helpers;
        $scope.individual_business_authorisations = [
            new cApi.IndividualBusinessAuthorisation(
                "Ted's Group",
                "22 2222 2222 22",
                new Date(),
                enums.AuthorisationStatus.Active,
                enums.AccessLevels.Associate
            ),
            new cApi.IndividualBusinessAuthorisation(
                "Ali's Group",
                "33 3333 3333 34",
                new Date(),
                enums.AuthorisationStatus.Active,
                enums.AccessLevels.Associate
            ),
        ];

    }
}

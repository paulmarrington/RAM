/// <reference path="../../_ClientTypes" />

import * as api from "../../interfaces/IRamScope";
import * as cApi from "../../commons/RamAPI";
import * as cUtil from "../../commons/RamUtils";
import * as cEnums from "../../commons/RamEnums";

export class HomeCtrl {
    public static $inject = [
        "$scope"
    ];

    constructor(
        private $scope:api.IRamScope
    ) {
        $scope.helpers = cUtil.Helpers;
        $scope.individual_business_authorisations = [
            new cApi.IndividualBusinessAuthorisation(
                "Ted's Group",
                "22 2222 2222 22",
                new Date(),
                cEnums.AuthorisationStatus.Active,
                cEnums.AccessLevels.Associate
            ),
            new cApi.IndividualBusinessAuthorisation(
                "Ali's Group",
                "33 3333 3333 34",
                new Date(),
                cEnums.AuthorisationStatus.Active,
                cEnums.AccessLevels.Associate
            ),
        ];

    }
}
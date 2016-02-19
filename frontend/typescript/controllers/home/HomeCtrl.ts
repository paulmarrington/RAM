/// <reference path="../../_ClientTypes" />

namespace ram {
    export class HomeCtrl {
        public static $inject = [
            "$scope"
        ];

        constructor(
            private $scope: IRamScope
        ) {
            $scope.helpers = Helpers;
            $scope.individual_business_authorisations = [
                new IndividualBusinessAuthorisation(
                    "Ted's Group",
                    "22 2222 2222 22",
                    new Date(),
                    ram.AuthorisationStatus.Active,
                    ram.AccessLevels.Associate
                ),
                new IndividualBusinessAuthorisation(
                    "Ali's Group",
                    "33 3333 3333 34",
                    new Date(),
                    ram.AuthorisationStatus.Active,
                    ram.AccessLevels.Associate
                ),
            ];

        }
    }
}
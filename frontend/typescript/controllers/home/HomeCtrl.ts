/// <reference path="../../_all.ts" />

namespace ram {
    export class HomeCtrl {
        public static $inject = [
            "$scope"
        ];

        constructor(
            private $scope: IRamScope
        ) {
            $scope.helpers = ram.Helpers;
            $scope.individual_business_authorisations = [
                new IndividualBusinessAuthorisation(
                    "Ted's Group",
                    "22 2222 2222 22",
                    new Date(),
                    AuthorisationStatus.Active,
                    AccessLevels.Associate
                ),
                new IndividualBusinessAuthorisation(
                    "Ali's Group",
                    "33 3333 3333 33",
                    new Date(),
                    AuthorisationStatus.Active,
                    AccessLevels.Associate
                ),
            ];

        }
    }
}
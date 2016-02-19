/// <reference path="../../_ClientTypes" />

namespace ram {
    export class FourOFourCtrl {
        public static $inject = [
            "$scope"
        ];

        constructor(
            private $scope: IRamScope
        ) {
        }
    }
}
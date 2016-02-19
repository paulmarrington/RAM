/// <reference path="../../_ClientTypes" />

namespace ram {
    export class Page1Ctrl {
        public static $inject = [
            "$scope"
        ];

        constructor(
            private $scope: IRamScope
        ) {
        }
    }
}
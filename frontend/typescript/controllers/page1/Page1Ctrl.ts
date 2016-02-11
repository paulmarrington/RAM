/// <reference path="../../_all.ts" />

module ram {
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
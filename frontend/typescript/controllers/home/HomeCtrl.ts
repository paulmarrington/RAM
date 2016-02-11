/// <reference path="../../_all.ts" />

namespace ram {
    export class HomeCtrl {
        public static $inject = [
            "$scope"
        ];

        constructor(
            private $scope: IRamScope
        ) {
        }
    }
}
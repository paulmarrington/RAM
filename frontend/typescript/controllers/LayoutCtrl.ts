/// <reference path="../_all.ts" />

module ram {
    export class LayoutCtrl {
        public static $inject = [
            "$scope"
        ];

        constructor(
            private $scope: IRamScope
        ) {
        }
    }
}
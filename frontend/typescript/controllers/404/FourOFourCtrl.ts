/// <reference path="../../_ClientTypes.ts" />

import * as api from "../api/IRamScope";

export class FourOFourCtrl {
    public static $inject = [
        "$scope"
    ];

    constructor(
        private $scope: api.IRamScope
    ) {
    }
}

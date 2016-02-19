/// <reference path="../../_ClientTypes" />

import * as api from "../../interfaces/IRamScope";

export class FourOFourCtrl {
    public static $inject = [
        "$scope"
    ];

    constructor(
        private $scope: api.IRamScope
    ) {
    }
}
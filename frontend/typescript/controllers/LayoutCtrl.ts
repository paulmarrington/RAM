/// <reference path="../_ClientTypes" />

import * as api from "../api/IRamScope";

export class LayoutCtrl {
    public static $inject = [
        "$scope"
    ];

    constructor(
        private $scope: api.IRamScope
    ) {
    }
}


/// <reference path="../_ClientTypes.ts" />

import * as api from "../api/IRamScope";
import * as enums from "../../commons/RamEnums";
import * as cApi from "../../commons/RamAPI";
import * as cUtils from "../../commons/RamUtils";

export interface RelationshipWidgetScope extends ng.IScope {
    Ctrl: RelationshipTableWidgetController;

    relation:

}

export class RelationshipTableWidget implements ng.IDirective {

    constructor(private $templateCache: { get(page: string): string }) {
        this.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            /*handle all your linking requirements here*/
        };
    }

    template() {
        return this.$templateCache.get("widgets/RelationshipTable.widget.html");
    }

    restrict = "E";
    controller = RelationshipTableWidgetController;
    controllerAs: string = "Ctrl";

    scope: { [key: string]: string } = {
        "relation": "@relation",
    };

    link: (scope: RelationshipWidgetScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

    static Factory(): any {
        const directive = ($templateCache: { get(page: string): string }) => {
            return new RelationshipTableWidget($templateCache);
        };
        directive["$inject"] = ["$templateCache"];
        return directive;
    }
}

export class RelationshipTableWidgetController {
    static $inject = ["$scope", "$element", "$attrs"];

    constructor(protected scope: RelationshipWidgetScope,
        protected element: ng.IAugmentedJQuery,
        protected attr: ng.IAttributes) {
    }

    handleAction() {
        this.scope.title = "clicked";
    }

}
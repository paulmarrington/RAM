/// <reference path="../_ClientTypes.ts" />
import * as cApi from "../../commons/RamAPI";
import * as cUtils from "../../commons/RamUtils";

export interface IRamScope extends ng.IScope {
    individual_business_authorisations: Array<cApi.IndividualBusinessAuthorisation>;
    helpers: cUtils.Helpers;
}
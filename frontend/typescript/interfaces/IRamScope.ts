/// <reference path="../_ClientTypes" />
import * as cApi from "../../commons/RamAPI";
import * as cUtil from "../../commons/RamUtils";

export interface IRamScope extends ng.IScope {
    individual_business_authorisations: Array<cApi.IndividualBusinessAuthorisation>;
    helpers: cUtil.Helpers;
}
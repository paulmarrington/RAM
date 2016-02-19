/// <reference path="../_ClientTypes" />

namespace ram {
    export interface IRamScope extends ng.IScope {
        individual_business_authorisations: Array<IndividualBusinessAuthorisation>;
        helpers: Helpers;
    }
}
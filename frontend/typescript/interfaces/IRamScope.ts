/// <reference path="../_all.ts" />

namespace ram {
    export interface IRamScope extends ng.IScope {
        individual_business_authorisations: Array<IndividualBusinessAuthorisation>;
        helpers: Helpers;
    }

    export class Helpers {
        static AuthorisationStatusNames(e: AuthorisationStatus): string {
            switch (e) {
                case AuthorisationStatus.Active:
                    return "Active";
                case AuthorisationStatus.NotActive:
                    return "Not Active";

                default:
                throw new Error(`Unknow authorisation value ${e}`);
            }
        }

        static AccessLevelNames(e: AccessLevels): string {
            switch (e) {
                case AccessLevels.NoAccess:
                    return "No Access";
                case AccessLevels.Associate:
                    return "Associate";
                case AccessLevels.Universal:
                    return "Universal";
                default:
                throw new Error(`Unknow accessLevel value ${e}`);
            }
        }

    }

    export class IndividualBusinessAuthorisation {
        constructor(
            public businessName: string,
            public abn: string,
            public activeOn: Date,
            public authorisationStatus: AuthorisationStatus,
            public accessLevel: AccessLevels,
            public expiresOn?: Date) {
        }
    }

}
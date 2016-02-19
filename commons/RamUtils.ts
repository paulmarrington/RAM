/// <reference path="RamAPI" />

module ram {
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

        static applyMixins(derivedCtor: any, baseCtors: any[]) {
            baseCtors.forEach(baseCtor => {
                Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                });
            });
        }
    }
}
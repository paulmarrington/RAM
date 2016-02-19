/// <reference path="RamAPI" />

import * as enums from "./RamEnums";

export class Helpers {
    static AuthorisationStatusNames(e: enums.AuthorisationStatus): string {
        switch (e) {
            case enums.AuthorisationStatus.Active:
                return "Active";
            case enums.AuthorisationStatus.NotActive:
                return "Not Active";

            default:
                throw new Error(`Unknow authorisation value ${e}`);
        }
    }

    static AccessLevelNames(e: enums.AccessLevels): string {
        switch (e) {
            case enums.AccessLevels.NoAccess:
                return "No Access";
            case enums.AccessLevels.Associate:
                return "Associate";
            case enums.AccessLevels.Universal:
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
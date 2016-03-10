/// <reference path="../_ClientTypes.ts" />
import * as cApi from "../../commons/RamAPI";
import * as cUtils from "../../commons/RamUtils";

export interface IRamScope extends ng.IScope {
    party: cApi.IParty;
    relationships: cApi.IRelationship[];
    roles:
    helpers: cUtils.Helpers;
}
/// <reference path="../_ClientTypes.ts" />
import * as cApi from "../../commons/RamAPI";
import * as cUtils from "../../commons/RamUtils";

export interface DefaultIRamScope extends ng.IScope {

}

export interface IRamScope extends DefaultIRamScope {
    helpers: cUtils.Helpers;
    raw_display_mode: boolean;
}
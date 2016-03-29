/// <reference path="../../_ClientTypes.ts" />

import * as api from "../api/IRamScope";
import {IDataTableResponse, IKeyValue, Sample}  from "../../commons/RamAPI";
import {RAMRestServices} from "../services/RAMRestServices.client";

export interface IPartyScope extends ng.IScope {

    // partyTypes: Array<cApi.EntityWithAttributeDef>;
    // roleDefinitions: cApi.EntityWithAttributeDef[];
    // permissionDefinitions: cApi.EntityWithAttributeDef[];
    // identityProviders: cApi.IdentityProvider[];

    partyId: string; // the acting partyId, could you current user or anyone he has authorisation for.
    userId: string; // the user logged in
    myAuthorisation: ITable;
    authorizedForMe: ITable;
}

export interface ITable {
    // getData: (partyId: string, pageNo: number, pageSize: number) => ng.IPromise<IDataTableResponse<Sample>>;
    isLoading: boolean;
    lastResponse: IDataTableResponse<Sample>;
    pageSize: number;
    pageNo: number;
    filters: {
        [index: string]: string;
    };
    sorts: {
        [index: string]: number;
    };
    updatePageSize: (newSize: number) => void
}

class EmptyDataTableResponse implements IDataTableResponse<Sample> {
    total = 0;
    data = new Array<Sample>();
    relationships = new Array<IKeyValue<string>>();
    accessLevels = new Array<IKeyValue<string>>();
    statusValues = new Array<IKeyValue<string>>();
}

export class PartyCtrl {
    public static $inject = [
        "RAMRestServices",
        "$scope",
        "$q"
    ];

    constructor(private RAMRestServices: RAMRestServices, private $scope: IPartyScope, private $q: ng.IQService) {

        // $scope.myAuthorisation = {
        //     getData: (filters: any){
        //         console.log(filters);
        //         $scope.myAuthorisation.isLoading = true;
        //     }
        // };

        $scope.myAuthorisation = {
            isLoading: false,
            lastResponse: new EmptyDataTableResponse(),
            pageSize: 5,
            pageNo: 1,
            filters: {},
            sorts: {},
            updatePageSize: (newPageSize) => {
                $scope.myAuthorisation.pageSize = newPageSize;
                updateTable();
            }
        }


        $scope.$watch("myAuthorisation.sorts", (newSorts, oldSorts) => {
            if (newSorts) {

            } else {

            }
        }, true);

        $scope.$watch<{ [index: string]: string }>("myAuthorisation.filters", (newFilters, oldFilters) => {
            if (newFilters) {
                console.dir(newFilters);
                updateTable();
            } else {

            }
        }, true);

        function updateTable() {
            const auth = $scope.myAuthorisation;
            auth.isLoading = true;
            RAMRestServices.getRelationshipData("partyId", auth.filters, auth.sorts)
                .then((data) => {
                    auth.isLoading = false;
                    auth.lastResponse = data;

                });
        }
        updateTable();
    }
}



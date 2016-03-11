/// <reference path="../../_ClientTypes.ts" />


// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/ng-table/ng-table-tests.ts
// https://github.com/esvit/ng-table/wiki/Configuring-your-table-with-ngTableParams

import * as api from "../api/IRamScope";
import * as restNg from "restangular";
import * as cApi from "../../commons/RamAPI";

export interface Sample {
    name: string;
    rel: string;
    access: string;
    status: string;
    abn?: string;
}

export interface IPartyListScope extends ng.IScope {

    partyId: cApi.EntityID; // what is the currently active partyId

    parties: cApi.IParty[];
    partyTypes: Array<cApi.EntityWithAttributeDef>;
    relationships: cApi.IRelationship[];
    roleDefinitions: cApi.EntityWithAttributeDef[];
    permissionDefinitions: cApi.EntityWithAttributeDef[];
    identityProviders: cApi.IdentityProvider[];
    myAuthorisations: NgTableParams<Sample>;
    othersAuthorisations: NgTableParams<Sample>;
    statusValues: Array<any>;

}

export interface IDataTableResponse<T> {
    total: number;
    data: T[];
}



type NgTableParamsType = { new <T>(baseParameters?: NgTable.IParamValues<T>, baseSettings?: NgTable.ISettings<T>): NgTableParams<T> };

export class PartyListCtrl {
    public static $inject = [
        "NgTableParams",
        "$scope",
        "Restangular",
        "$q"
    ];

    constructor(NgTableParams: NgTableParamsType, private $scope: IPartyListScope, restAngualr: restNg.IService, private $q: ng.IQService) {

        const data: Array<Sample> = [
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "Active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" },
            { name: "Alex Minumus", rel: "User", access: "Universal", status: "active" },
            { name: "B2B business that has trusts in mind", abn: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
            { name: "Cloud software for USI", rel: "Hosted software provider", abn: "22 222 222 222", access: "Universal", status: "Active" },
            { name: "Henry Puffandstuff", rel: "User", access: "Limited", status: "Active" }
        ];

        const tp = new NgTableParams<Sample>({
            count: 10,
            page: 1
        }, {
                counts: [10, 25, 50, 100],
                getData: function(params) {
                    const promise = new $q<IDataTableResponse<Sample>>((resolver) => {
                        const startIdx = (params.page() - 1) * params.count();
                        resolver({ total: data.length, data: data.slice(startIdx, startIdx+params.count()) });
                    }).then((data) => {
                        params.total(data.total);
                        return data.data;
                    });
                    return promise;
                }
            });
        $scope.myAuthorisations = tp;
        $scope.statusValues = [{ id: "Active", title: "Is Active?" }, { id: "Inactive", title: "Inactive?" }];

        // $scope.identityProviders = [{
        //     _id: "ram_provider_id_random_number",
        //     id: "ram_provider_id",
        //     lastUpdatedByPartyId: "part_1",
        //     lastUpdatedTimestamp: new Date(),
        //     deleteIndicator: false,
        //     human_name: "RAM Identity Provider",
        //     defaultExpiryPeriodInDays: 7,
        //     listOfPossibleSecrets: [{
        //         machine_name: "code",
        //         human_name: "Randevú Code",
        //         value: cApi.InputDataTypes.RANDOM_NUMBER
        //     }],
        //     partySepcificInfoDef: [{
        //         machine_name: "ram_id",
        //         human_name: "RAM Identifier",
        //         value: cApi.InputDataTypes.NUMBER
        //     }]
        // }];

        // $scope.party = {
        //     _id: "part_1",
        //     id: "part_1",
        //     lastUpdatedTimestamp: new Date(),
        //     lastUpdatedByPartyId: "part_1",
        //     deleteIndicator: false,
        //     relationshipIds: ["rel1"],
        //     identities: [{
        //         identityProviderId: "ram_provider_id",
        //         partySpecificInfo: [{

        //         }],
        //         answersToSecrets: IEntityAttributeValue < String > [];
        //         claimedTimestamp: new Date(),
        //         expiryTimestamp: new Date(2020, 1, 1),
        //         creatorPartyId: "party_1",
        //         creatorRoleDefId: EntityID;

        //     }],
        //     roles: [{

        //     }],
        //     partyTypeInformation: {

        //     }
        // };

        // $scope.partyTypes = [{
        //     machine_name: "company_party_type",
        //     human_name: "Company",
        //     entityWithAttributeTypes: cApi.EntityWithAttributeTypes.PARTY,
        //     _id: "party_def_company_some_unique_number",
        //     id: "party_def_company",
        //     lastUpdatedTimestamp: new Date(),
        //     lastUpdatedByPartyId: "party_1",
        //     deleteIndicator: false,
        //     listOfAttributes: [
        //         {
        //             machine_name: "abn",
        //             human_name: "ABN",
        //             isRequired: true,
        //             isFreeText: true,
        //             inputDataType: cApi.InputDataTypes.ABN
        //         }
        //     ],
        // }, {
        //         machine_name: "individual_party_type",
        //         human_name: "Individual",
        //         entityWithAttributeTypes: cApi.EntityWithAttributeTypes.PARTY,
        //         _id: "party_def_individual_some_unique_number",
        //         id: "party_def_individual",
        //         lastUpdatedTimestamp: new Date(),
        //         lastUpdatedByPartyId: "party_1",
        //         deleteIndicator: false,
        //         listOfAttributes: [
        //             {
        //                 machine_name: "first_name",
        //                 human_name: "Given name",
        //                 isRequired: true,
        //                 isFreeText: true,
        //                 inputDataType: cApi.InputDataTypes.NAME
        //             },
        //             {
        //                 machine_name: "last_name",
        //                 human_name: "Family name",
        //                 isRequired: true,
        //                 isFreeText: true,
        //                 inputDataType: cApi.InputDataTypes.NAME
        //             },
        //         ],
        //     }];
    }
}

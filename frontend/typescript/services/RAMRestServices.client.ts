/// <reference path="../_ClientTypes.ts" />

import {IDataTableResponse, IKeyValue, Sample}  from "../../commons/RamAPI";

export class RAMRestServices {

    public static $inject = [
        "$timeout",
        "$q"
    ];

    constructor(private $timeout: ng.ITimeoutService, private $q: ng.IQService) {

    }

    getRelationshipData(partyId: string,
        filters: { [index: string]: string }, sorts: { [index: string]: number }): ng.IPromise<IDataTableResponse<Sample>> {
        const deferred = this.$q.defer<IDataTableResponse<Sample>>();

        this.$timeout(() => {
            deferred.resolve({
                total: 100,
                data: this.testData,
                relationships: [{ key: "family", value: "Family" }, { key: "rep", value: "Business Rep" }],
                statusValues: [{ key: "active", value: "Active" }, { key: "inactive", value: "InActive" }],
                accessLevels: [{ key: "universal", value: "Universal" }, { key: "limited", value: "Limited" }]
            });
        }, 1500);
        return deferred.promise;
    }

    testData: Array<Sample> = [
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




}
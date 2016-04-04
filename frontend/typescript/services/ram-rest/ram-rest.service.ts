///<reference path="../../../node_modules/angular2/typings/browser.d.ts"/>

import { Injectable } from "angular2/core";
import {
    RelationshipTableUpdateRequest,
    IDataTableResponse,
    IKeyValue,
    Sample}
from "../../../../commons/RamAPI";

@Injectable()
export class RAMRestService {

    constructor() { }

    getRelationshipData(partyId: string, filters: RelationshipTableUpdateRequest): Promise<IDataTableResponse<Sample>> {
        return new Promise<IDataTableResponse<Sample>>(resolve =>
            setTimeout(() => {
                resolve({
                    total: 100,
                    data: this.testData,
                    relationshipOptions: [{ key: "family", value: "Family" }, { key: "rep", value: "Business Rep" }],
                    statusValueOptions: [{ key: "active", value: "Active" }, { key: "inactive", value: "InActive" }],
                    accessLevelOptions: [{ key: "universal", value: "Universal" }, { key: "limited", value: "Limited" }]
                });
            }, 1500)
        );
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
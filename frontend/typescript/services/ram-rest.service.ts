///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>

import { Injectable } from "angular2/core";
import {
    RelationshipTableReq,
    DataResponse,
    IRelationshipTableRes,
    IRelationshipTableRow,
    NavRes,
    NavReq
} from "../../../commons/RamAPI";

@Injectable()
export class RAMRestService {


    constructor() { }

    getRelationshipData(partyId: string, filters: RelationshipTableReq): Promise<IRelationshipTableRes> {
        return new Promise<IRelationshipTableRes>(resolve =>
            setTimeout(() => {
                resolve({
                    total: 100,
                    data: this.testData,
                    relationshipOptions: ["Family", "Business Rep"],
                    statusValueOptions: ["Active", "Inactive"],
                    accessLevelOptions: ["Universal", "Limited"]
                });
            }, 1500)
        );
    }

    navTo(req: NavReq): Promise<DataResponse<NavRes>> {
        return Promise.resolve({
            isError: false,
            data: {
                partyChain: [{
                    id: "1",
                    name: "name"
                }]
            }
        });
    }


    testData: Array<IRelationshipTableRow> = [
        { name: "Alex Minumus", relId: "123", rel: "User", access: "Universal", status: "Active" },
        { name: "B2B business that has trusts in mind", relId: "123", subName: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
        { name: "Cloud software for USI", rel: "Hosted software provider", relId: "123", subName: "22 222 222 222", access: "Universal", status: "Active" },
        { name: "Henry Puffandstuff", relId: "123", rel: "User", access: "Limited", status: "Active" },
        { name: "Alex Minumus", relId: "123", rel: "User", access: "Universal", status: "active" },
        { name: "B2B business that has trusts in mind", subName: "68 686 868 868", relId: "123", rel: "Represetative", access: "Limited", status: "Active" },
        { name: "Cloud software for USI", relId: "123", rel: "Hosted software provider", subName: "22 222 222 222", access: "Universal", status: "Active" }
    ];

}
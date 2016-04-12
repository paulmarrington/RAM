import { Injectable } from "angular2/core";
import {
    RelationshipTableReq,
    IResponse,
    IRelationshipTableRes,
    IRelationshipTableRow,
    NavRes,
    NavReq,
    IRelationshipQuickInfo
} from "../../../commons/RamAPI";

import Rx from "rxjs/Rx";
import {Http, Response} from "angular2/http";

@Injectable()
export class RAMRestService {

    constructor(private http: Http) {
    }

    getRelationshipData(partyId: string, relPathIds:string[],canActFor: boolean, filters: RelationshipTableReq,
        pageNo: number, pageSize: number): Rx.Observable<IResponse<IRelationshipTableRes>> {
        return Rx.Observable.of<IResponse<IRelationshipTableRes>>({
            status: 200,
            data: {
                relationshipOptions: ["Family", "Business Rep"],
                statusValueOptions: ["Active", "Inactive"],
                accessLevelOptions: ["Universal", "Limited"],
                total: 100,
                table: [{ name: "Alex Minumus", relId: "123", rel: "User", access: "Universal", status: "Active" },
                    { name: "B2B business that has trusts in mind", relId: "123", subName: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
                    { name: "Cloud software for USI", rel: "Hosted software provider", relId: "123", subName: "22 222 222 222", access: "Universal", status: "Active" },
                    { name: "Henry Puffandstuff", relId: "123", rel: "User", access: "Limited", status: "Active" },
                    { name: "Alex Minumus", relId: "123", rel: "User", access: "Universal", status: "active" },
                    { name: "B2B business that has trusts in mind", subName: "68 686 868 868", relId: "123", rel: "Represetative", access: "Limited", status: "Active" },
                    { name: "Cloud software for USI", relId: "123", rel: "Hosted software provider", subName: "22 222 222 222", access: "Universal", status: "Active" }]
            }
        });
    }

    getNavCrumb(partyId: string, path: string[]): Rx.Observable<IResponse<NavRes>> {
        return Rx.Observable.of<IResponse<NavRes>>({
            status: 200,
            data: {
                partyChain: [{
                    id: "1",
                    name: ("name" + Math.random())
                }]
            }
        });
    }

}
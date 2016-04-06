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

import Rx from "rxjs/Rx";
import {HTTP_PROVIDERS} from "angular2/http";

@Injectable()
export class RAMRestService {
    private _counter = 0;
    constructor() {
    }

    getRelationshipData(partyId: string, canActFor: boolean, filters: RelationshipTableReq, pageNumber: number, pageSize: number): Rx.Observable<IRelationshipTableRes> {
        let toReturn = Rx.Observable.create((observer: Rx.Observer<IRelationshipTableRes>) => {
            let data = (canActFor ? this.testData1 : this.testData2);
            setTimeout(() => {
                this._counter += 1;
                observer.next({
                    total: 100,
                    data: (() => {

                        data.map((v) => {
                            v.name = `${v.name} ${this._counter}`;
                            return v;
                        });
                        return data;
                    })(),
                    relationshipOptions: ["Family", "Business Rep"],
                    statusValueOptions: ["Active", "Inactive"],
                    accessLevelOptions: ["Universal", "Limited"]
                });
                observer.complete();
            }, 500);
        }).publishLast();
        let connection = toReturn.connect();
        return toReturn;
    }

    navTo(req: NavReq): Rx.Observable<DataResponse<NavRes>> {
        return Rx.Observable.create((observer: Rx.Observer<DataResponse<NavRes>>) => {
            observer.next({
                isError: false,
                data: {
                    partyChain: [{
                        id: "1",
                        name: "name"
                    }]
                }
            });
            observer.complete();
        });
    }


    testData1: Array<IRelationshipTableRow> = [
        { name: "Alex Minumus", relId: "123", rel: "User", access: "Universal", status: "Active" },
        { name: "B2B business that has trusts in mind", relId: "123", subName: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
        { name: "Cloud software for USI", rel: "Hosted software provider", relId: "123", subName: "22 222 222 222", access: "Universal", status: "Active" },
        { name: "Henry Puffandstuff", relId: "123", rel: "User", access: "Limited", status: "Active" },
        { name: "Alex Minumus", relId: "123", rel: "User", access: "Universal", status: "active" },
        { name: "B2B business that has trusts in mind", subName: "68 686 868 868", relId: "123", rel: "Represetative", access: "Limited", status: "Active" },
        { name: "Cloud software for USI", relId: "123", rel: "Hosted software provider", subName: "22 222 222 222", access: "Universal", status: "Active" }
    ];
    testData2: Array<IRelationshipTableRow> = [
        { name: "lex Minumus", relId: "123", rel: "User", access: "Universal", status: "Active" },
        { name: "2B business that has trusts in mind", relId: "123", subName: "68 686 868 868", rel: "Represetative", access: "Limited", status: "Active" },
        { name: "loud software for USI", rel: "Hosted software provider", relId: "123", subName: "22 222 222 222", access: "Universal", status: "Active" },
        { name: "enry Puffandstuff", relId: "123", rel: "User", access: "Limited", status: "Active" },
        { name: "lex Minumus", relId: "123", rel: "User", access: "Universal", status: "active" },
        { name: "2B business that has trusts in mind", subName: "68 686 868 868", relId: "123", rel: "Represetative", access: "Limited", status: "Active" },
        { name: "loud software for USI", relId: "123", rel: "Hosted software provider", subName: "22 222 222 222", access: "Universal", status: "Active" }
    ];

}
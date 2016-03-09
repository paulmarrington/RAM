/// <reference path="../../_ClientTypes.ts" />

import * as api from "../api/IRamScope";
import * as cApi from "../../commons/RamAPI";
import * as cUtils from "../../commons/RamUtils";
import * as restNg from "restangular";

export class HomeCtrl {
    public static $inject = [
        "$scope",
        "Restangular"
    ];

    constructor(
        private $scope: api.IRamScope, restNg: restNg.IService
    ) {
        const categories = {
            category_groups: [{ "name": "category" }, { name: "category" }, { name: "category" }],
            categories: [{ name: "Business Representative", category: 1 },
                { name: "Online Service provider", category: 1 },
                { name: "Insolvency practitioner", category: 1 },
                { name: "Trusted Intermediary", category: 1 },
                { name: "Doctor Patient", category: 1 },
                { name: "Nominated Entity", category: 1 },
                { name: "Power of Attorney (Voluntary)", category: 2 },
                { name: "Power of Attorney (Involuntary)", category: 2 },
                { name: "Executor of deceased estate", category: 3 },
                { name: "Institution to student", category: 3 },
                { name: "Training organisations (RTO)", category: 3 },
                { name: "Parent - Child", category: 1 },
                { name: "Employment Agents", category: 1 }]
        };

        $scope.helpers = cUtils.Helpers;
        let relations = restNg.all("relations");
        relations.one("123").getList().then((individual_business_authorisations: Array<cApi.IndividualBusinessAuthorisation>) => {
            $scope.individual_business_authorisations = individual_business_authorisations;
        });
    }
}

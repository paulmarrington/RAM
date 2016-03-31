// export interface IPartyScope extends ng.IScope {

//     // partyTypes: Array<cApi.EntityWithAttributeDef>;
//     // roleDefinitions: cApi.EntityWithAttributeDef[];
//     // permissionDefinitions: cApi.EntityWithAttributeDef[];
//     // identityProviders: cApi.IdentityProvider[];

//     partyId: string; // the acting partyId, could you current user or anyone he has authorisation for.
//     userId: string; // the user logged in
//     myAuthorisation: ITable;
//     authorizedForMe: ITable;
// }

// export interface ITable {
//     // getData: (partyId: string, pageNo: number, pageSize: number) => ng.IPromise<IDataTableResponse<Sample>>;
//     isLoading: boolean;
//     lastResponse: IDataTableResponse<Sample>;
//     pageSize: number;
//     pageNo: number;
//     filters: {
//         [index: string]: string;
//     };
//     sorts: {
//         [index: string]: number;
//     };
//     updatePageSize: (newSize: number) => void
// }
//     constructor(private RAMRestServices: RAMRestServices, private $scope: IPartyScope, private $q: ng.IQService) {

//         // $scope.myAuthorisation = {
//         //     getData: (filters: any){
//         //         console.log(filters);
//         //         $scope.myAuthorisation.isLoading = true;
//         //     }
//         // };

//         $scope.myAuthorisation = {
//             isLoading: false,
//             lastResponse: new EmptyDataTableResponse(),
//             pageSize: 5,
//             pageNo: 1,
//             filters: {},
//             sorts: {},
//             updatePageSize: (newPageSize) => {
//                 $scope.myAuthorisation.pageSize = newPageSize;
//                 updateTable();
//             }
//         }

//         $scope.$watch<{ [index: string]: string }>("myAuthorisation.filters", (newFilters, oldFilters) => {
//             if (newFilters) {
//                 console.dir(newFilters);
//                 updateTable();
//             } else {

//             }
//         }, true);

//         function updateTable() {
//             const auth = $scope.myAuthorisation;
//             auth.isLoading = true;
//             RAMRestServices.getRelationshipData("partyId", auth.filters, auth.sorts)
//                 .then((data) => {
//                     auth.isLoading = false;
//                     auth.lastResponse = data;

//                 });
//         }
//         updateTable();
//     }
// }
// // category_groups: [{ "name": "category" }, { name: "category" }, { name: "category" }],
// //             categories: [{ name: "Business Representative", category: 1 },
// //                 { name: "Online Service provider", category: 1 },
// //                 { name: "Insolvency practitioner", category: 1 },
// //                 { name: "Trusted Intermediary", category: 1 },
// //                 { name: "Doctor Patient", category: 1 },
// //                 { name: "Nominated Entity", category: 1 },
// //                 { name: "Power of Attorney (Voluntary)", category: 2 },
// //                 { name: "Power of Attorney (Involuntary)", category: 2 },
// //                 { name: "Executor of deceased estate", category: 3 },
// //                 { name: "Institution to student", category: 3 },
// //                 { name: "Training organisations (RTO)", category: 3 },
// //                 { name: "Parent - Child", category: 1 },
// //                 { name: "Employment Agents", category: 1 }]
// //         };
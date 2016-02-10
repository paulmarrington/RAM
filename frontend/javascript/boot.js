var angular = require("angular");
var anguarUi = require("angular-ui-router");
var angularLoadingBar = require("angular-loading-bar");
var _ = require("lodash");
var restangular = require("restangular");
var angularFilters = require("angular-filter");

var app = require("javascript/app");

angular.element(document).ready(function() {
	return angular.bootstrap(document.body, ['ram']);
});

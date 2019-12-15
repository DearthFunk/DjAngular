angular.module('uiModule')

	.service('uiToolTipService', function(){

		var uiScope = this;
		uiScope.trigger = "mouseenter";
		uiScope.values = {};

	});
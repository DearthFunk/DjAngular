angular.module('filterGroup', [])

	.directive('fxFilter', function () {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/filter/filter.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {


                scope.optionWaveTypes = filterTypes;
			}
		}
	});
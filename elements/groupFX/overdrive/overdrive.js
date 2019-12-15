angular.module('overdriveGroup', [])

	.directive('fxOverdrive', function () {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/overdrive/overdrive.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {

                scope.filterTypes = overdriveFilterTypes;

			}
		}
	});
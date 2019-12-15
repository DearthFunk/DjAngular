angular.module('wahwahGroup', [])

	.directive('fxWahwah', function () {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/wahwah/wahwah.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {


			}
		}
	});
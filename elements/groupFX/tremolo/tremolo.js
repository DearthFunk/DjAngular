angular.module('tremoloGroup', [])

	.directive('fxTremolo', function () {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/tremolo/tremolo.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {


			}
		}
	});
angular.module('convolverGroup', [])

	.directive('fxConvolver', function () {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/convolver/convolver.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {


			}
		}
	});
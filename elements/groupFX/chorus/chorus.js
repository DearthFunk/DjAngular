angular.module('chorusGroup', [])

	.directive('fxChorus', function () {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/chorus/chorus.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {

			}
		}
	});
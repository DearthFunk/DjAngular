angular.module('sampleModifierGroup', [])

	.directive('sampleModifier', function () {
		return {
			restrict:'C',
			scope: {
				entry: "=entry"
			},
			templateUrl:'elements/group/sampleModifier/sampleModifier.html',
			replace: true,
			link: function(scope) {

                scope.loopValues = speedValues;

			}
		}
	});
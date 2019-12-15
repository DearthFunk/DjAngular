angular.module('delayGroup', [])

	.directive('fxDelay', function (uiThemeService) {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/delay/delay.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {

				scope.themeService = uiThemeService;



			}
		}
	});
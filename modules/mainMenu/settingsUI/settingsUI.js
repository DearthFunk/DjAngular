angular.module('settingsUIModule', [])

	.directive('settingsUI', function (uiService) {
		return {
			restrict:'C',
			templateUrl:'modules/mainMenu/settingsUI/settingsUI.html',
			replace: true,
			scope: {

			},
			link: function(scope) {

				scope.uiService = uiService;


			}
		}
	});
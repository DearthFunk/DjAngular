angular.module('settingsVisualizationsModule', [])

	.directive('settingsVisualizations', function (uiService,uiThemeService,visualizationThemeService) {
		return {
			restrict:'C',
			templateUrl:'modules/mainMenu/settingsVisualizations/settingsVisualizations.html',
			replace: true,
			link: function(scope) {

				scope.themeService = uiThemeService;
                scope.visTheme = visualizationThemeService;

				scope.resetSection = function(which) {
					for (var key in visualizationThemeService.styles) {
						if (which == visualizationThemeService.styles[key].name) {
							visualizationThemeService.styles[key] = clone(visDefaults[key]);
						}
					}
				}

			}
		}
	});
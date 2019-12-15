angular.module('actionIconsElement', [])

	.directive('actionIcons', function(uiThemeService, uiService, uiToolTipService) {
		return {
			restrict:'C',
			scope: {
				repeatIndex: "=repeatIndex",
				entry: "=entry",
				fontSize: "=fontSize",
				iconEntries: "=iconEntries"
			},
			templateUrl:'elements/single/actionIcons/actionIcons.html',
			replace: true,
			link: function(scope,elem) {

				scope.actualFontSize    = typeof scope.fontSize     == 'undefined' ? 21 : scope.fontSize;
				scope.themeService = uiThemeService;
				scope.uiService = uiService;
				scope.uiToolTipService = uiToolTipService;


			}
		}
	});
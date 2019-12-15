angular.module('groupActivatorsElement', [])

	.directive('groupActivators', function (uiThemeService) {
		return {
			restrict:'C',
			scope: {
				groups: "=groups",
				changeAction: "=changeAction"
			},
			templateUrl:'elements/single/groupActivators/groupActivators.html',
			replace: true,
			link: function(scope) {

				scope.themeService = uiThemeService;

				scope.changeValue = function(val) {
					scope.groups[val].active = !scope.groups[val].active;
					if (scope.changeAction != undefined) {
						scope.changeAction.toRun(val);
					}
				};

			}
		}
	});
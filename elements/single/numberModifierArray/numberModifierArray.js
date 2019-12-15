angular.module('numberModifierArrayElement', [])

	.directive('numberModifierArray', function (uiThemeService, $sce) {
		return {
			restrict:'C',
			scope: {
				index: "=index",
				itemArray: "=itemArray",
                label: "=label"
			},
			templateUrl:'elements/single/numberModifierArray/numberModifierArray.html',
			replace: true,
			link: function(scope) {

				scope.themeService = uiThemeService;

				scope.bindCharacter = function(val) {
					return $sce.trustAsHtml(val);
				};

				scope.changeValue = function(val) {
					if (scope.index + val >= 0 && scope.index + val < scope.itemArray.length) {
						scope.index += val
					}
				}
			}
		}
	});
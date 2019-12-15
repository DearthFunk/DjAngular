angular.module('buttonSelectorElement', [])

	.directive('buttonSelector', function(uiThemeService, uiToolTipService) {
		return {
			restrict:'C',
			scope: {
				selectedItem: "=selectedItem",
				totalItems: "=totalItems",
				changeAction: "=changeAction",
				sendPlacement: "=sendPlacement",
				sendPopover: "=sendPopover"
			},
			templateUrl:'elements/single/buttonSelector/buttonSelector.html',
			replace: true,
			link: function(scope) {

				scope.uiToolTipService = uiToolTipService;
				scope.themeService = uiThemeService;
				scope.lengthOfArray = [];
				for (var i = 0; i < scope.totalItems; i++) {
					scope.lengthOfArray.push("");
				}


				scope.getNumber = function(num) {
					return new Array(num);
				};

				scope.changeVal = function(i) {
					scope.selectedItem = i;
					if (scope.changeAction != undefined) {
						scope.changeAction.functionToRun(i);
					}
				};


			}
		}
	});

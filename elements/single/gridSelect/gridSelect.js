angular.module('gridSelectElement', [])

	.directive('gridSelect', function(uiThemeService) {
		return {
			restrict:'C',
			scope: {
				gridValue: "=gridValue",
				gridLength: "=gridLength",
				callBackFunction: "=callBackFunction"
			},
			templateUrl:'elements/single/gridSelect/gridSelect.html',
			replace: true,
			link: function(scope) {

				scope.themeService = uiThemeService;

				scope.getArray=function(n){	return new Array(n);};

				var previousIndex = scope.gridValue;

				scope.selectGroup = function(index){
					index == previousIndex ?
						scope.gridValue = -1 :
						scope.gridValue = index;
					previousIndex = scope.gridValue;
					if (scope.callBackFunction != undefined) {
						scope.callBackFunction.toRun(index);
					}
				};
			}
		}
	});
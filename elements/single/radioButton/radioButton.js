angular.module('radioButtonElement', [])

	.directive('radioButton', function (uiThemeService) {
		return {
			restrict:'C',
			scope: {
				checkValue: "=checkValue",
				size: "=size",
                side: "=side",
				label: "=label",
				width: "=width"
			},
			templateUrl:'elements/single/radioButton/radioButton.html',
			replace: true,
			link: function(scope,element) {

				scope.themeService = uiThemeService;

                scope.whichSide = scope.side == undefined ? 1 : scope.side;

				element[0].style.width              = scope.width + 'px';
				element[0].children[0].style.width  = scope.size + 'px';
				element[0].children[0].style.height = scope.size + 'px';

			}
		}
	});
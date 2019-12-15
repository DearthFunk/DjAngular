angular.module('radioButtonsGroup', [])

	.directive('radioButtons', function () {
		return {
			restrict:'C',
			scope: {
				radios: "=radios"
			},
			templateUrl:'elements/group/radioButtons/radioButtons.html',
			replace: true,
			link: function(scope,element) {


			}
		}
	});
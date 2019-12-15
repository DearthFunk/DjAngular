angular.module('cabinetGroup', [])

	.directive('fxCabinet', function () {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/cabinet/cabinet.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {


                console.log(1);

			}
		}
	});
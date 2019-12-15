angular.module('phaserGroup', [])

	.directive('fxPhaser', function () {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/phaser/phaser.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {


			}
		}
	});
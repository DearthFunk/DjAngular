angular.module('compressorGroup', [])

	.directive('fxCompressor', function () {
		return {
			restrict:'C',
			templateUrl:'elements/groupFX/compressor/compressor.html',
			replace: true,
			scope: {
				values: "=values",
				showBypass: "=showBypass"
			},
			link: function(scope,element) {


			}
		}
	});
angular.module('masterCompressorGroup', [])

	.directive('masterCompressor', function() {
		return {
			restrict:'C',
			scope: {
				channelData: "=channelData"
			},
			templateUrl:'elements/group/masterCompressor/masterCompressor.html',
			replace: true,
			link: function(scope) {

			}
		}
	});

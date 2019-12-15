angular.module('lineInModule', [])

	.directive('lineIn', function (uiThemeService,audioChannelsService,audioProcessingService) {
		return {
			restrict:'C',
			templateUrl:'modules/lineIn/lineIn.html',
			replace: true,
			link: function(scope,element) {

				var microphone;
				scope.themeService = uiThemeService;
				scope.activeMic = false;

				scope.$on('$destroy', function(event, args) {
					if (microphone != undefined) { microphone.disconnect(); }
				});

				scope.toggleMic = function() {
					scope.activeMic = !scope.activeMic;
					if (microphone != undefined ){
						scope.activeMic ?
							microphone.connect(scope.channel.nodePanner) :
							microphone.disconnect();
					}
				};

				navigator.webkitGetUserMedia({audio: true}, function(stream) {
					microphone = audioProcessingService.context.createMediaStreamSource(stream);
				}, function(e){
					console.log("error connecting microphone: ",e);
				});



			}
		}
	});
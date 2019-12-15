angular.module('loadingAnimationModule', [])

	.directive('loadingAnimation', function (audioProcessingService, uiThemeService, $timeout) {
		return {
			restrict:'C',
			templateUrl:'modules/loadingAnimation/loadingAnimation.html',
			replace: true,
			scope: {}, //scope needs to be defined in order for destroy to work correctly
			link: function(scope,element) {

				var fadeOutProm;
				scope.totalSamples = audioProcessingService.samples.length;
				scope.loadingText = [];
				scope.mainOpacity = 10;
				scope.counter = "";
                scope.themeService = uiThemeService;


				scope.$on('sampleLoad',  function(event, index, url, name, buffer) { updateText(true, index,name,url);  });
				scope.$on('sampleError', function(event, index, url, name, buffer) { updateText(false,index,name,url);  });
				scope.$on('sampleLoadComplete', function(event){ fadeOut(); });

				var fadeOut = function() {
					if (scope.mainOpacity > 0) {
						scope.mainOpacity -= 1;
						fadeOutProm = $timeout(fadeOut, 100);
					}
					else {
						scope.$destroy();
						$timeout.cancel(fadeOutProm);
						element.remove();
					}

				};

				function updateText(which,index,name,url) {
					scope.loadingText.push({
						success: which,
						textValue: which ?
							index + ": " + url + " - 100%..." :
							index + ": " + url + " - ERROR",
						name: "( " + name + " )"
					});
					scope.counter = ("000" + scope.loadingText.length).slice(-3) + "/" + scope.totalSamples;
				}


				audioProcessingService.init();

			}
		}
	})
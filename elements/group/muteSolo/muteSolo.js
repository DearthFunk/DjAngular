angular.module('muteSoloGroup', [])

    .directive('muteSolo', function($compile, audioProcessingService, uiThemeService) {
        return {
            restrict:'C',
            scope: {
                channelData: "=channelData"
            },
            templateUrl:'elements/group/muteSolo/muteSolo.html',
            replace: true,
            link: function(scope,elem) {

	            scope.themeService = uiThemeService;
                scope.audioProcessingService = audioProcessingService;

				if (scope.channelData.channelType == intChannelTypeMaster) {
					elem[0].children[1].style.display = 'none';
					var myElement = angular.element(document.createElement("div"));
					myElement.addClass("masterRecorder");
					elem[0].appendChild(myElement[0]);
					var containerScope = scope.$new();
					$compile(myElement)(containerScope);
				}


            }
        }
    });
